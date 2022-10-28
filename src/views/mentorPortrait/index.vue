<template>
  <div class="container">
    <CmNavBar title="导师画像" />
    <div class="studyProgress">
      <!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" width="100%" height="100%"
        :src="urlCode" id="license_iframe"> </iframe> -->
      <img class="emptyDia" src="@/assets/img/emptyZD.png" />
    </div>
  </div>
</template>
<script>
import { getPortrait } from "@/api/home";
import { goDingOpenLink } from "@/utils/dingtalk.js";

export default {
  name: "mentorPortrait",
  components: {},
  data() {
    return {
      urlCode: "",
    };
  },
  created() { },
  mounted() {
    this.getUrl();
  },
  methods: {
    getUrl() {
      getPortrait().then((res) => {
        if (res.responseCode === "100000") {
          this.urlCode = res.result.url;
          goDingOpenLink(this.urlCode)
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.studyProgress {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .emptyDia {
    display: block;
    width: 205px;
    margin: 48px auto;
  }
}
</style>
