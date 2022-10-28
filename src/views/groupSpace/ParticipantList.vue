<template>
  <div class="container">
    <CmNavBar title="添加参与人" />
    <div class="participant">
      <div class="userList">
        <div class="headbox">
          <div>管理员（{{ adminList.length }}人）</div>
        </div>
        <div class="userItem" v-for="(item, index) in adminList" :key="index">
          <div class="left">
            <img class="rightArrow" :src="item.avatar" />
            {{ item.username }}
          </div>
        </div>
      </div>
      <div class="userList">
        <div class="headbox">
          <div>成员（ {{ memberList.length }}人）</div>
        </div>
        <div class="userItem" v-for="(item, index) in memberList" :key="index">
          <div class="left">
            <img v-if="item.avatar" class="rightArrow" :src="item.avatar" />
            <img v-else src="@/assets/img/tx.png" class="portrait" />
            {{ item.username }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { groupList, groupUserList } from "@/api/organization";
export default {
  name: "addParticipant",
  components: {},
  data() {
    return {
      checked: true,
      adminList: [],
      memberList: [],
      groupId: 4,
    };
  },
  created() {},
  mounted() {
    this.groupUserListFun(); //组织机构-成员列表
  },
  methods: {
    //组织机构-成员列表
    groupUserListFun() {
      let obj = {
        groupId: this.groupId,
        excludeOwner: false, // 是否排除群主和管理员
      };
      groupUserList(obj).then((res) => {
        if (res.responseCode === "100000") {
           this.adminList = res.result.filter((item) => item.role !== 3); //
          this.memberList = res.result.filter((item) => item.role == 3); //
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.participant {
  padding: 60px 12px 16px;
  box-sizing: border-box;
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
</style>
