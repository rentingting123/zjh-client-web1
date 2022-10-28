<template>
  <div class="container">
    <CmNavBar title="组会空间" />
    <div class="groupSpace">
      <div class="board">
        <div class="group">
          <CmGroup />
        </div>
      </div>
      <div class="calendar">
        <vue-hash-calendar
          :visible.sync="isShowCalendar"
          :markDate="markDate"
          :isShowWeekView="isShowWeekView"
          @change="changeDate"
          @click="clickDate"
        />
        <div class="divider" @click="isShowWeekView = !isShowWeekView">
          <van-divider
            :hairline="false"
            :style="{
              borderColor: 'rgba(0, 0, 0, 0.06)',
              padding: '16px 20px',
            }"
          >
            <img v-if="isShowWeekView" src="@/assets/img/date1.png" alt="" />
            <img v-else src="@/assets/img/date2.png" alt="" />
          </van-divider>
        </div>
        <div class="meetingList">
          <template v-if="meetingList.length > 0">
            <div
              class="meetingItem"
              v-for="item in meetingList"
              :key="item.conferenceId"
              @click="goDeatils(item.conferenceId)"
            >
              <div class="title">{{ item.conferenceDate }}</div>
              <div class="content">
                <div class="contTop">
                  <span class="name">{{ item.conferenceTitle }}</span>
                  <!-- <span class="status">未开始</span> -->
                </div>
                <div class="contMid">
                  <div class="create">
                    <div class="createInfo">
                      <img
                        class="img1"
                        src="@/assets/img/meetIcon1.png"
                        alt=""
                      />
                      <span class="text"
                        >{{ item.createUsername }} （组织者）</span
                      >
                    </div>
                    <div class="createInfo">
                      <img
                        class="img2"
                        src="@/assets/img/meetIcon2.png"
                        alt=""
                      />
                      <span class="text"
                        >{{ item.startTime }}-{{ item.endTime }}</span
                      >
                    </div>
                  </div>
                  <div class="timeBtn" v-if="item.timeLeft">
                    {{ item.timeLeft }}分钟后开始
                  </div>
                </div>
              </div>
            </div>
          </template>
          <img v-else class="empty" src="@/assets/img/empty.png" />
          <div @click="addFile" class="addButton">
            <img src="@/assets/img/add.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CmGroup from "@/views/components/CmGroup.vue";
import { groupConferenceDay, groupConferenceList } from "@/api/groupSpace";
import moment from "moment";
import { getGroupId, getRole} from "@/utils/auth";
export default {
  name: "groupSpace",
  components: { CmGroup },
  data() {
    return {
      groupId: "",
      isShowCalendar: true,
      isShowWeekView: true,
      year: "",
      day: "",
      currentdate:'',
      yearMonth: "",
      meetingList: [],
      markDate: [
        {
          color: "#FA5151",
          date: [],
        },
      ],
    };
  },
  created() {
    this.nowtime();
    this.groupId = getGroupId();
  },
  mounted() {
    if (this.groupId) {
      this.getList();
      this.groupConferenceDayFun(); //组会空间-日历
    }
  },
  methods: {
    changeGroupId() {
      this.groupId = getGroupId();
      if (this.groupId) {
        this.getList();
        this.groupConferenceDayFun(); //组会空间-日历
      }
    },
    //获取当前时间
    nowtime() {
      let nowDate = new Date();
      let date = {
        // 获取当前年份
        year: nowDate.getFullYear(),
        //获取当前月份
        month:
          nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1,
        //获取当前日期
        date:
          nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate(),
      };
      this.yearMonth = date.year + date.month;
      this.currentdate = date.date;
    },
    //组会空间-日历
    groupConferenceDayFun() {
      let param = {
        groupId: this.groupId,
        month: this.yearMonth,
      };
      groupConferenceDay(param).then((res) => {
        this.markDate[0].date = res.result;
      });
    },
    //组会空间-组会列表
    getList() {
      let param = {
        groupId: this.groupId,
        month: this.yearMonth,
        day: this.day,
      };
      groupConferenceList(param).then((res) => {
        this.meetingList = res.result;
      });
    },
    changeDate(date) {
      this.yearMonth = moment(date).format("YYYYMM");
      if(this.groupId){
        this.groupConferenceDayFun(); //组会空间-日历
      }
      
    },
    clickDate(date) {
      this.yearMonth = moment(date).format("YYYYMM");
      if(moment(date).format("DD")==this.currentdate){
        this.day=""
      }else{
        this.day = moment(date).format("DD");
      }
      this.getList(); //组会空间-日历
    },
    // 添加
    addFile() {
      if(getRole()==3){
        this.$toast.fail("暂无权限发起会议");
      }else{
        this.$router.push({
        path: "/addMeeting",
        query: { groupId: this.groupId },
      });
      }
    },
    // 去详情
    goDeatils(conferenceId) {
      this.$router.push({
        path: "/detailsMeeting",
        query: { groupId: this.groupId, conferenceId: conferenceId },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.groupSpace {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}
.board {
  min-height: 52px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  .group {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      width: 100%;
      font-size: 18px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 19px;
      display: flex;
      align-items: center;
      img {
        height: 11px;
        margin-left: 8px;
      }
    }
  }
  .info {
    padding: 16px 0;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 19px;
    border-bottom: 1px solid #dedede;
    position: relative;
    .editBtn {
      position: absolute;
      right: 0;
      bottom: 16px;
      // img{
      //   width: 20px;
      // }
    }
  }
}
.calendar {
  margin-top: 16px;
}
.meetingList {
  .meetingItem {
    .title {
      height: 46px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 46px;
    }
    .content {
      // height: 80px;
      background: #ffffff;
      border-radius: 4px;
      padding: 6px 16px;
      // box-sizing: border-box;
      .contTop {
        display: flex;
        justify-content: space-between;
        .name {
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 21px;
        }
        .status {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 21px;
        }
      }
      .contMid {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        .create {
          .createInfo {
            // height: 20px;
            line-height: 20px;
            .img1 {
              width: 12px;
              margin-right: 8px;
              // vertical-align: middle;
            }
            .img2 {
              width: 12px;
              // height: 10px;
              margin-right: 8px;
            }
            .text {
              font-size: 14px;
              font-family: SourceHanSansCN-Regular, SourceHanSansCN;
              font-weight: 400;
              color: #999999;
              // line-height: 18px;
            }
          }
        }
        .timeBtn {
          padding: 0 12px;
          box-sizing: border-box;
          font-size: 11px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #1a75ff;
          line-height: 20px;
          height: 20px;
          background: rgba(26, 117, 255, 0.2);
          border-radius: 10px;
        }
      }
    }
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
  margin: 20px auto;
}
.calendar_content {
  margin-bottom: 0;
}
.divider {
  background-color: #ffffff;
  margin-top: -16px;
  box-sizing: border-box;
  img {
    width: 20px;
  }
}
</style>
<style>
.van-dropdown-menu__bar {
  box-shadow: none;
}
.van-dropdown-menu__title::after,
.van-dropdown-menu__title--down::after {
  display: none;
}
.power .van-action-sheet__item {
  text-align: left;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 6px 24px;
}
.power .van-action-sheet__subname {
  margin-top: 0;
}
.van-dialog {
  /* height: 208px; */
  border-radius: 8px;
}
</style>
