const CryptoJS = require('crypto-js');

const descryptId=(id)=>{
    // const encryptedText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    // const decryptedText = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(CryptoJS.enc.Utf8);

    let userId = CryptoJS.AES.decrypt(id, "clave_secreta").toString(CryptoJS.enc.Utf8)

    return userId
}

module.exports=descryptId