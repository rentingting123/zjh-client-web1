<template>
  <div class="container">
    <CmNavBar title="学业进展" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name" v-if="userInfo.userRole == 2">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ userInfo.username }}
          </div>
          <!-- <div class="titlebox">
            <div class="title">{{ userInfo.username }}</div>
            <van-dropdown-menu active-color="#1A75FF" class="dropMenu" :overlay="false">
              <van-dropdown-item v-model="yearSelect" :options="yearList" />
            </van-dropdown-menu>
          </div> -->
          <div class="name" v-if="userInfo.userRole == 1">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            <!-- {{ userInfo.username }} -->
            <van-dropdown-menu
              v-if="groupListData.length > 0"
              active-color="#1a75ff"
              :overlay="false"
              class="dropdown"
            >
              <van-dropdown-item
                v-model="userInfo.studentNumber"
                :options="groupListData"
                @change="studentChange"
              />
            </van-dropdown-menu>
          </div>
          <div class="number">学号：{{ userInfo.studentNumber }}</div>
        </div>
        <div class="infoMid">
          <div class="cell">
            <div class="label">年级</div>
            <div class="value">{{ baseInfo.grade }}</div>
          </div>
          <div class="cell">
            <div class="label">拟毕业日期</div>
            <div class="value">{{ baseInfo.graduationDate }}</div>
          </div>
          <div class="cell">
            <div class="label">专业</div>
            <div class="value">{{ baseInfo.major }}</div>
          </div>
          <div class="cell">
            <div class="label">培养类型</div>
            <div class="value">{{ baseInfo.educateType }}</div>
          </div>
          <div class="cell">
            <div class="label">培养方向</div>
            <div class="value">{{ baseInfo.educateDirection }}</div>
          </div>
        </div>
      </div>
      <div class="infoList">
        <div v-for="item in infoList" :key="item.id">
          <router-link class="infoItem" :to="item.link">
            <div class="name">{{ item.name }}</div>
            <div class="right">
              <!-- 字段都是zt_dm 审核状态("12","未审核"), ("13","通过"), ("14","驳回")
            通过是绿灯
            未审核是黄灯或橙灯
            驳回是红灯
            没有数据是红灯
             -->
              <!-- {{ item.proStatus }} -->
              <!-- <span
                :class="
                  item.proStatus == 12
                    ? 'yellow'
                    : item.proStatus == 13
                    ? 'green '
                    : item.proStatus == 14
                    ? 'red'
                    : 'red'
                "
              ></span> -->
              <img class="img1" src="@/assets/img/rightIcon.png" alt />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/home";
