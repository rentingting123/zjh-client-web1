<template>
  <div class="container">
    <CmNavBar title="找导师" />
    <div class="teacher">
      <div class="search">
        <van-field class="searchIpt" v-model="searchValue" placeholder="搜索导师姓名/研究方向关键词" />
        <div class="searchBtn" @click="searchFun">搜索</div>
      </div>
      <div>
        <van-list v-if="teacherList.length > 0" v-model="loading" :finished="finished" finished-text="没有更多了"
          @load="userInfoFun" class="teacherList">
          <div class="teacherItem" v-for="(item, index) in teacherList" :key="index">
            <div class="userInfos">
              <div v-if="item.avatar" class="portrait" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
              <img v-else src="@/assets/img/tx.png" class="portrait" />
              <div class="infocon" @click="curChange(item)">
                <div class="name">{{ item.username }}</div>
                <div class="school">
                  <span>{{ item.teacherTitle }} </span>
                  <span v-if="item.teacherType"> I {{ item.teacherType }}</span>
                </div>
                <div class="info">{{ item.researchDirection | ellipsis }}</div>
              </div>
              <div class="identity" @click="goDingDing(item.dingUserId)">
                <img src="@/assets/img/userListIcon.png" />
              </div>
            </div>
          </div>
        </van-list>
        <img v-else class="empty" src="@/assets/img/empty.png" />
      </div>
    </div>
  </div>
</template>
<script>
import { userInfo } from "@/api/find";
import { goDingOpen } from "@/utils/dingtalk.js";
export default {
  name: "Homepc",
  components: {},
  data() {
    return {
      searchValue: "",
      teacherList: [],
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 15,
      total: 0,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 18) {
        return value.slice(0, 18) + '...'
      }
      return value
    }
  },
  created() { },
  mounted() {
    this.userInfoFun(); // 首页
  },
  methods: {
    userInfoFun() {
      let obj = {
        userRole: 1, // 用户角色，1-导师，2-学生
        search: this.searchValue,
        teacherId: "", //当要查询老师下面的学生时，这个参数需要传
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      userInfo(obj).then((res) => {
        this.total = res.result.total;
        if (res.responseCode === "100000") {
          setTimeout(() => {
            // 加载状态结束
            this.loading = false;
          }, 0);
          // 数据全部加载完成
          if (this.teacherList.length >= this.total) {
            this.finished = true;
          } else {
            if (res.result.records.length > 0) {
              this.teacherList = this.teacherList.concat(
                res.result.records
              );
              this.pageNum = ++this.pageNum;
            }
          }
        }
      });
    },
    curChange(item) {
      this.$router.push({
        name: "teacherDetails",
        params: { ...item },
      });
    },
    searchFun() {
      this.pageNum = 1
      this.teacherList = []
      this.userInfoFun(); // 首页
    },
    goDingDing(dingUserId) {
      goDingOpen(dingUserId)
    }
  },
};
</script>
<style lang="scss" scoped>
.teacher {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.search {
  display: flex;

  .searchIpt {
    width: 351px;
    height: 40px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    line-height: 40px;
    padding: 0 8px;
  }

  .searchBtn {
    width: 60px;
    height: 40px;
    background: #1a75ff;
    border-radius: 4px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #ffffff;
    line-height: 18px;
    text-align: center;
    line-height: 40px;
  }
}

.teacherList {
  .teacherItem {
    // height: 80px;
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

        // height: 80px;
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
          // height: 12px;
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 18px;
          margin-top: 14px;
        }

        .info {
          // height: 12px;
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
          margin: 8px 0;
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

.empty {
  display: block;
  width: 204px;
  margin: 80px auto;
}
</style>
