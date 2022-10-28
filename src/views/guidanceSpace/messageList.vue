<template>
  <div class="container">
    <van-list v-if="timeTreeeList.length > 0" v-model="loading" :finished="finished" finished-text="没有更多了"
      @load="messageListFun" class="timeTreeeList">
      <div class="timeTreeeItem" v-for="(item, index) in timeTreeeList" :key="index">
        <div class="line" v-if="index + 1 !== timeTreeeList.length"></div>
        <div class="timeTop">
          <span class="time">{{ item.gmtCreate }}</span>
          <span class="tags">{{ item.sceneName }}</span>
        </div>
        <div class="content">{{ item.messageContent }}</div>
      </div>
    </van-list>
    <img v-else class="empty" src="@/assets/img/empty.png" />
    <div @click="addDynamic" class="addButton">
      <img src="@/assets/img/add.png" alt="" />
    </div>
  </div>
</template>
<script>
import { messageList } from "@/api/guidanceInformation";
import { getGroupId } from "@/utils/auth";
export default {
  name: "messageList",
  components: {},
  data() {
    return {
      timeTreeeList: [],
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 15,
      total: 0,
    };
  },
  created() { },
  mounted() {
  },
  methods: {
    addDynamic() {
      this.$router.push({
        path: "/messageAdd",
        query: { groupId: getGroupId() },
      });
    },
    // 消息列表
    messageListFun(type) {
      if( type === 1){
        this.total = 0
        this.pageNum = 1
        this.timeTreeeList =[]
      }
      this.loading = true;
      let obj = {
        module: 1, // 模块，1-团队动态，2-导学时间树，3-导学信息
        groupId: getGroupId(),
        sceneId: this.sceneId === -1 ? "" : this.sceneId, // 查询某一个类型的消息
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      messageList(obj).then((res) => {
        if (res.responseCode === "100000") {
          setTimeout(() => {
            this.loading = false;
          }, 0);
          this.total = res.result.total;
          if (this.total > 0) {
            // 数据全部加载完成
            if (this.timeTreeeList.length >= this.total) {
              this.finished = true;
            } else {
              this.timeTreeeList = this.timeTreeeList.concat(
                res.result.records
              );
              this.pageNum = ++this.pageNum;
            }
          } else {
            this.timeTreeeList = [];
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.timeTreeeList {
  position: relative;

  .timeTreeeItem {
    min-height: 66px;
    background: #ffffff;
    border-radius: 4px;
    margin-top: 16px;
    padding: 12px 16px;
    padding-left: 31px;
    box-sizing: border-box;
    position: relative;

    .timeTop {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .time {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
      }

      .tags {
        height: 20px;
        background: rgba(26, 117, 255, 0.2);
        border-radius: 10px;
        font-size: 11px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #1a75ff;
        line-height: 20px;
        text-align: center;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }

    .content {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      margin-top: 6px;
    }
  }

  .timeTreeeItem::after {
    content: "";
    position: absolute;
    left: 8px;
    top: 30px;
    width: 8px;
    height: 8px;
    background: #1a75ff;
    border-radius: 50%;
  }

  .line {
    position: absolute;
    left: 11px;
    top: 30px;
    width: 2px;
    height: 100px;
    background-image: linear-gradient(rgba(26, 117, 255, 0.3) 70%,
        rgba(255, 255, 255, 0) 0%);
    /* 35%设置虚线点y轴上的长度 */
    background-position: left;
    /* right配置右边框位置的虚线 */
    background-size: 1px 12px;
    /* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
    background-repeat: repeat-y;
    z-index: 9;
  }
}

.addButton {
  position: fixed;
  right: 12px;
  top: 80vh;
  width: 50px;
  height: 50px;
  background: #1a75ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
  }
}

.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}
</style>
