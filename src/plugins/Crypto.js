const cryptLib = require('@skavinvarnan/cryptlib');

export default class Crypto {
  static async Decrypt(encryptedString, key) {
    const decryptedString = cryptLib.decryptCipherTextWithRandomIV(encryptedString, key);
    console.log('decryptedString %s', decryptedString);

    return decryptedString;
  }

}
