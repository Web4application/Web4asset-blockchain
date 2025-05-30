import crypto from "crypto";

export function decryptPrivateKey(encryptedKey, passphrase) {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      crypto.scryptSync(passphrase, "salt", 32),
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(Buffer.from(encryptedKey, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf-8");
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
}
