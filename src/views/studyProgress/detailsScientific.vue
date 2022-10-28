<template>
  <div class="container">
    <CmNavBar title="科研成果详情" />
    <div class="studyProgress">
      <div class="information">
        <div class="infoTop">
          <div class="name">
            <img class="img1" src="@/assets/img/userIcon.png" alt />
            {{ userInfo.username }}
          </div>
          <div class="number">学号：{{ userInfo.studentNumber }}</div>
        </div>
        <div class="grid">
          <van-row gutter="35">
            <van-col span="8">
              <div class="top">期刊论文</div>
              <div class="bottom">{{ detailsInfo.paperNum }}</div>
            </van-col>
            <van-col span="8">
              <div class="top">学术会议</div>
              <div class="bottom">{{ detailsInfo.conferNum }}</div>
            </van-col>
            <van-col span="8">
              <div class="top">技术专利</div>
              <div class="bottom">{{ detailsInfo.techNum }}</div>
            </van-col>
            <van-col span="8">
              <div class="top">出版著作</div>
              <div class="bottom">{{ detailsInfo.publishNum }}</div>
            </van-col>
            <van-col span="8">
              <div class="top">科研项目</div>
              <div class="bottom">{{ detailsInfo.searchNum }}</div>
            </van-col>
            <van-col span="8">
              <div class="top">重大事件</div>
              <div class="bottom">{{ detailsInfo.competitionNum }}</div>
            </van-col>
          </van-row>
        </div>
      </div>
      <img class="empty" src="@/assets/img/empty.png" />
      <!-- <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>期刊论文</h4>
          </div>
        </div>
        <div
          class="information"
          v-for="(item, index) in paperPublicationList"
          :key="index"
        >
          <div class="mid-content">
            <p>论文名称</p>
            <h4>{{ item.paperTitle }}</h4>
          </div>
          <div class="mid-content">
            <p>发表时间</p>
            <h4>{{ item.publishedTime }}</h4>
          </div>
          <div class="mid-content">
            <p>来源</p>
            <h4>{{ item.source }}</h4>
          </div>
          <div class="mid-content">
            <p>录用时间</p>
            <h4>{{ item.employmentTime }}</h4>
          </div>
          <div class="mid-content">
            <p>本人排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>期刊名称/期刊级别</p>
            <h4>{{ item.periodical }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p style="flex: 1">学院审核/学院审核意见</p>
            <h4 style="flex: 1; height: 40px; text-align: right">
              {{ item.collegeReview }}
            </h4>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>学术会议</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in conferenceList" :key="index">
          <div class="mid-content">
            <p>论文名称</p>
            <h4>{{ item.paperTitle }}</h4>
          </div>
          <div class="mid-content">
            <p>发表时间</p>
            <h4>{{ item.publishedTime }}</h4>
          </div>
          <div class="mid-content">
            <p>发表形式</p>
            <h4>{{ item.publicationForm }}</h4>
          </div>
          <div class="mid-content">
            <p>本人排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>会议名称</p>
            <h4>{{ item.conferenceName }}</h4>
          </div>
          <div class="mid-content">
            <p>期数</p>
            <h4>{{ item.periods }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p>学院审核/学院审核意见</p>
            <h4>{{ item.collegeReview }}</h4>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>技术专利</h4>
          </div>
        </div>
        <div
          class="information"
          v-for="(item, index) in technicalPatentList"
          :key="index"
        >
          <div class="mid-content">
            <p>论文名称</p>
            <h4>{{ item.paperTitle }}</h4>
          </div>
          <div class="mid-content">
            <p>申请时间</p>
            <h4>{{ item.applicationTime }}</h4>
          </div>
          <div class="mid-content">
            <p>公布时间</p>
            <h4>{{ item.publicationTime }}</h4>
          </div>
          <div class="mid-content">
            <p>授权时间</p>
            <h4>{{ item.authorizationTime }}</h4>
          </div>
          <div class="mid-content">
            <p>本人排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>专利类型</p>
            <h4>{{ item.patentType }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p>学院审核/学院审核意见</p>
            <h4>{{ item.collegeReview }}</h4>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>出版著作</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in majorWorksList" :key="index">
          <div class="mid-content">
            <p>著作名称</p>
            <h4>{{ item.opusName }}</h4>
          </div>
          <div class="mid-content">
            <p>出版时间</p>
            <h4>{{ item.publicationDate }}</h4>
          </div>
          <div class="mid-content">
            <p>著作类型</p>
            <h4>{{ item.typeofOpus }}</h4>
          </div>
          <div class="mid-content">
            <p>来源</p>
            <h4>{{ item.source }}</h4>
          </div>
          <div class="mid-content">
            <p>录用时间</p>
            <h4>{{ item.employmentTime }}</h4>
          </div>
          <div class="mid-content">
            <p>本人排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>出版社名称</p>
            <h4>{{ item.publisher }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p>学院审核/学院审核意见</p>
            <h4>{{ item.collegeReview }}</h4>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>科研成果</h4>
          </div>
        </div>
        <div
          class="information"
          v-for="(item, index) in scientificPayoffsList"
          :key="index"
        >
          <div class="mid-content">
            <p>项目名称</p>
            <h4>{{ item.entryName }}</h4>
          </div>
          <div class="mid-content">
            <p>开始时间-结束时间</p>
            <h4>{{ item.beginToEndTime }}</h4>
          </div>
          <div class="mid-content">
            <p>项目编号</p>
            <h4>{{ item.projectNumber }}</h4>
          </div>
          <div class="mid-content">
            <p>项目类型</p>
            <h4>{{ item.typeofOpus }}</h4>
          </div>
          <div class="mid-content">
            <p>经费</p>
            <h4>{{ item.patentType }}</h4>
          </div>
          <div class="mid-content">
            <p>本人排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p>学院审核/学院审核意见</p>
            <h4>{{ item.collegeReview }}</h4>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="titlebox">
          <div class="title">
            <h4>重大赛事</h4>
          </div>
        </div>
        <div class="information" v-for="(item, index) in majorEventsList" :key="index">
          <div class="mid-content">
            <p>竞赛名称</p>
            <h4>{{ item.entryName }}</h4>
          </div>
          <div class="mid-content">
            <p>获奖时间</p>
            <h4>{{ item.beginToEndTime }}</h4>
          </div>
          <div class="mid-content">
            <p>竞赛级别</p>
            <h4>{{ item.projectNumber }}</h4>
          </div>
          <div class="mid-content">
            <p>获奖等级</p>
            <h4>{{ item.typeofOpus }}</h4>
          </div>
          <div class="mid-content">
            <p>授权部门</p>
            <h4>{{ item.patentType }}</h4>
          </div>
          <div class="mid-content">
            <p>参与者排序</p>
            <h4>{{ item.sortSelf }}</h4>
          </div>
          <div class="mid-content">
            <p>导师审核/研究生院审核</p>
            <h4>{{ item.supervisorReview }}</h4>
          </div>
          <div class="mid-content">
            <p>学院审核/学院审核意见</p>
            <h4>{{ item.collegeReview }}</h4>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { getstudentNum } from "@/utils/auth";
import { getAchievement, getBaseInfo } from "@/api/studyProgress";
export default {
  name: "detailsScientific",
  components: {},
  data() {
    return {
      userInfo: {
        username: "",
        studentNumber: "",
      },
      detailsInfo: {},
      // 科研成果展示数据
      scientificList: [
        {
          journalPaper: 5,
          academicConference: 6,
          technicalPatent: 7,
          publishedWorks: 3,
          researchProject: 8,
          majorEvents: 4,
        },
      ],
      // 论文发表情况
      paperPublicationList: [
        {
          paperTitle: "暂无数据",
          publishedTime: "暂无数据",
          source: "暂无数据",
          employmentTime: "暂无数据",
          sortSelf: "暂无数据",
          periodical: "暂无数据",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
      // 学术会议
      conferenceList: [
        {
          paperTitle: "暂无数据",
          publishedTime: "暂无数据",
          publicationForm: "暂无数据",
          conferenceName: "暂无数据",
          sortSelf: "暂无数据",
          periods: "暂无数据",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
      //技术专利
      technicalPatentList: [
        {
          paperTitle: "暂无数据",
          applicationTime: "暂无数据",
          publicationTime: "暂无数据",
          authorizationTime: "暂无数据",
          sortSelf: "暂无数据",
          patentType: "发明专利",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
      //出版著作
      majorWorksList: [
        {
          opusName: "暂无数据",
          publicationDate: "暂无数据",
          typeofOpus: "暂无数据",
          source: "暂无数据",
          employmentTime: "暂无数据",
          sortSelf: "暂无数据",
          publisher: "暂无数据",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
      //科研成果
      scientificPayoffsList: [
        {
          entryName: "暂无数据",
          beginToEndTime: "暂无数据",
          projectNumber: "暂无数据",
          typeofOpus: "暂无数据",
          sortSelf: "暂无数据",
          patentType: "暂无数据",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
      //重大赛事
      majorEventsList: [
        {
          entryName: "暂无数据",
          beginToEndTime: "暂无数据",
          projectNumber: "暂无数据",
          typeofOpus: "暂无数据",
          sortSelf: "暂无数据",
          patentType: "暂无数据",
          supervisorReview: "暂无数据",
          collegeReview: "暂无数据",
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.getUserInfo(); // 首页
    this.getInfoFun(); // 查详情
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
    getInfoFun() {
      let param = {
        studentNumber: getstudentNum(),
      };
      getAchievement(param).then((res) => {
        if (res.responseCode === "100000") {
          this.detailsInfo = res.result;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .van-col {
  text-align: center;
  padding: 10px 0;
}

.grid {
  margin: 0;

  .top {
    // width: 56px;
    // height: 14px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    text-align: center;
    padding-bottom: 10px;
  }

  .bottom {
    // width: 54px;
    // height: 18px;
    font-size: 16px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #1a75ff;
    line-height: 24px;
  }
}

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
        margin: 0;
        height: 14px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
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
  margin: 20px auto;
}
</style>
