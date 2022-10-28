<template>
  <div class="container">
    <CmNavBar title="个人空间" />
  </div>
</template>
<script>
import { goDingOpenLink } from "@/utils/dingtalk.js";
export default {
  name: "psychologicalTest",
  components: {},
  data() {
    return {};
  },
  created() { },
  mounted() {
    window.location.href = "https://docs.dingtalk.com/i";
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.studyProgress {
  display: flex;
  align-items: center;
  min-height: 100vh;

  .emptyDia {
    display: block;
    width: 205px;
    margin: 48px auto;
  }
}
</style>
