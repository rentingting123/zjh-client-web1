<template>
  <div class="container">
    <CmNavBar title="添加成员" />
    <div class="participant">
      <div class="search">
        <van-field
          class="searchIpt"
          v-model="searchValue"
          placeholder="请输入搜索内容"
        />
        <div class="searchBtn" @click="searchFun">搜索</div>
      </div>
      <van-list
        v-if="userList.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="groupUserListFun"
        class="userList"
      >
        <van-checkbox-group v-model="participants1" ref="checkAdmin">
          <van-checkbox
            v-for="(item, index) in userList"
            :key="index"
            :name="item.userId"
            shape="square"
          >
            <div class="userItem">
              <div class="left">
                <img v-if="item.avatar" class="rightArrow" :src="item.avatar" />
                <img v-else src="@/assets/img/tx.png" class="portrait" />
                {{ item.username }}
              </div>
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </van-list>
      <img v-else class="empty" src="@/assets/img/empty.png" />
      <div class="checkAll">
        <van-checkbox v-model="check1" @click="checkAll" shape="square"
          >全选</van-checkbox
        >
        <div class="checkr">
          <div v-if="participants1.length > 0" class="text2" @click="goChoose">
            已选中{{ participants1.length }}人
          </div>
          <div v-else class="text1">已选中{{ participants1.length }}人</div>
          <div class="submitBtn" @click="complete()">完成</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { groupUserAdd, groupUserSearch } from "@/api/organization";
export default {
  name: "addParticipant",
  components: {},
  data() {
    return {
      searchValue: "",
      userList: [],
      groupId: "",
      check1: false,
      participants1: [],
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 15,
      total: 0,
    };
  },
  created() {},
  mounted() {
    this.groupId = this.$route.query.groupId;
    this.groupUserListFun(); //组织机构-成员列表
  },
  methods: {
    // 全选
    checkAll() {
      if (this.check1) {
        this.$refs.checkAdmin.toggleAll(true);
      } else {
        this.$refs.checkAdmin.toggleAll(false);
      }
    },
    //组织机构-成员列表
    groupUserListFun() {
      let obj = {
        groupId: this.groupId,
        search: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      groupUserSearch(obj).then((res) => {
        if (res.responseCode === "100000") {
          setTimeout(() => {
            this.loading = false;
          }, 0);
          // 数据全部加载完成
          this.total = res.result.total;
          if (this.userList.length >= this.total) {
            this.finished = true;
            if (this.total === 0) {
              this.userList = [];
            }
          } else {
            if (res.result.records.length > 0) {
              this.userList = this.userList.concat(res.result.records);
              this.pageNum = ++this.pageNum;
            } else {
              this.userList = [];
            }
          }
        }
      });
    },
    // 添加
    complete() {
      let obj = {
        groupId: this.groupId,
        userIds: this.participants1,
      };
      groupUserAdd(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("添加成功");
          this.participants1 = [];
          this.$router.go(-1);
        }else{
          this.$toast.fail(res.message);
        }
      });
    },
    // 去已选中页面
    goChoose() {
      console.log(this.participants1);
      this.$router.push({
        name: "chooseList",
        params: { groupId: this.groupId, participants1: [...this.participants1] },
      });
    },
    searchFun() {
      this.pageNum = 1;
      this.groupUserListFun(); // 组织机构-成员列表
    },
  },
};
</script>
<style lang="scss" scoped>
.participant {
  padding: 60px 12px 80px;
  box-sizing: border-box;
}
.checkAll {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  background: #ffffff;
  padding: 0 12px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #666666;
  box-sizing: border-box;
  .checkr {
    display: flex;
    align-items: center;
    .text1 {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      line-height: 21px;
      color: #999999;
    }
    .text2 {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      line-height: 21px;
      color: #1a75ff;
    }
    .submitBtn {
      width: 120px;
      height: 40px;
      background: #1a75ff;
      border-radius: 4px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      margin-left: 16px;
    }
  }
}
.userList {
  .headbox {
    height: 46px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .userItem {
    flex: 1;
    height: 46px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    margin-bottom: 8px;
    .left {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
      display: flex;
      align-items: center;
      img {
        width: 34px;
        height: 34px;
        margin-right: 16px;
        border-radius: 4px;
      }
    }
    .right {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
      img {
        width: 13px;
        height: 10px;
        margin-left: 16px;
      }
    }
  }
}
.userList {
  .userItem {
    height: 46px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    margin-top: 8px;
    .left {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
      display: flex;
      align-items: center;
      img {
        width: 34px;
        height: 34px;
        margin-right: 16px;
        border-radius: 4px;
      }
      .myself {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: rgba(26, 117, 255, 0.5);
        margin-left: 8px;
      }
    }
    .right {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
      .admin {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #1a75ff;
      }
      img {
        width: 13px;
        height: 10px;
        margin-right: 16px;
      }
    }
  }
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
.empty {
  display: block;
  width: 204px;
  margin: 100px auto;
}
</style>
<style>
.participant .van-checkbox__label {
  width: 100%;
}
</style>
