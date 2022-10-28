<template>
  <div class="home">
    <div class="userInfos">
      <!-- <img :src="userInfo.img" class="portrait" /> -->
      <div
        v-if="userInfo.img"
        class="portrait"
        :style="{ backgroundImage: `url(${userInfo.img})` }"
      ></div>
      <img v-else src="@/assets/img/tx.png" class="portrait" />
      <div class="infocon">
        <div class="infobox">
          <span class="label">姓 名</span>
          <span class="textSub">{{ userInfo.username }}</span>
        </div>
        <div class="infobox">
          <span class="label">{{ userInfo.userRole == 2 ? "学 号" : "工 号" }}</span>
          <span class="textSub">{{ userInfo.studentNumber }}</span>
        </div>
      </div>
      <!-- <div class="userRole">
        <div class="btn">{{ userInfo.userRole == 1 ? "导师" : "学生" }}</div>
      </div> -->
    </div>
    <div :class="showAll ? 'cardList' : 'cardListH'">
      <div
        class="cardItem"
        v-for="(item, index) in cardList"
        :key="index"
        @click="goDetails(item.url)"
      >
        <img :src="item.icon" alt="" />
        <div class="name">{{ item.appName }}</div>
      </div>
    </div>
    <div class="divider" @click="showAll = !showAll">
      <van-divider
        :hairline="false"
        :style="{
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }"
      >
        <img v-if="showAll" src="@/assets/img/upIcon.png" alt="" />
        <img v-else src="@/assets/img/downIcon.png" alt="" />
      </van-divider>
    </div>
    <div class="guidance">
      <router-link to="/guidanceInformation">
        <div class="navLink">
          <div class="title">
            <img src="@/assets/img/home/fileIcon.png" />
            <span class="text">导学信息</span>
            <van-badge
              v-if="infonumber > 0"
              :content="infonumber"
              max="99"
              color="#FA5151"
            />
          </div>
          <img class="rightArrow" src="@/assets/img/rightIcon.png" />
        </div>
      </router-link>
      <div class="guidaList" v-if="guidaList.length > 0">
        <div
          class="guidaItem"
          v-for="(item, index) in guidaList"
          :key="index"
          @click="goInfoDetails(item)"
        >
          <div class="guida">
            <div :class="item.isRead === 1 ? ' titleR' : 'title'">
              {{ item.messageTitle }}
            </div>
            <div class="time">{{ item.gmtCreate }}</div>
          </div>
          <div class="infosub">{{ item.messageContent }}</div>
        </div>
      </div>
      <img v-else class="empty" src="@/assets/img/empty.png" />
    </div>
    <van-dialog
      v-model="showEmpty"
      confirm-button-text="关闭"
      confirm-button-color="#1A75FF"
    >
      <img class="emptyDia" src="@/assets/img/emptyDia.png" />
    </van-dialog>
  </div>
