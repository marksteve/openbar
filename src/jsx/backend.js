require('firebase');

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


module.exports = {
  Bar: Bar
};

// for debugging
window.root = rootRef;
