<template>
  <div class="container">
    <CmNavBar title="导学看板" />
    <div class="details">
      <div class="board">
        <div class="group">
          <CmGroup />
          <div class="user">
            <img class="" src="@/assets/img/partyg.png" /> {{ userNum || 0 }}
          </div>
        </div>
        <div class="teamList">
          <div class="teamItem">
            <div class="label">组会次数</div>
            <div class="value">{{ conferenceNum || 0 }}</div>
          </div>
          <div class="teamItem">
            <div class="label">组会频率</div>
            <div class="value">{{ conferenceFreq || 0 }}天/次</div>
          </div>
          <div class="teamItem">
            <div class="label">团队文件</div>
            <div class="value">{{ groupFileNum || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="navLink">
        <div class="title">
          <img src="@/assets/img/calendar.png" />
          <span class="text">最新日程</span>
        </div>
        <div class="flex" @click="to_meet">
          <div class="subtext">发起会议</div>
          <img class="rightArrow" src="@/assets/img/rightIcon.png" />
        </div>
      </div>
      <div class="calendar" v-if="latestCon">
        <div class="info">
          <div class="time">{{ latestCon.startTime }} - {{ latestCon.endTime }}</div>
          <div class="name">{{ latestCon.createUsername }}（组织者）</div>
        </div>
        <div class="content">
          {{ latestCon.conferenceTitle }}
        </div>
      </div>
      <div v-else class="calendar emptytext">暂无</div>
      <div class="navLink">
        <div class="title">
          <img src="@/assets/img/filesIcon.png" />
          <span class="text">最新文件</span>
        </div>
        <img
          class="rightArrow"
          @click="to_guidanceSpace"
          src="@/assets/img/rightIcon.png"
        />
      </div>
      <div class="fileList">
        <template v-if="latestFiles.length > 0">
          <div class="fileItem" v-for="(item, index) in latestFiles" :key="index">
            <div class="userInfos">
              <img src="@/assets/img/tx.png" class="portrait" />
              <div class="infocon">
                <div class="name">{{ item.fileName }}</div>
                <div class="school">
                  {{ item.fileSize }} <span v-if="item.createUsername">|</span
                  >{{ item.createUsername }}
                </div>
                <div class="info">{{ item.gmtCreate }}更新</div>
              </div>
            </div>
          </div>
        </template>
        <img v-else class="empty" src="@/assets/img/empty.png" />
      </div>
      <!-- <div class="navLink">
        <div class="title">
          <img src="@/assets/img/noticeIcon.png" />
          <span class="text">最新群公告</span>
        </div>
      </div>
      <div class="notice">
        <div class="info">
          <div class="time">{{ Info.time }}</div>
          <div class="name">{{ Info.name }}</div>
        </div>
        <div class="content">
          {{ Info.tag }}
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { bulletin } from "@/api/home";
import CmGroup from "@/views/components/CmGroup.vue";
import { getGroupId } from "@/utils/auth";
export default {
  name: "Homepc",
  components: { CmGroup },
  data() {
    return {
      groupId: "",
      userNum: 0,
      conferenceFreq: 0, //组会频率
      conferenceNum: 0, //组会数量
      groupFileNum: 0, //文件数量
      latestCon: {}, //最近日程
      latestFiles: [], //文件

      Info: {
        name: "王磊",
        time: "2021/03/01 12:00",
        tag: "@所有人，请大家准时参加会议",
      },
    };
  },
  created() {
    this.groupId = getGroupId();
  },
  mounted() {
    if (this.groupId) {
      this.bulletinFun(); // 导学看板
    }
  },
  methods: {
    to_meet() {
      this.$router.push({
        name: "addMeeting",
        query: {
          groupId: this.groupId,
        },
      });
    },
    to_guidanceSpace() {
      this.$router.push({
        name: "guidanceSpace",
      });
    },
    changeGroupId() {
      this.groupId = getGroupId();
      this.bulletinFun();
    },
    /** 导学看板 */
    bulletinFun() {
      let obj = {
        groupId: this.groupId,
      };
      bulletin(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.userNum = res.result.userNum;
          this.conferenceFreq = res.result.conferenceFreq; //组会频率 1天/次
          this.conferenceNum = res.result.conferenceNum; //组会数量
          this.groupFileNum = res.result.groupFileNum; //文件数量
          this.latestCon = res.result.latestCon; //最近日程
          this.latestFiles = res.result.latestFiles; //文件
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.details {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}
.board {
  height: 117px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 3px;
  .group {
    height: 20px;
    border-bottom: 1px solid #dedede;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    .name {
      font-size: 18px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 19px;

      img {
        height: 11px;
        margin-left: 8px;
      }
    }
    .user {
      min-width: 80px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #666666;
      line-height: 19px;
      text-align: right;
      img {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }
  .teamList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    .teamItem {
      text-align: center;
      .label {
        height: 12px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
      }
      .value {
        height: 16px;
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: bold;
        color: #1a75ff;
        line-height: 24px;
        margin-top: 6px;
      }
    }
  }
}
.notice {
  height: 66px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .time,
    .name {
      height: 14px;
      font-size: 16px;

      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
    }
  }
  .content {
    height: 12px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    margin-top: 8px;
  }
}
.calendar {
  height: 66px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .time,
    .name {
      height: 12px;
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
  }
  .content {
    height: 14px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
    margin-top: 8px;
  }
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
  .flex {
    display: flex;
    align-items: center;
  }
  .subtext {
    display: block;
    // width: 48px;
    height: 18px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
  }
  .rightArrow {
    height: 12px;
    margin-left: 8px;
  }
}
.fileList {
  .fileItem {
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;
    padding: 10px 0;
    .userInfos {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .portrait {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        margin-right: 16px;
        margin-left: 12px;
      }
      .infocon {
        flex: 1;
        .name {
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          // margin-top: 9px;
        }
        .school {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          // margin-top: 10px;
        }
        .info {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          // margin-top: 8px;
        }
      }
      .identity {
        margin-right: 16px;
        img {
          width: 25px;
          height: 25px;
        }
      }
    }
  }
}
.empty {
  display: block;
  width: 204px;
  margin: 20px auto;
}
.emptytext {
  text-align: center;
  font-size: 20px;
  color: #999999;
}
</style>
