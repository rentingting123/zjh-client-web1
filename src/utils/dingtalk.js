import * as dd from "dingtalk-jsapi";
import { appCronId } from "@/api/home";
import { jsAuth } from '@/api/dingtalk'

// url: 'http://zjh-client.dev.mycloudedu.net/home'//  测试
// url: 'https://zjh.zju.edu.cn' // 正式
export function goDingOpen(dingUserId) {
  // var u = navigator.userAgent;
  // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //Android终端
  // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //iOS终端
  // alert("访问地址111" + location.href);
  // let isAndroidUrl = url ? url : location.href
  let obj = {
    // url: isAndroid ? isAndroidUrl : isiOS ? location.href : location.href
    url: location.href
  }
  // alert("提交地址222" + obj.url);
  jsAuth(obj).then((res) => {
    dd.config({
      agentId: res.result.agentId, // 必填，微应用ID
      corpId: res.result.corpId,//必填，企业ID
      timeStamp: res.result.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.result.nonceStr, // 必填，自定义固定字符串。
      signature: res.result.signature, // 必填，签名
      type: res.result.type,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
      jsApiList: [
        'biz.util.open',
      ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    });
    // alert("钉钉鉴权完成");
    dd.error((err) => {
      // alert("5" + JSON.stringify(err));
      // let errorMessage = err.errorMessage
      // let regexp = /((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
      // let currentUrl = errorMessage.match(regexp)[0];
      // goDingOpen(dingUserId,currentUrl)
    })//该方法必须带上，用来捕获鉴权出现的异常信息，否则不方便排查出现的问题
  })
  appCronId().then((res) => {
    if (res.responseCode === "100000") {
      let corpId = res.result;
      //钉钉开始
      if (corpId) {
        // alert('钉钉用户id' + dingUserId);
        dd.ready(() => {
          dd.biz.util.open({
            name: "profile",
            params: { "id": dingUserId, "corpId": corpId },
            onSuccess: function (res) {
              // 调用成功时回调
              console.log(res)
              //  alert("成功" + JSON.stringify(res));
            },
            onFail: function (err) {
              // 调用失败时回调
              //  alert(JSON.stringify(err));
            }
          });
        });
      }
    }
  });
}

export function goDingOpenLink(url) {
  let obj = {
    url: location.href
  }
  jsAuth(obj).then((res) => {
    dd.config({
      agentId: res.result.agentId, // 必填，微应用ID
      corpId: res.result.corpId,//必填，企业ID
      timeStamp: res.result.timeStamp, // 必填，生成签名的时间戳
      nonceStr: res.result.nonceStr, // 必填，自定义固定字符串。
      signature: res.result.signature, // 必填，签名
      type: res.result.type,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
      jsApiList: [
        'biz.util.open',
      ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    });
    dd.error(function (err) {
      //  alert('dd error: ' + JSON.stringify(err));
    })//该方法必须带上，用来捕获鉴权出现的异常信息，否则不方便排查出现的问题
  })
  appCronId().then((res) => {
    if (res.responseCode === "100000") {
      let corpId = res.result;
      //钉钉开始
      if (corpId) {
        dd.ready(() => {
          dd.biz.util.openLink({
            url,//要打开链接的地址
            onSuccess: function (result) { },
            onFail: function (err) { alert(JSON.stringify(err)); }
          })
        });
      }
    }
  });
}

