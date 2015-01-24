require('firebase');
require('./MediaStreamRecorder.js');


var rootRef = new Firebase('https://space-bar.firebaseio.com/');
var barsRef = rootRef.child("bars");

function Bar(ref, meta) {
  this.ref = ref;
  this.title = meta.title;
}

Bar.prototype.onMessage = function(callback) {
  this.ref.child("messages").on("child_added", function(ss) {
    callback(ss.val());
  });
};

Bar.prototype.newMessage = function(message) {
  this.ref.child("messages").push(message);
};

Bar.create = function(title) {
  var meta = {title: title};
  var ref = barsRef.push({meta: meta});
  return new Bar(ref, meta);
};

Bar.get = function(key, callback, errCallback) {
  var ref = barsRef.child(key);
  ref.child("meta").once("value", function(ss) {
    if (ss.exists()) {
      callback(new Bar(ref, ss.val()));
    } else {
      errCallback(new Error("Bar does not exist."));
    }
  }, errCallback);
};


navigator.getUserMedia  = navigator.getUserMedia ||
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
  navigator.getUserMedia({video: true, audio: true}, this._record.bind(this), this.errCallback);
};
VideoRecorder.prototype.stop = function() {
  if (this.recorder) {
    this.recorder.stop();
    this.stream.stop();
    this.recorder = null;
    this.stream = null;
    this.stopCallback();
  }
};
VideoRecorder.prototype._record = function(stream) {
  this.stream = stream;
  this.videoElem.src = window.URL.createObjectURL(stream);
  // TODO: Firefox has support for recording both at the same
  // time. But if this works as well, then maybe it's not needed.
  this.recorder = new MultiStreamRecorder(stream);
  this.recorder.ondataavailable = this._upload.bind(this);
  this.recorder.start(this.maxDuration + 500); // some margin
  setTimeout(this.stop, this.maxDuration);
};
VideoRecorder.prototype._upload = function(blobs) {
  var assemblyUrl = "https://api2.transloadit.com/assemblies";
  var params = {
    auth: {
      key: "881f9c80a3a211e4810a1b7d5c598c19",
    },
    steps: {
      merge: {
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
  var formData = new FormData();
  formData.append("params", JSON.stringify(params));
  formData.append("audio", blobs.audio);
  formData.append("video", blobs.video);
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
        this.finishCallback(data.results.merge[0].url);
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
