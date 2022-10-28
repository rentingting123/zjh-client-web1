<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
import { appCronId ,appToken } from "@/api/home";
import { setUserinfo, getToken } from "@/utils/auth";
import * as dd from "dingtalk-jsapi";
export default {
  name: "App",
  computed: {},
  created() {

  
  },
};
</script>
<style lang="scss" scoped>
#app {
  width: 375px;
  margin: 0 auto;
  background: #f8f7fa;
  min-height: 100vh;
}
</style>

<style>
body {
  background: #f8f7fa;
}
</style>
