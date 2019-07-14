import * as CryptoJS from "crypto-js";

const base64Key = CryptoJS.enc.Base64.parse("lmkeg89M0KNLK8kwe5fwssslkdwkjenl");
const iv = CryptoJS.enc.Base64.parse("lsddmlslblw9dlwldkwn23$3rflswekn");

const MoviesService = {
  setStorageData(data, item_name) {
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), base64Key, { iv: iv });
    localStorage.setItem(item_name, encrypted.toString());
  },
  getStorageData(item_name) {
    const item = localStorage.getItem(item_name);

    if (item == null) return null;
    let decrypted = CryptoJS.AES.decrypt(item, base64Key, { iv: iv });
    let descrString = decrypted.toString(CryptoJS.enc.Utf8);
    let data = JSON.parse(descrString);
    return data;
  },
  clearStorageData(item_name) {
    localStorage.removeItem(item_name);
  }
};
export default MoviesService;
