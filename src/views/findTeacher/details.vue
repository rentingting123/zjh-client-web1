<template>
  <div class="container">
    <CmNavBar title="名师主页" />
    <div class="details">
      <div class="userInfosTop">
        <div v-if="userInfo.avatar" class="portrait" :style="{ backgroundImage: `url(${userInfo.avatar})` }"></div>
        <img v-else src="@/assets/img/tx.png" class="portrait" />
        <div class="infocon">
          <div class="name">{{ userInfo.username }}</div>
          <div class="school">{{ userInfo.major }}</div>
        </div>
        <div class="identity">
          {{ userInfo.teacherTitle }}
          <!-- <div class="btn">{{ userInfo.identity == 1 ? "教授" : "学生" }}</div> -->
        </div>
      </div>

      <div class="direction">
        <div class="research">
          <img src="@/assets/img/tag.png" alt="" />
          <span>研究方向 </span>
        </div>
        <div class="fields">
          {{ userInfo.researchDirection }}
        </div>
      </div>
      <div class="tabsList">
        <div class="tabsItem" v-for="(item, index) in tabsList" :key="index" @click="tabsChange(item.id)">
          <div :class="tabsId === item.id ? 'titleCur' : 'title'">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div v-if="tabsId === 1" class="profile">
        {{ userInfo.userDesc ? userInfo.userDesc : "暂无" }}
      </div>
      <div v-if="tabsId === 2">
        <div>
          <div class="studentsList">
            <div class="studentsItem" v-for="(item, index) in studentsList" :key="index">
              <div class="userInfos">
                <div v-if="item.avatar" class="portrait" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                <img v-else src="@/assets/img/tx.png" class="portrait" />
                <div class="infocon" @click="curChange(item.id)">
                  <div class="name">{{ item.username }}</div>
                  <div class="school">
                    {{ item.department }} （{{ item.enrolYear }}级）
                  </div>
                  <div class="info">{{ item.researchDirection }}</div>
                </div>
                <div class="identity" @click="goDingDing">
                  <img src="@/assets/img/userListIcon.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { userInfo } from "@/api/find";
import { goDingOpen } from "@/utils/dingtalk.js";
export default {
  name: "teacherDetails",
  components: {},
  data() {
    return {
      userInfo: {
        userId: "",
        avatar: "",
        username: "",
        major: "",
        researchDirection: "",
        userDesc: "",
        teacherTitle: "",
        dingUserId: ''
      },
      currentId: 1,
      studentsList: [],
      tabsId: 1,
      tabsList: [
        {
          id: 1,
          title: "个人简介",
        },
        {
          id: 2,
          title: "名师学生",
        },
      ],
      profile: "",
    };
  },
  watch: {
    $route(to, from) {
      this.initData();
    },
  },
  created() { },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.userInfo = {
        userId: this.$route.params.userId,
        avatar: this.$route.params.avatar,
        username: this.$route.params.username,
        major: this.$route.params.major,
        researchDirection: this.$route.params.researchDirection,
        userDesc: this.$route.params.userDesc,
        teacherTitle: this.$route.params.teacherTitle,
        dingUserId: this.$route.params.dingUserId,
      };
      if (this.$route.params.userId) {
        this.userInfoFun(); // 首页
      }
    },
    userInfoFun() {
      let obj = {
        userRole: 2, // 用户角色，1-导师，2-学生
        search: "",
        teacherId: this.userInfo.userId, //当要查询老师下面的学生时，这个参数需要传
      };
      userInfo(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.studentsList = res.result.records; //
        }
      });
    },

     goDingDing() {
      goDingOpen(this.userInfo.dingUserId)
    },
    curChange(id) {
      this.currentId = id;
    },
    tabsChange(id) {
      this.tabsId = id;
    },
  },
};
</script>
<style lang="scss" scoped>
.details {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.studentsList {
  .studentsItem {
    height: 80px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 16px;

    .userInfos {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .portrait {
        width: 60px;
        height: 80px;
        margin-right: 16px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #f7f7f7;
      }

      .infocon {
        flex: 1;
        height: 80px;

        .name {
          height: 14px;
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 21px;
          margin-top: 9px;
        }

        .school {
          height: 12px;
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 18px;
          margin: 14px 0;
        }

        .info {
          height: 12px;
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
          margin-top: 8px;
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

.userInfosTop {
  // height: 80px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;

  // align-items: center;
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

    .name {
      height: 20px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 19px;
      margin-top: 16px;
    }

    .school {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 19px;
      margin: 9px 0;
    }
  }

  .identity {
    // width: 48px;
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
    padding: 0 8px;
  }
}

.direction {
  .research {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;

    img {
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }
  }

  .fields {
    // height: 12px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #666666;
    line-height: 18px;
    margin-top: 10px;
    margin-bottom: 16px;
  }
}

.tabsList {
  height: 40px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;

  .tabsItem {
    text-align: center;
    line-height: 40px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    font-size: 16px;
    width: 176px;
    cursor: pointer;

    .titleCur {
      background: #1a75ff;
      border-radius: 4px;
      font-size: 16px;
      color: #ffffff;
    }

    .title {
      color: #1a75ff;
    }
  }
}

.profile {
  min-height: 406px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 24px;
  padding: 8px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
}
</style>
<style>
input::-webkit-input-placeholder {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #999999;
}

input::-moz-placeholder {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #999999;
}

input:-moz-placeholder {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #999999;
}

input:-ms-input-placeholder {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #999999;
}
</style>