import { getBaseInfo } from "@/api/studyProgress";
import { userInfo } from "@/api/find";
import {
  setstudentNum,
  getstudentNum,
  setuserRole,
  getuserRole,
  getuserId,
  setuserId,
} from "@/utils/auth";
export default {
  name: "studyProgress",
  components: {},
  data() {
    return {
      userInfo: {
        username: "",
        studentNumber: "",
      },
      baseInfo: {},
      groupListData: [],
      infoList: [
        {
          id: 0,
          name: "前置学业信息",
          proStatus: "",
          // link: ''
          link: "/detailsPreStudy",
        },
        {
          id: 1,
          name: "课程成绩",
          proStatus: "",
          // link: ''
          link: "/detailsCourse",
        },
        {
          id: 2,
          name: "读书报告",
          proStatus: "",
          link: "/detailsReading",
        },
        {
          id: 3,
          name: "开题报告",
          proStatus: "",
          link: "/detailsOpeningReport",
        },
        {
          id: 4,
          name: "中期考核",
          proStatus: "",
          link: "/detailsmMetaphase",
        },
        {
          id: 5,
          name: "预答辩",
          proStatus: "",
          link: "/detailsPreDefense",
        },
        {
          id: 6,
          name: "科研成果",
          proStatus: "",
          link: "/detailsScientific",
        },
        {
          id: 7,
          name: "奖助信息",
          proStatus: "",
          link: "detailsRewardPunishment",
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
  },
  methods: {
    studentChange(val) {
      this.userInfo.studentNumber = val;
      this.getBaseInfoFun();
      setstudentNum(val);
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.responseCode === "100000") {
          if (res.result.userRole == 2) {
            this.userInfo = {
              username: res.result.username,
              studentNumber: res.result.studentNumber,
              userId: res.result.userId,
              userRole: res.result.userRole,
            };
            setstudentNum(res.result.studentNumber);
            this.getBaseInfoFun();
          } else {
            this.userInfo.userRole = res.result.userRole;
            this.userInfo.userId = res.result.userId;
            this.userInfoFun();
          }
          setuserRole(res.result.userRole);
          setuserId(res.result.userId);

          // this.userRole=res.result.userRole
        }
      });
    },
    userInfoFun() {
      let obj = {
        userRole: 2, // 用户角色，1-导师，2-学生
        teacherId: this.userInfo.userId || getuserId(), //当要查询老师下面的学生时，这个参数需要传
      };
      if (obj.teacherId) {
        userInfo(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.groupListData = res.result.records.map((item) => {
              return {
                text: item.username,
                value: item.studentNumber,
              };
            });
            this.userInfo.studentNumber = getstudentNum() || this.groupListData[0].value;
            setstudentNum(this.userInfo.studentNumber);
            this.getBaseInfoFun();
          }
        });
      }
    },
    getBaseInfoFun() {
      let param = {
        studentNumber: this.userInfo.studentNumber || getstudentNum(),
      };
      getBaseInfo(param).then((res) => {
        if (res.responseCode == 100000) {
          this.baseInfo = res.result;
          this.userInfo.studentNumber = res.result.studentNumber;
          this.userInfo.username = res.result.userName;
          this.infoList[0].proStatus = res.result.courseResult; // name: "课程成绩",
          this.infoList[1].proStatus = res.result.readReport; // name: "读书报告",
          this.infoList[2].proStatus = res.result.opening; // name: "开题报告",
          this.infoList[3].proStatus = res.result.midExamine; // name: "中期考核",
          this.infoList[4].proStatus = res.result.preReplay; // name: "预答辩",
          this.infoList[5].proStatus = res.result.achievement; // name: "科研成果",
          this.infoList[6].proStatus = res.result.rewardPunish; // name: "奖惩信息",
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.studyProgress {
  padding: 60px 12px 16px;
  box-sizing: border-box;

  .information {
    margin: 0 auto;
    background: #ffffff;
    border-radius: 4px;
    padding: 17px 15px;
    box-sizing: border-box;

    .infoTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dedede;
      padding-bottom: 14px;

      .name {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
        display: flex;
        align-items: center;

        .img1 {
          width: 16px;
          margin-right: 5px;
        }
      }

      .number {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 21px;
      }
    }

    .infoMid {
      .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;

        .label {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
        }

        .value {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 18px;
        }
      }
    }
  }

  .infoList {
    .infoItem {
      height: 46px;
      background: #ffffff;
      border-radius: 4px;
      margin-top: 16px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
      }

      .right {
        display: flex;
        align-items: center;

        .red {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 13px;
          background: #fa4178;
        }

        .green {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 13px;
          background: #0fd183;
        }

        .yellow {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 13px;
          background: #fa8714;
        }

        .img1 {
          height: 11px;
        }
      }
    }
  }
}
</style>
<style>
.dropdown .van-popup--top,
.van-dropdown-item {
  width: 356px;
  z-index: 999999999999;
  left: 6px;
  overflow: inherit;
}

.van-dropdown-menu__bar {
  box-shadow: none;
}

.van-dropdown-menu__title {
  font-size: 18px;
  padding-left: 0;
}

/* .van-dropdown-menu__title::after,
  .van-dropdown-menu__title--down::after {
    display: none;
  } */
.van-popup--top {
  box-shadow: 5px 0px 30px 5px rgba(0, 0, 0, 0.1);
}
</style>
