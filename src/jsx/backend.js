require('firebase');
require('./MediaStreamRecorder');

var conf = window.__env || require('../../conf');
var cryph = require('./cryptohelper');

var Moniker = require('moniker');
var randomColor = require('randomcolor');

var rootRef = new Firebase(conf.FIREBASE_URL);
var barsRef = rootRef.child("bars");

function Bar(barId, ref, info, cipherKey) {
  this.cipherKey = cipherKey;
  this.barId = barId;
  this.ref = ref;
  info = this._unmarshal(info);
  this.title = info.title;
}

Bar.prototype.initNumMessages = 50;

Bar.prototype.onMessage = function(callback) {
  this.ref.child("messages").limitToLast(this.initNumMessages).on("child_added", function(ss) {
    callback(this._unmarshal(ss.val()));
  }.bind(this));
};

Bar.prototype.newMessage = function(message) {
  return this.ref.child("messages").push(this._marshal(message));
};

Bar.prototype.addUser = function(user) {
  this.ref.child("users").child(user.key).set(this._marshal(user));
  return user;
};

Bar.prototype.getUser = function(key, callback, errCallback) {
  this.ref.child("users").child(key).once("value", function(ss) {
    if (ss.exists()) {
      callback(this._unmarshal(ss.val()));
    } else {
      errCallback(new Error("User does not exist."));
    }
  }.bind(this));
};

Bar.prototype.checkAuth = function(cb, errCb) {
  rootRef.onAuth(this._checkAuth(cb, errCb));
};

Bar.prototype._checkAuth = function(cb, errCb) {
  return (function(authData) {
    if (authData) {
      this.getOrAddUser(authData, cb, errCb);
    } else {
      rootRef.authAnonymously((function(error, authData) {
        if (error) {
          errCb(new Error("Failed to login. Net flaky?"));
        } else {
          this.getOrAddUser(authData, cb, errCb);
        }
      }).bind(this));
    }
  }).bind(this);
};

Bar.prototype.getOrAddUser = function(authData, cb, errCb) {
  this.getUser(
    authData.uid,
    cb,
    (function() {
      cb(this.addUser({
        key: authData.uid,
        name: Moniker.choose(),
        color: randomColor({
          luminosity: 'light'
        })
      }));
    }).bind(this),
    errCb
  );
};

Bar.prototype.authAnonymously = function(cb, options) {
  rootRef.authAnonymously((function(error, authData) {
    if (error) {
      return cb(error);
    }
  }).bind(this), options);
};

Bar.prototype._marshal = function(data) {
  if (this.cipherKey) {
    return cryph.encryptData(this.cipherKey, data);
  } else {
    return data;
  }
};


Bar.prototype._unmarshal = function(marshalledData) {
  if (this.cipherKey) {
    return cryph.decryptData(this.cipherKey, marshalledData);
  } else {
    return marshalledData;
  }
};

Bar.create = function(title, passphrase) {
  var cipherKey = null;
  var barId = barsRef.push().key();
  var barKey = barId;
  var info = {title: title};
  var meta = {};
  if (passphrase) {
    barKey = cryph.hashBarId(passphrase, barId);
    cipherKey = cryph.generateCipherKey();
    meta.encryptedKey = cryph.encryptData(passphrase, cipherKey);
    info = cryph.encryptData(cipherKey, info);
  }
  meta.info = info;
  var ref = barsRef.child(barKey);
  ref.set({meta: meta});
  return new Bar(barId, ref, info, cipherKey);
};

Bar.get = function(barId, passphrase, callback, errCallback) {
  var key = barId;
  if (passphrase) {
    key = cryph.hashBarId(passphrase, barId);
  }
  var ref = barsRef.child(key);
  ref.child("meta").once("value", function(ss) {
    if (ss.exists()) {
      var meta = ss.val();
      var cipherKey = null;
      if (passphrase) {
        cipherKey = cryph.decryptData(passphrase, meta.encryptedKey);
      }
      callback(new Bar(barId, ref, meta.info, cipherKey));
    } else {
      errCallback(new Error("Bar does not exist."));
    }
  }, errCallback);
};

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

function VideoRecorder(videoElem, finishCallback, errCallback, stopCallback) {
  this.videoElem = videoElem;
  this.finishCallback = finishCallback;
  this.errCallback = errCallback;
  this.stopCallback = stopCallback;
  this.stream = null;
  this.recorder = null;
}

VideoRecorder.prototype.start = function() {
  if (!VideoRecorder.capable) {
    this.errCallback("Browser incapable");
    return;
  }
  navigator.getUserMedia(
    {video: true, audio: true},
    this._record.bind(this),
    this.errCallback
  );
};

VideoRecorder.prototype.stop = function() {
  if (this.recorder) {
    this.recorder.stop();
    this.stream.stop();
    this.recorder = null;
    this.stream = null;
  }
  this.stopCallback();
};

VideoRecorder.prototype._record = function(stream) {
  this.stream = stream;
  this.videoElem.src = window.URL.createObjectURL(stream);
  this.recorder = new MultiStreamRecorder(stream);
  this.recorder.ondataavailable = this._upload.bind(this);
  this.recorder.start(this.maxDuration + 500); // some margin
  setTimeout(this.stop, this.maxDuration);
};

VideoRecorder.prototype._upload = function(blobs) {
  // MediaStreamRecorder supports getting both video and audio in one
  // blob for Firefox.
  var isFirefox = !!navigator.mozGetUserMedia;
  var assemblyUrl = "https://api2.transloadit.com/assemblies";
  var params = {
    auth: {
      key: conf.TRANSLOADIT_KEY,
    },
    steps: {
      output: {
        robot: "/video/merge",
        preset: "webm",
        ffmpeg_stack: "v2.2.3",
        use: {
          steps: [
            {name: ":original", fields: "video", as: "video"},
            {name: ":original", fields: "audio", as: "audio"}
          ]
        }
      }
    }
  };
  if (isFirefox) {
    params.steps.output = {
      robot: "/video/encode",
      preset: "webm",
      use: ":original"
    };
  }
  var formData = new FormData();
  formData.append("params", JSON.stringify(params));
  formData.append("video", blobs.video);
  if (!isFirefox) {
    formData.append("audio", blobs.audio);
  }
  var request = new XMLHttpRequest();
  var listen = function() {
    if (request.readyState != 4) {
      // TODO: Better error handling.
      return;
    }
    if (request.status == 200) {
      var data = JSON.parse(request.responseText);
      if (data.ok == "ASSEMBLY_EXECUTING") {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = listen.bind(this);
        request.open("GET", data.assembly_ssl_url);
        setTimeout(function() { request.send(); }, 2000);
      } else if (data.ok == "ASSEMBLY_COMPLETED") {
        this.finishCallback(data.results.output[0].url);
      } else {
        this.errCallback(new Error("Unexpected response: " + data.ok));
      }
    } else {
      this.errCallback(new Error("Unexpected response: " + request.status));
    }
  };
  request.onreadystatechange = listen.bind(this);
  request.open("POST", assemblyUrl);
  request.send(formData);
};

VideoRecorder.prototype.maxDuration = 20000;

VideoRecorder.capable = !!navigator.getUserMedia;

module.exports = {
  Bar: Bar,
  VideoRecorder: VideoRecorder
};

// for debugging
window.root = rootRef;
window.cryph = cryph;
window.Bar = Bar;
