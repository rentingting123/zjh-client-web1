<template>
  <div class="container">
    <CmNavBar title="心理测试" />
    <div class="studyProgress">
      <img class="emptyDia" src="@/assets/img/emptyDia.png" />
    </div>
  </div>
</template>
<script>
export default {
  name: "psychologicalTest",
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.studyProgress{
  display:flex;
  align-items:center;
  min-height:100vh;
  .emptyDia {
  display: block;
  width: 205px;
  margin: 48px auto;
}
}

</style>
