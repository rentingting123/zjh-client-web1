<template>
  <div class="container">
    <CmNavBar title="读书报告详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ readReport.userName }}
          </div>
          <div class="number">学号：{{ readReport.studentNumber }}</div>
        </div>
      </div>
      <div class="titlebox">
        <div class="title">个人读书报告列表</div>
      </div>
      <template v-if="readReport.reportList.length > 0">
        <div
          class="courseList"
          v-for="(item, index) in readReport.reportList"
          :key="index"
        >
          <van-cell-group>
            <van-cell :value="item.audit" size="large">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                <span class="van-multi-ellipsis--l2" :title="item.title">{{
                  item.title
                }}</span>

                <!-- <van-tag type="danger">标签</van-tag> -->
              </template>
            </van-cell>
            <van-cell class="bottom-text">
              <div class="text">
                <!-- <p>{{item.teacher}}</p> -->
                <p>{{ item.reportDate }}</p>
              </div>
            </van-cell>
          </van-cell-group>
        </div>
      </template>
      <div v-else class="studyProgress">
        <img class="empty" src="@/assets/img/empty.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { getBaseInfo } from "@/api/studyProgress";
import { getReadReport } from "@/api/studyProgress";
import { getstudentNum } from "@/utils/auth";
export default {
  name: "detailsReading",
  components: {},
  data() {
    return {
      userInfo: {
        username: "",
        studentNumber: "",
      },
      readReport: {
        reportList: [],
      },
      credits: {
        total1: "0",
        totallow1: "0",
        total2: "0",
        totallow2: "0",
        total3: "0",
        totallow3: "0",
        total4: "0",
        totallow4: "0",
      },
      yearSelect: 2022,
      yearList: [
        { text: "学年2022", value: 2022 },
        { text: "学年2021", value: 2021 },
        { text: "学年2020", value: 2020 },
      ],
      activeNames: [0],
    };
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
    this.getReadReport();
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
            // userRole: res.result.userRole,
          };
        }
      });
    },
    getReadReport() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getReadReport(param).then((res) => {
        if (res.responseCode == 100000) {
          this.readReport = res.result;
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
    width: 151px;
    height: 18px;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #333333;
    line-height: 18px;
  }
}
::v-deep .van-cell__title {
  flex: 5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  // width: 256px;
  height: 40px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
::v-deep .van-cell__value {
  width: 42px;
  height: 14px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 14px;
}
::v-deep .van-cell__title:hover {
  overflow: auto;
  white-space: normal;
}
::v-deep .bottom-text {
  padding-top: 0;
}
.text {
  display: flex;
  justify-content: space-between;
  padding-top: 0;
  p {
    margin: 0;
    width: 128px;
    height: 14px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
}
::v-deep .van-cell-group {
  margin-bottom: 10px;
}
::v-deep .van-cell::after {
  border-bottom: 0 solid #000;
}
.studyProgress .information .infoTop[data-v-22ca4d9d] {
  border-bottom: 0 solid #000;
  padding-bottom: 0;
}
// .courseList {
//   .courseItem {
//     margin-bottom: 10px;
//   }

//   .coursetitle {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;

//     .left {
//       font-size: 16px;
//       font-family: SourceHanSansCN-Regular, SourceHanSansCN;
//       font-weight: 400;
//       color: #333333;
//       line-height: 24px;
//     }

//     .right {
//       font-size: 14px;
//       font-family: SourceHanSansCN-Regular, SourceHanSansCN;
//       font-weight: 400;
//       color: #1a75ff;
//       line-height: 21px;
//     }
//   }

//   .courseSub {
//     font-size: 14px;
//     font-family: SourceHanSansCN-Regular, SourceHanSansCN;
//     font-weight: 400;
//     color: #999999;
//     line-height: 21px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin: 10px 0;
//   }

//   .courseMid {
//     .cell {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       margin-top: 10px;

//       .label {
//         font-size: 14px;
//         font-family: SourceHanSansCN-Regular, SourceHanSansCN;
//         font-weight: 400;
//         color: #999999;
//         line-height: 18px;
//       }

//       .value {
//         max-width: 228px;
//         font-size: 14px;
//         font-family: SourceHanSansCN-Regular, SourceHanSansCN;
//         font-weight: 400;
//         color: #333333;
//         line-height: 18px;
//       }
//     }
//   }
// }
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
.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}
</style>
