import utils from "../modules/utils";
let app = getApp();

let isIOS = wx.getSystemInfoSync().system.match(/ios/i);

Compoennt({
  data() {
    return {
      username: "aliarmo",
      password: "123"
    };
  }
});