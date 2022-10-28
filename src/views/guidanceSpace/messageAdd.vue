<template>
  <div class="container">
    <CmNavBar title="发布动态" />
    <div class="message">
      <div>
        <van-field
          v-model="message"
          placeholder="请输入动态内容"
          type="textarea"
          autosize
          maxlength="100"
          rows="6"
          show-word-limit
        />
      </div>
      <div class="submit" @click="submit">发布</div>
    </div>
  </div>
</template>
<script>
import { messageAdd } from "@/api/find";
export default {
  name: "Homepc",
  components: {},
  data() {
    return {
      groupId: "",
      message: "", //建议
    };
  },
  created() {},
  mounted() {
    this.groupId = this.$route.query.groupId;
  },
  methods: {
    submit() {
      if (this.message) {
        let obj = {
          groupId: this.groupId,
          message: this.message,
        };
        messageAdd(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("提交成功");
            this.message = "";
            this.$router.back(-1);
          }
        });
      }else{
        this.$toast.fail("请先填写动态内容");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}
.message {
  padding: 60px 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
.suggestionsList {
  height: 40px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  .suggestionsItem {
    text-align: center;
    line-height: 40px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    font-size: 16px;
    width: 88px;
    cursor: pointer;
    .titleCur {
      background: #1a75ff;
      border-radius: 4px;
      font-size: 16px;
      color: #ffffff;
    }
    .title {
      color: #1a75ff;
    }
  }
}
.van-cell {
  width: 351px;
  // height: 310px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 16px;
}
.submit {
  width: 352px;
  height: 40px;
  background: #1a75ff;
  border-radius: 4px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  line-height: 40px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
