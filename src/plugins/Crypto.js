const cryptLib = require('@skavinvarnan/cryptlib');
import key from "../config/env.js";

export default class Crypto{

  static Decrypt(encryptedString, key){
    const cipherText = cryptLib.encryptPlainTextWithRandomIV(plainText, key);
    console.log('cipherText %s', cipherText);

    const decryptedString = cryptLib.decryptCipherTextWithRandomIV(encryptedString, key);
    console.log('decryptedString %s', decryptedString);

    return decryptedString;
  }

}
