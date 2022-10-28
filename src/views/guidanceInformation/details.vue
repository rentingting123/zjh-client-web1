<template>
  <div class="container">
    <CmNavBar title="信息详情" />
    <div class="details">
      <div class="infoTop">
        <div class="title">{{ messageTitle }}</div>
        <div class="timebox">
          <div class="time">{{ gmtCreate }}</div>
          <div class="tags">{{ sceneName }}</div>
        </div>
      </div>

      <div class="profile" >
        {{ messageContent || "暂无" }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "infoDetails",
  components: {},
  data() {
    return {
      messageTitle: "",
      gmtCreate: "",
      sceneName: "",
      messageContent: "",
    };
  },
  created() {},
  mounted() {
    this.messageTitle = this.$route.params.messageTitle;
    this.gmtCreate = this.$route.params.gmtCreate;
    this.sceneName = this.$route.params.sceneName;
    this.messageContent = this.$route.params.messageContent;
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.details {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}
.infoTop {
  height: 76px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  .title {
    height: 16px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
  }
  .timebox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    .time {
      height: 12px;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
    .tags {
      height: 17px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0a84ff;
      line-height: 17px;
    }
  }
}
.profile {
  min-height: 165px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 16px;
  padding: 8px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
}
</style>
