const cryptLib = require('@skavinvarnan/cryptlib');

export default class Crypto{

  static Decrypt(encryptedString){
    const key = "your key";

    // const cipherText = cryptLib.encryptPlainTextWithRandomIV(plainText, key);
    // console.log('cipherText %s', cipherText);

    const decryptedString = cryptLib.decryptCipherTextWithRandomIV(encryptedString, key);
    console.log('decryptedString %s', decryptedString);

    return decryptedString;
  }

}
