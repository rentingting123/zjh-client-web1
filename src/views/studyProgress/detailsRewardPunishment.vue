<template>
  <div class="container">
    <CmNavBar title="奖助信息详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ username }}
          </div>
          <div class="number">学号：{{ studentNumber }}</div>
        </div>
      </div>
      <div v-if="scholarshipList.length > 0">
        <div class="titlebox">
          <div class="title">
            <h4>奖学金</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in scholarshipList" :key="index">
          <div class="mid-content">
            <p>类型</p>
            <h4>{{ item.type }}</h4>
          </div>
          <div class="mid-content">
            <p>名称</p>
            <h4>{{ item.name }}</h4>
          </div>
          <div class="mid-content">
            <p>年份</p>
            <h4>{{ item.year }}</h4>
          </div>
        </div>
      </div>
      <div v-if="subsidiesList.length > 0">
        <div class="titlebox">
          <div class="title">
            <h4>助学金</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in subsidiesList" :key="index">
          <div class="mid-content">
            <p>名称</p>
            <h4>{{ item.name }}</h4>
          </div>
          <div class="mid-content">
            <p>年份</p>
            <h4>{{ item.year }}</h4>
          </div>
        </div>
      </div>
      <div v-if="other.length > 0">
        <div class="titlebox">
          <div class="title">
            <h4>其他</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in other" :key="index">
          <div class="mid-content">
            <p>等级</p>
            <h4>{{ item.type }}</h4>
          </div>
          <div class="infoBox">
            <div class="label">情况说明</div>
            <div class="info">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="
          scholarshipList.length === 0 && subsidiesList.length === 0 && other.length === 0
        "
        class="studyProgress"
      >
        <img class="empty" src="@/assets/img/empty.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { getstudentNum } from "@/utils/auth";
import { getRewardPunish, getBaseInfo } from "@/api/studyProgress";
export default {
  name: "detailsRewardPunishment",
  components: {},
  data() {
    return {
      username: "",
      studentNumber: "",
      scholarshipList: [],
      subsidiesList: [],
      other: [],
    };
  },
  created() {},
  mounted() {
    // this.getUserInfo(); // 首页
    this.getRewardPunish();
  },
  methods: {
    getRewardPunish() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getRewardPunish(param).then((res) => {
        if (res.responseCode == "100000") {
          this.username = res.result.userName;
          this.studentNumber = res.result.studentNumber;
          this.scholarshipList = res.result.scholarshipList;
          this.subsidiesList = res.result.subsidiesList;
          this.other = res.result.other;
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
    .infoBox {
      .label {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        width: 100px;
      }

      .info {
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
.info {
  word-wrap: break-word;
  flex: 1;
}
</style>
