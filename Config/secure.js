const CryptoJS = require("crypto-js");
require('dotenv').config();

const key = process.env.WEB4ASSET_KEY;
const encryptionKey = process.env.ENCRYPTION_KEY;  // A passphrase to encrypt

// Encrypt
const encryptedKey = CryptoJS.AES.encrypt(key, encryptionKey).toString();
console.log("Encrypted Key:", encryptedKey);

// Decrypt
const bytes = CryptoJS.AES.decrypt(encryptedKey, encryptionKey);
const originalKey = bytes.toString(CryptoJS.enc.Utf8);
console.log("Decrypted Key:", originalKey);
