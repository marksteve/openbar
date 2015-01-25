var sjcl = require('sjcl');


function hashBarId(passphrase, barId) {
  var h = new sjcl.hash.sha256();
  h.update(barId);
  h.update(passphrase);
  h.update(barId);
  return sjcl.codec.base64url.fromBits(h.finalize());
}

function generateCipherKey() {
  return sjcl.codec.base64url.fromBits(sjcl.random.randomWords(24));
}

function encryptData(key, data) {
  return sjcl.encrypt(key, JSON.stringify(data));
}

function decryptData(key, encryptedData) {
  return JSON.parse(sjcl.decrypt(key, encryptedData));
}

module.exports = {
  hashBarId: hashBarId,
  generateCipherKey: generateCipherKey,
  encryptData: encryptData,
  decryptData: decryptData
}
