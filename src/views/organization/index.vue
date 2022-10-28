<template>
  <div class="container">
    <CmNavBar title="组织架构">
      <template slot="right">
        <div class="navRight" @click="copyDDdata()">同步钉钉数据</div>
      </template>
    </CmNavBar>
    <div class="organization">
      <div class="board">
        <div class="group">
          <CmGroup />
        </div>
        <div class="teamList">
          <div class="teamItem" @click="goUserGroup">
            <img class="" src="@/assets/img/peoplesIcon.png" />
            <div class="label">设置用户组</div>
          </div>
          <div class="teamItem" @click="goUser">
            <img class="" src="@/assets/img/userAddIcon.png" />
            <div class="label">添加成员</div>
          </div>
        </div>
      </div>
      <div class="userList">
        <div class="headbox">
          <div>管理员</div>
          <div>{{ adminList.length }}人</div>
        </div>
        <div class="userItem" v-for="(item, index) in adminList" :key="index">
          <div class="left">
            <img v-if="item.avatar" class="rightArrow" :src="item.avatar" />
            <img v-else src="@/assets/img/tx.png" class="portrait" />
            {{ item.username }}
          </div>
          <div class="right">
            <span>{{ item.role === 1 ? "所有者" : "管理员" }}</span>
            <img
              v-if="item.role !== 1"
              src="@/assets/img/menu.png"
              @click="showAction(item.groupUserId, item.dingUserId, 3)"
            />
          </div>
        </div>
      </div>
      <div class="userList">
        <div class="headbox">
          <div>成员</div>
          <div>{{ memberList.length }}人</div>
        </div>
        <div class="userItem" v-for="(item, index) in memberList" :key="index">
          <div class="left">
            <img v-if="item.avatar" class="rightArrow" :src="item.avatar" />
            <img v-else src="@/assets/img/tx.png" class="portrait" />
            {{ item.username }}
          </div>
          <div
            class="right"
            @click="showAction(item.groupUserId, item.dingUserId, 2)"
          >
            <img src="@/assets/img/menu.png" />
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="actionSelect"
    />
  </div>
</template>
<script>
import {
  syncDing,
  groupUserList,
  groupUserUpdate,
  groupUserDelete,
} from "@/api/organization";
import CmGroup from "@/views/components/CmGroup.vue";
import { getGroupId } from "@/utils/auth";
export default {
  name: "guidanceInformation",
  components: { CmGroup },
  data() {
    return {
      show: false,
      groupId: "",
      adminList: [],
      memberList: [],
      actions: [{ name: "设为管理员" }, { name: "移除", color: "#ee0a24" }],
      groupUserId: "",
      role: "",
    };
  },
  watch: {
    $route(to, from) {
      this.groupUserListFun(); //组织机构-成员列表
    },
    // groupId(val) {
    //   this.groupUserListFun(); //组织机构-成员列表
    // },
  },
  created() {
    this.groupId = getGroupId();
  },
  mounted() {
    if(this.groupId){
      this.groupUserListFun();
    }
     //组织机构-成员列表
  },
  methods: {
    changeGroupId() {
      this.groupId = getGroupId();
      this.groupUserListFun(); //组织机构-成员列表
    },
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
    // 展示操作面板
    showAction(groupUserId, dingUserId, role) {
      this.groupUserId = groupUserId;
      this.dingUserId = dingUserId;
      this.role = role;
      if (role === 3) {
        this.actions[0] = { name: "撤销管理员" };
      } else {
        this.actions[0] = { name: "设为管理员" };
      }
      this.show = true;
    },

    // 操作面板 回调
    actionSelect(action, index) {
      console.log(action, index);

      if (index === 0) {
        let obj = {
          groupId: this.groupId,
          groupUserId: this.groupUserId,
          role: this.role, // 是否排除群主和管理员
        };
        groupUserUpdate(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("修改成功");
            this.groupUserListFun();
          }
        });
      } else if (index === 1) {
        this.$dialog
          .confirm({
            title: "删除提醒",
            message: "\n确定删除该人员吗\n\n",
            confirmButtonColor: "#1A75FF",
            confirmButtonText: "确定",
          })
          .then(() => {
            this.categoryUserDel();
          });
      }
    },
    // 用户组人员  删除
    categoryUserDel() {
      let obj = {
        groupId: this.groupId,
        groupUserId: this.groupUserId,
        dingUserId: this.dingUserId,
      };
      groupUserDelete(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("删除成功");
          this.categoryName = "";
          this.groupUserListFun();
        }
      });
    },
    curChange(id) {
      this.currentId = id;
    },
    // 同步钉钉数据
    copyDDdata() {
      let obj = {
        groupId: this.groupId,
      };
      syncDing(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("同步成功");
        }
      });
    },

    // 设置用户组
    goUserGroup(id) {
      this.$router.push({ path: "/userGroup" });
    },
    // 添加成员
    goUser() {
      this.$router.push({ path: "/addUser", query: { groupId: this.groupId } });
    },
  },
};
</script>
<style lang="scss" scoped>
.organization {
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
.navRight {
  height: 24px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 24px;
}
.board {
  height: 104px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  .group {
    height: 20px;
    border-bottom: 1px solid #dedede;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    .name {
      width: 100%;
      font-size: 18px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 19px;
      display: flex;
      align-items: center;
      img {
        height: 11px;
        margin-left: 8px;
      }
    }
  }
  .teamList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    .teamItem {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 50%;
      border-right: 1px solid #dedede;
      img {
        height: 14px;
        margin-right: 8px;
      }
      .label {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #1a75ff;
      }
    }
    .teamItem:last-child {
      border-right: none;
    }
  }
}
</style>
<style>
.van-dropdown-menu__bar {
  box-shadow: none;
}
.van-dropdown-menu__title::after,
.van-dropdown-menu__title--down::after {
  display: none;
}
</style>
