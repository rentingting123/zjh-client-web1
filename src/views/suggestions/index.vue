<template>
  <div class="container">
    <CmNavBar title="意见建议"
      ><template slot="right">
        <div class="navRight" @click="$router.push({ path: '/suggestionsList' })">
          提交历史
        </div>
      </template></CmNavBar
    >
    <div class="suggestions">
      <div>
        <van-field
          v-model="content"
          placeholder="请输入10个字以上建议"
          :autosize="{ minHeight: 310 }"
          type="textarea"
          class="field"
        />
        <van-uploader
          class="uploader"
          v-model="fileList"
          accept="image/*"
          :max-count="6"
          multiple
          preview-size="104px"
          :after-read="afterRead"
        >
          <div class="uploadAdd">
            <van-icon name="plus" size="24" color="rgba(0,0,0,0.45)" />
            <div class="text">上传照片</div>
          </div>
        </van-uploader>
      </div>

      <van-button class="submit" @click="submit" :loading="loading">提交</van-button>
    </div>
  </div>
</template>
<script>
import { feedbackAdd } from "@/api/find";
import { getToken } from "@/utils/auth";
export default {
  name: "Homepc",
  components: {},
  data() {
    return {
      loading: false,
      currentId: 1,
      content: "", //建议
      fileList: [],
    };
  },
  created() {},
  mounted() {
    if (!getToken()) {
      this.$router.push({
        path: "/home",
        query: { url: "suggestions" },
      });
    } else {
    }
  },
  methods: {
    afterRead(file) {
      console.log(file);
      console.log(this.fileList);
    },
    submit() {
      if (this.content) {
        this.loading = true;
        let formatData = new FormData();
        if (this.fileList.length > 0) {
          this.fileList.forEach((res) => {
            formatData.append("files", res.file);
          });
        }
        formatData.append("content", this.content);
        feedbackAdd(formatData).then((res) => {
          if (res.responseCode === "100000") {
            this.loading = false;
            this.content = "";
            this.fileList = [];
            this.$toast.success("感谢您的宝贵意见");
          }
        });
      } else {
        this.$toast.fail("请输入意见建议");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}

.suggestions {
  padding: 60px 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

.field {
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
  margin-top: 32px;
}

.navRight {
  height: 24px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 24px;
}
.uploader {
  margin-top: 16px;
  .uploadAdd {
    width: 104px;
    height: 104px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-top: 10px;
    }
  }
}
</style>
