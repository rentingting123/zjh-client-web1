<template>
  <div class="login">
    <van-loading size="24px" vertical>登录中...</van-loading>
  </div>
</template>
<script>
import { appCronId, appToken } from "@/api/home";
import { setToken, getToken } from "@/utils/auth";
import * as dd from "dingtalk-jsapi";
export default {
  name: "ddlogin",
  data() {
    return {
      // loading: false,
      url: "",
    };
  },
  created() {
    if (this.$route.query.url) {
      this.url = this.$route.query.url;
    }
    if (getToken()) {
      //  let self = this;
      // appToken({ code: 2 }).then((res) => {
      //   if (res.responseCode === "100000") {
      //     setToken(res.result);
      //     if (self.url) {
      //       self.$router.push("/" + self.url);
      //     } else {
      //       self.$router.push("/index");
      //     }
      //   }
      // });
      this.$router.push("/index");
    } else {
      appCronId().then((res) => {
        if (res.responseCode === "100000") {
          let corpId = res.result;
          //钉钉开始
          if (corpId) {
            let self = this;
            // this.loading = true;
            dd.ready(function () {
              dd.runtime.permission.requestAuthCode({
                corpId: corpId, // 企业id
                onSuccess: function (info) {
                  appToken({ code: info.code }).then((res) => {
                    if (res.responseCode === "100000") {
                      setToken(res.result);
                      if (self.url) {
                        self.$router.push("/" + self.url);
                      } else {
                        self.$router.push("/index");
                      }
                    }
                  });
                },
                onFail: function (err) {
                  alert(JSON.stringify(err));
                },
              });
            });
          }
        }
      });
    }
  },
  methods: {},
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
</style>
