<template>
  <div class="container">
    <CmNavBar title="提交历史" />
    <div class="suggestions">
      <div>
        <van-list
          v-if="historyList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="feedbackListFun"
          class="historyList"
        >
          <div class="historyItem" v-for="(item, index) in historyList" :key="index">
            <div class="time">{{ item.gmtCreate }}</div>
            <div class="conbox">
              <div class="content">{{ item.content }}</div>
              <div class="attachment" v-if="item.attachment.length > 0">
                <img
                  alt=""
                  v-for="(item1, index1) in item.attachment"
                  :key="index1"
                  :src="item1"
                  @click="imageShow(item.attachment, index1)"
                />
              </div>
            </div>
          </div>
        </van-list>
        <img v-else class="empty" src="@/assets/img/empty.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { feedbackList } from "@/api/find";
import { ImagePreview } from "vant";
export default {
  name: "suggestionsList",
  components: {},
  data() {
    return {
      historyList: [],

      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 15,
      total: 0,
    };
  },
  created() {
    this.feedbackListFun(); // 首页
  },
  mounted() {},
  methods: {
    imageShow(arr, i) {
      ImagePreview({
        images: arr,
        startPosition: i,
        closeable: true,
      });
    },
    feedbackListFun() {
      let obj = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      feedbackList(obj).then((res) => {
        this.total = res.result.total;
        if (res.responseCode === "100000") {
          setTimeout(() => {
            // 加载状态结束
            this.loading = false;
          }, 0);
          // 数据全部加载完成
          if (this.historyList.length >= this.total) {
            this.finished = true;
          } else {
            if (res.result.records.length > 0) {
              this.historyList = this.historyList.concat(res.result.records);
              this.pageNum = ++this.pageNum;
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}

.historyList {
  .historyItem {
    .time {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 48px;
      height: 48px;
      position: relative;
      padding-left: 16px;
    }

    .time:after {
      content: "";
      position: absolute;
      left: 0;
      top: 20px;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: #1a75ff;
    }

    .conbox {
      background: #ffffff;
      border-radius: 4px;
      padding: 16px;

      .content {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        word-break: break-all;
      }

      .attachment {
        display: flex;
        flex-wrap: wrap;

        img {
          width: 103px;
          height: 104px;
          border-radius: 4px;
          margin-top: 8px;
          margin-right: 4px;
          margin-bottom: 4px;
          object-fit: cover;
        }

        img:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}

.suggestions {
  padding: 60px 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
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
}

.navRight {
  height: 24px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 24px;
}

.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}
</style>
