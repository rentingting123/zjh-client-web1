<template>
  <div class="container">
    <CmNavBar title="前置学业信息详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ user.userName }}
          </div>
          <div class="number">学号：{{ user.studentNumber }}</div>
        </div>
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>本科信息</h4>
        </div>
      </div>
      <div class="information">
        <div class="mid-content">
          <p>毕业单位名称</p>
          <h4>{{ user.bachelorSchool || "-" }}</h4>
        </div>
        <div class="mid-content">
          <p>毕业专业名称</p>
          <h4>{{ user.bachelorMajor || "-" }}</h4>
        </div>
        <div class="mid-content">
          <p>毕业时间</p>
          <h4>{{ user.bachelorDate || "-" }}</h4>
        </div>
        <!-- <div class="mid-content">
          <p>学号</p>
          <h4>{{ user.bachelorNumber || "-" }}</h4>
        </div> -->
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>硕士信息</h4>
        </div>
      </div>
      <div class="information">
        <div class="mid-content">
          <p>毕业单位名称</p>
          <h4>{{ user.masterSchool || "-" }}</h4>
        </div>
        <div class="mid-content">
          <p>毕业专业名称</p>
          <h4>{{ user.masterMajor || "-" }}</h4>
        </div>
        <div class="mid-content">
          <p>毕业时间</p>
          <h4>{{ user.masterDate || "-" }}</h4>
        </div>
        <!-- <div class="mid-content">
          <p>学号</p>
          <h4>{{ user.masterNumber || "-" }}</h4>
        </div> -->
      </div>
      <div class="titlebox">
        <div class="title">
          <h4>简历信息</h4>
        </div>
      </div>
      <template v-if="user.resumes.length > 0">
        <div class="resumes" v-for="(item, index) in user.resumes" :key="index">
          {{ item }}
        </div>
      </template>
      <div v-else class="resumes">-</div>
    </div>
  </div>
</template>
<script>
import { getstudentNum } from "@/utils/auth";
import { getPreGraduateInfo } from "@/api/studyProgress";
export default {
  name: "detailsPreStudy",
  components: {},
  data() {
    return {
      user: {
        resumes: [],
      },
    };
  },
  created() {},
  mounted() {
    this.getPreGraduateInfoFun();
  },
  methods: {
    getPreGraduateInfoFun() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getPreGraduateInfo(param).then((res) => {
        if (res.responseCode == "100000") {
          this.user = res.result;
          this.user.resumes = res.result.resumes || [];
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
    margin-bottom: 10px;

    .infoTop {
      display: flex;
      align-items: center;
      justify-content: space-between;

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

.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}

.resumes {
  margin: 0 auto 10px;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 15px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #333333;
  word-wrap: break-word;
  // line-height: 18px;
}

.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}
</style>