</template>
<script>
import { appToken, applicationList, getUserInfo } from "@/api/home";
// import {getCode } from "@/utils/auth";
import { unReadCount, messageList, read } from "@/api/guidanceInformation";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      showAll: true,
      showEmpty: false,
      infonumber: 0,
      groupId: 4, // 群id
      userInfo: {
        img: "",
        username: "",
        studentNumber: "",
        userRole: 1,
      },
      cardList: [
        // {
        //   icon: require("@/assets/img/home/homeIcon1.png"),
        //   appName: "组会空间",
        //   url: "/groupSpace",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon2.png"),
        //   appName: "导学空间",
        //   url: "/guidanceSpace",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon3.png"),
        //   appName: "导学看板",
        //   url: "/guideBoard",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon4.png"),
        //   appName: "个人空间",
        //   url: "/personalSpace",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon5.png"),
        //   appName: "组织结构",
        //   url: "/organization",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon6.png"),
        //   appName: "找导师",
        //   url: "/findTeacher",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon7.png"),
        //   appName: "找同学",
        //   url: "/findStudent",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon8.png"),
        //   appName: "导学时间树",
        //   url: "/tutorialTimeTree",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon9.png"),
        //   appName: "学业进展",
        //   url: "/studyProgress",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon10.png"),
        //   appName: "导师画像",
        //   url: "/mentorPortrait",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon11.png"),
        //   appName: "趣味测试",
        //   url: "",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon12.png"),
        //   appName: "意见建议",
        //   url: "/suggestions",
        // },
        // {
        //   icon: require("@/assets/img/home/homeIcon3.png"),
        //   appName: "校级看板",
        //   url: "/schoolBoard",
        // },
      ],
      guidaList: [],
    };
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
    this.applicationListFun(); // 首页
    this.messageListFun(); // 消息列表
    this.unReadCountFun(); // 未读消息数
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.responseCode === "100000") {
          this.userInfo = {
            img: res.result.avatar,
            username: res.result.username,
            studentNumber: res.result.studentNumber,
            userRole: res.result.userRole,
          };
        }
      });
    },
    applicationListFun() {
      applicationList().then((res) => {
        if (res.responseCode === "100000") {
          this.cardList = [...res.result];
          // this.cardList = [...this.cardList, ...res.result]; //
        }
      });
    },
    goDetails(path) {
      if (path) {
        let isHttp = path.indexOf("http://") !== -1 || path.indexOf("https://") !== -1;
        console.log(isHttp, "isHttp");
        if (isHttp) {
          window.location.href = path;
        } else {
          this.$router.push(path);
        }
      } else {
        this.showEmpty = true;
      }
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
      let obj = {
        module: 3, // 模块，1-团队动态，2-导学时间树，3-导学信息
        groupId: this.groupId,
        sceneId: "", // 查询某一个类型的消息
        pageNum: 1,
        pageSize: 3,
      };
      messageList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.guidaList = res.result.records;
        }
      });
    },
    // 未读消息数
    unReadCountFun() {
      unReadCount().then((res) => {
        if (res.responseCode === "100000") {
          this.infonumber = res.result;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  padding: 16px 12px;
  box-sizing: border-box;

  .userInfos {
    height: 80px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;

    .portrait {
      width: 60px;
      height: 80px;
      margin-right: 17px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      background-color: #f7f7f7;
    }

    .infocon {
      flex: 1;

      // margin-top: 16px;
      .infobox {
        margin-bottom: 9px;
        height: 20px;

        .label {
          display: inline-block;
          width: 58px;
          // height: 20px;
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 19px;
          text-align: justify;
        }

        .textSub {
          width: 59px;
          height: 20px;
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 19px;
        }
      }
    }

    .userRole {
      width: 48px;
      height: 20px;
      background: rgba(26, 117, 255, 0.2);
      border-radius: 10px;
      font-size: 11px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #1a75ff;
      line-height: 20px;
      text-align: center;
      margin-top: 16px;
      margin-right: 15px;
    }
  }

  .cardList,
  .cardListH {
    width: 351px;
    // min-height: 283px;
    background: #ffffff;
    border-radius: 4px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    flex-wrap: wrap;
    padding-top: 20px;
    box-sizing: border-box;

    .cardItem {
      width: 25%;
      text-align: center;
      margin-bottom: 20px;

      img {
        width: 32px;
        height: 32px;
      }

      .name {
        font-size: 12px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 19px;
        // margin-top: 4px;
      }
    }

    .cardItem:nth-child(4n) {
      margin-right: 0;
    }
  }

  .cardListH {
    height: 170px;
    overflow: hidden;
  }

  .navLink {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;

      img {
        width: 22px;
        height: 22px;
      }

      .text {
        height: 18px;
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-right: 8px;
        margin-left: 4px;
      }
    }
  }

  .rightArrow {
    height: 12px;
  }

  .van-badge {
    width: 40px;
    height: 18px;
    background: #fa5151;
    border-radius: 50px;
    font-family: SourceHanSansCN-Regular, SFProDisplay;
    font-weight: bold;
    font-size: 10px;
    line-height: 18px;
  }

  .guidaList {
    .guidaItem {
      // height: 82px;
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 8px;
      padding: 15px 16px;
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
          padding-left: 14px;
        }

        .title::after {
          content: "";
          position: absolute;
          left: 0;
          top: 9px;
          width: 6px;
          height: 6px;
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
        }
      }

      .infosub {
        // height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
  }
}

.emptyDia {
  display: block;
  width: 205px;
  margin: 48px auto;
}

.empty {
  display: block;
  width: 204px;
  margin: 20px auto;
}
</style>
