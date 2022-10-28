<template>
  <div class="container">
    <CmNavBar title="课程详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt="" />
            {{ userInfo.username }}
          </div>
          <div class="number">学号：{{ userInfo.studentNumber }}</div>
        </div>
        <div class="infoMid">
          <div class="cell">
            <div class="label">总学分</div>
            <div class="value">
              <span class="credits"> {{ detailsCourse.totalCredit }}</span>
              <span class="creditsLow"> 最低要求{{ detailsCourse.lessCredit }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="label">公共学位课学分</div>
            <div class="value">
              <span class="credits"> {{ detailsCourse.publicCredit }}</span>
              <span class="creditsLow">
                最低要求{{ detailsCourse.lessPublicCredit }}</span
              >
            </div>
          </div>
          <div class="cell">
            <div class="label">专业课学分</div>
            <div class="value">
              <span class="credits"> {{ detailsCourse.majorCredit }}</span>
              <span class="creditsLow"> 最低要求{{ detailsCourse.lessMajorCredit }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="label">专业学位课学分</div>
            <div class="value">
              <span class="credits"> {{ detailsCourse.degreeCredit }}</span>
              <span class="creditsLow">
                最低要求{{ detailsCourse.lessDegreeCredit }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="titlebox">
        <div class="title">课程列表</div>
        <van-dropdown-menu
          v-if="yearList.length > 0"
          active-color="#1A75FF"
          class="dropMenu"
          :overlay="false"
        >
          <van-dropdown-item v-model="yearSelect" :options="yearList" />
        </van-dropdown-menu>
      </div>
      <div class="courseList" v-if="detailsCourse.courseList.length > 0">
        <van-collapse
          v-for="(item, index) in detailsCourse.courseList"
          :key="index"
          v-model="activeNames"
          class="courseItem"
        >
          <van-collapse-item :name="index">
            <template #title>
              <div>
                <div class="coursetitle">
                  <span class="left">{{ item.courseName }}</span>
                  <span class="right">{{ item.getCredit }} | {{ item.score }}</span>
                </div>
                <div class="courseSub">
                  <span>{{ item.courseType }}</span>
                  <span>学分{{ item.credit }}</span>
                  <span>学季-{{ item.semester }}</span>
                </div>
              </div>
            </template>
            <div class="courseMid">
              <div class="cell">
                <div class="label">课程编号</div>
                <div class="value">
                  {{ item.code }}
                </div>
              </div>
              <div class="cell">
                <div class="label">任课老师</div>
                <div class="value">{{ item.teacher }}</div>
              </div>
              <div class="cell">
                <div class="label">上课时间</div>
                <div class="value">{{ item.time }}</div>
              </div>
              <div class="cell">
                <div class="label">上课地点</div>
                <div class="value">{{ item.address }}</div>
              </div>
              <div class="cell">
                <div class="label">备注</div>
                <div class="value">{{ item.remark }}</div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div v-else class="studyProgress">
        <img class="empty" src="@/assets/img/empty.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { getCourseResult, getBaseInfo } from "@/api/studyProgress";
import { getstudentNum } from "@/utils/auth";

export default {
  name: "detailsCourse",
  components: {},
  data() {
    return {
      userInfo: {
        username: "",
        studentNumber: "",
      },
      detailsCourse: { courseList: [] },
      yearSelect: "",
      yearList: [
        // { text: '学年2022', value: 2022 },
        // { text: '学年2021', value: 2021 },
        // { text: '学年2020', value: 2020 },
      ],
      activeNames: [0],
    };
  },
  watch: {
    yearSelect(val) {
      this.getCourseResult();
    },
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
    this.getCourseResult();
  },
  methods: {
    getUserInfo() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getBaseInfo(param).then((res) => {
        if (res.responseCode === "100000") {
          this.userInfo = {
            username: res.result.userName,
            studentNumber: res.result.studentNumber,
          };
        }
      });
    },
    getCourseResult() {
      let param = {
        year: this.yearSelect,
        studentNumber: getstudentNum(),
      };
      getCourseResult(param).then((res) => {
        if (res.responseCode == 100000) {
          this.detailsCourse = res.result;
          if (res.result.courseYear) {
            this.yearList = res.result.courseYear.map((item) => {
              return { text: item, value: item };
            });
            this.yearSelect = this.yearSelect
              ? this.yearSelect
              : res.result.courseYear[0];
          }
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
      margin-top: 10px;

      .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 18px;
        }

        .credits {
          font-size: 14px;
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
          font-weight: 500;
          color: #333333;
          line-height: 18px;
        }

        .creditsLow {
          font-size: 12px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
          margin-left: 10px;
        }

        // .value {
        //   font-size: 14px;
        //   font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        //   font-weight: 400;
        //   color: #333333;
        //   line-height: 18px;
        // }
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

        .img1 {
          height: 11px;
        }
      }
    }
  }
}

.titlebox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 13px auto;

  .title {
    width: 84px;
    height: 18px;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #333333;
    line-height: 18px;
  }
}

.courseList {
  .courseItem {
    margin-bottom: 10px;
  }

  .coursetitle {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }

    .right {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #1a75ff;
      line-height: 21px;
    }
  }

  .courseSub {
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
  }

  .courseMid {
    .cell {
      display: flex;
      align-items: flex-start;
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
        max-width: 228px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
    }
  }
}

.empty {
  display: block;
  width: 204px;
  margin: 20px auto;
}
</style>
<style lang="scss">
.dropMenu {
  width: 95px;
  height: 24px;
  background: #ffffff;
  border-radius: 2px;
  position: relative;

  .van-dropdown-menu__bar {
    box-shadow: none;
    height: 24px;
  }

  .van-ellipsis {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1a75ff;
    line-height: 22px;
  }

  .van-dropdown-item--down {
    width: 160px;
  }

  .van-dropdown-item {
    left: calc(50% + 16px);
  }
}
</style>
