<template>
  <div class="container">
    <CmNavBar title="开题报告详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ userInfo.username }}
          </div>
          <div class="number">学号：{{ userInfo.studentNumber }}</div>
        </div>
        <div>
          <div class="infoTop1">
            <p>研究方向</p>
            <h4>{{ openingDetail.researchDirection }}</h4>
          </div>
          <div class="infoTop1">
            <p>指导小组成员</p>
            <h4>{{ openingDetail.guidanceMember }}</h4>
          </div>
        </div>
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>开题报告简况</h4>
        </div>
      </div>
      <div class="information">
        <div class="mid-content">
          <p>拟定论文题目</p>
          <h4>{{ openingDetail.paperTitle }}</h4>
        </div>
        <div class="mid-content">
          <p>报告时间</p>
          <h4>{{ openingDetail.reportDate }}</h4>
        </div>
        <div class="mid-content">
          <p>报告地点</p>
          <h4>{{ openingDetail.reportAddr }}</h4>
        </div>
        <div class="mid-content">
          <p>报告类型</p>
          <h4>{{ openingDetail.reportType }}</h4>
        </div>
        <div class="mid-content">
          <p>报告来源</p>
          <h4>{{ openingDetail.reportSource }}</h4>
        </div>
        <div class="mid-content">
          <p>听众人数</p>
          <h4>{{ openingDetail.audienceNum }}</h4>
        </div>
        <div class="mid-content">
          <p>原文</p>
        </div>
        <div class="mid-content">
          <h4 class="report">{{ openingDetail.fileName }}</h4>
        </div>
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>评审专家</h4>
        </div>
      </div>
      <div class="information">
        <table
          class="table"
          border="1"
          cellspacing="0"
          width="100%"
          height="100%"
          align="center"
        >
          <tr align="center">
            <th v-for="(item, index) in tableOption" :key="index">{{ item }}</th>
          </tr>
          <template v-if="openingDetail.expertInfoList.length > 0">
            <tr
              align="center"
              v-for="(item, index) in detailsInfo.expertInfoList"
              :key="index"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.subject }}</td>
              <td>{{ item.academicTitle }}</td>
              <td>{{ item.coach }}</td>
            </tr>
          </template>
          <tr v-else align="center">
            <td colspan="4">暂无数据</td>
          </tr>
        </table>
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>院系审核</h4>
        </div>
      </div>
      <div class="information">
        <div>
          <div class="infoTop1 padding">
            <p>审核状态</p>
            <h4>{{ openingDetail.audit }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { getUserInfo } from "@/api/home";
import { getstudentNum } from "@/utils/auth";
import { getOpening, getBaseInfo } from "@/api/studyProgress";
export default {
  name: "detailsOpeningReport",
  components: {},
  data() {
    return {
      userInfo: {
        username: "",
        studentNumber: "",
      },
      openingDetail: {
        expertInfoList: [],
      },
      // 头部数据
      // 表格的表头标题
      tableOption: ["姓名", "所在学科", "职称", "是否辅导"],
    };
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
    this.getOpening();
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
    getOpening() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getOpening(param).then((res) => {
        if (res.responseCode == 100000) {
          this.openingDetail = res.result;
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
    .mid-content:nth-child(1) {
      padding-top: 0;
    }

    .mid-content {
      .report {
        width: 320px;
        height: 40px;
        background: #f8f7fa;
        border-radius: 4px;
        line-height: 40px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .infoTop1,
    .mid-content {
      display: flex;
      justify-content: space-between;
      padding: 10px 0 0 0;
      p {
        margin: 0;
        height: 14px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
      }
      h4 {
        flex: 1;
        text-align: right;
        margin: 0;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
    }
  }
  .table {
    border-collapse: collapse;
    border: 1px solid #d1e3ff;
    th {
      width: 24px;
      height: 12px;
      font-size: 12px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      color: #999999;
      font-weight: 400;
    }
    td {
      width: 48px;
      height: 12px;
      font-size: 12px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }
  }
}

.titlebox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 13px auto;

  .title {
    width: 113px;
    height: 18px;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #333333;
    line-height: 18px;
    h4 {
      margin: 0;
    }
  }
}
.padding {
  padding-top: 0 !important;
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
