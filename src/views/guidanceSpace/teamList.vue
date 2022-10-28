<template>
  <div class="container">
    <CmNavBar title="团队成员" />
    <div class="team">
      <div class="userList">
        <div class="userItem" v-for="(item, index) in teamList" :key="index">
          <div class="left">
            <img v-if="item.avatar" class="rightArrow" :src="item.avatar" />
            <img v-else src="@/assets/img/tx.png" class="portrait" />
            {{ item.username }}
            <span v-if="item.isSelf" class="myself">我自己</span>
          </div>
          <div class="right">
            <img
              v-if="item.isSelf"
              src="@/assets/img/exit.png"
              @click="goLogout()"
            />
            <span v-if="item.role === 1" class="admin">群主</span>
            <span v-else-if="item.role === 2" class="admin">管理员</span>
            <span v-else="item.role === 3">成员</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { groupUserQuit, teamUser } from "@/api/guidanceSpace";
export default {
  name: "Homepc",
  components: {},
  data() {
    return {
      groupId: "",
      teamList: [],
    };
  },
  created() {},
  mounted() {
    this.groupId = this.$route.query.groupId;
    this.teamUserFun(); //组织机构-成员列表
  },
  methods: {
    //组织机构-成员列表
    teamUserFun() {
      let obj = {
        groupId: this.groupId,
        excludeOwner: false, // 是否排除群主和管理员
      };
      teamUser(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.teamList = res.result; //
        }
      });
    },
    goLogout() {
      this.$dialog
        .confirm({
          title: "退出提醒",
          message: "\n确定退出该团队吗\n\n",
          confirmButtonColor: "#1A75FF",
          confirmButtonText: "确定",
        })
        .then(() => {
          this.userQuit();
        });
    },
    // 用户组 退出
    userQuit() {
      let obj = {
        groupId: this.groupId,
      };
      groupUserQuit(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("退出成功");
          this.$router.push("/home");
        } else {
          this.$toast.fail(res.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}
.team {
  padding: 60px 12px 16px;
  box-sizing: border-box;
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
</style>
