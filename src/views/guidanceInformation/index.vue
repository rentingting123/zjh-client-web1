<template>
  <div class="container">
    <CmNavBar>
      <template slot="title">
        <div class="navTitle">
          导学信息
          <van-badge
            v-if="infonumber > 0"
            :content="infonumber"
            max="99"
            color="#FA5151"
          />
        </div>
      </template>
      <template slot="right" v-if="infonumber > 0">
        <div class="save-clear" @click="clearData()">
          <img src="@/assets/img/clear.png" />
        </div>
      </template>
    </CmNavBar>
    <div class="guidance">
      <div class="tabsList">
        <div
          class="tabsItem"
          v-for="(item, index) in tabsList"
          :key="index"
          @click="curChange(item.sceneId)"
        >
          <div :class="sceneId === item.sceneId ? 'titleCur' : 'title'">
            {{ item.sceneName }}
          </div>
        </div>
      </div>
      <van-list
        v-if="guidaList.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="messageListFun"
        class="guidaList"
      >
        <div
          class="guidaItem"
          v-for="(item, index) in guidaList"
          :key="index"
          @click="goInfoDetails(item)"
        >
          <div class="guida">
            <div :class="item.isRead === 1 ? 'titleR' : 'title'">
              {{ item.messageTitle }}
            </div>
          </div>
          <div class="infosub">{{ item.messageContent }}</div>
          <div class="time">
            <span>{{ item.gmtCreate }}</span>
            <span>{{ item.sceneName }}</span>
          </div>
        </div>
      </van-list>
      <img v-else class="empty" src="@/assets/img/empty.png" />
    </div>
  </div>
</template>
<script>
import {
  sceneList,
  messageList,
  read,
  unReadCount,
} from "@/api/guidanceInformation";
export default {
  name: "guidanceInformation",
  components: {},
  data() {
    return {
      infonumber: 0,
      sceneId: -1,
      tabsList: [
        {
          sceneId: -1,
          sceneName: "全部",
        },
      ],
      guidaList: [],
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 15,
      total: 0,
    };
  },
  created() {},
  mounted() {
    this.messageListFun(); // 消息列表
    this.sceneListFun(); // 类型列表
    this.unReadCountFun(); // 未读消息数
  },
  methods: {
    // 未读消息数
    unReadCountFun() {
      unReadCount().then((res) => {
        if (res.responseCode === "100000") {
          this.infonumber = res.result;
        }
      });
    },
    curChange(sceneId) {
      this.sceneId = sceneId;
      this.pageNum = 1;
      this.guidaList = [];
      this.messageListFun();
    },
    // 一键已读
    clearData() {
      let obj = {
        // messageId:'' 	//单条消息已读，全部已读情况下啊，这个字段可以不传
        isAll: true, // 	true-全部已读，单条情况下，这个字段可以不传
      };
      read(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.curChange(this.sceneId);
          this.unReadCountFun();
        }
      });
    },
    // 去详情
    goInfoDetails(item) {
      this.$router.push({
        name: "infoDetails",
        params: {
          messageTitle: item.messageTitle,
          gmtCreate: item.gmtCreate,
          sceneName: item.sceneName,
          messageContent: item.messageContent,
        },
      });
      read({
        messageId: item.messageId,
      }).then((res) => {});
    },
    // 消息列表
    messageListFun() {
      this.loading = true;
      let obj = {
        module: 3, // 模块，1-团队动态，2-导学时间树，3-导学信息
        groupId: this.groupId,
        sceneId: this.sceneId === -1 ? "" : this.sceneId, // 查询某一个类型的消息
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      messageList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.total = res.result.total;
          setTimeout(() => {
            // 加载状态结束
            this.loading = false;
          }, 0);
          // 数据全部加载完成
          if (this.guidaList.length >= this.total) {
            this.finished = true;
          } else {
            if (res.result.records.length > 0) {
              this.guidaList = this.guidaList.concat(res.result.records);
              this.pageNum = ++this.pageNum;
            }
          }
        }
      });
    },
    //消息类型
    sceneListFun() {
      let obj = {
        module: 3, //模块，1-团队动态，2-导学时间树，3-导学信息
      };
      sceneList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.tabsList = [...this.tabsList, ...res.result];
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.guidance {
  padding: 46px 12px 16px;
  box-sizing: border-box;
}

.tabsList {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 4px;
  .tabsItem {
    min-width:70px;
    text-align: center;
    line-height: 40px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    cursor: pointer;
    .titleCur {
      width: 100%;
      background: #1a75ff;
      border-radius: 4px;
      font-size: 14px;
      color: #ffffff;
    }

    .title {
      font-size: 14px;
      background: #ffffff;
      color: #1A75FF;
      border-radius: 11px;
    }
  }
}

.navTitle {
  display: flex;
  align-items: center;
  line-height: 20px;
}

.van-badge {
  width: 30px;
  height: 18px;
  background: #fa5151;
  border-radius: 50px;
  font-family: SourceHanSansCN-Regular, SFProDisplay;
  font-weight: bold;
  font-size: 10px;
  margin-left: 4px;
  line-height: 18px;
}

.van-nav-bar__right {
  top: 6px;
}

.save-clear {
  img {
    width: 20px;
  }
}

.guidaList {
  .guidaItem {
    height: 128px;
    background: #ffffff;
    margin-bottom: 8px;
    padding: 16px;
    box-sizing: border-box;

    .guida {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      .title {
        flex: 1;
        height: 24px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
        position: relative;
      }

      .title::after {
        content: "";
        position: absolute;
        right: 0;
        top: 9px;
        width: 8px;
        height: 8px;
        background: #fa5151;
        border-radius: 50%;
      }

      .titleR {
        color: #666666;
        flex: 1;
        height: 24px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 24px;
      }

      .time {
        height: 24px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 24px;
        margin-top: 8px;
      }
    }

    .infosub {
      height: 39px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      position: relative;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }

    .time {
      height: 17px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #a5a5a5;
      line-height: 17px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }
  }
}

.empty {
  display: block;
  width: 204px;
  margin: 100px auto;
}
</style>
