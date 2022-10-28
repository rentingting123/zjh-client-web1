<template>
  <div class="container">
    <CmNavBar title="导学空间">
      <template slot="right">
        <div class="navRight" @click="goOrganization()">组织架构</div>
      </template>
    </CmNavBar>
    <div class="tutorialTimeTree">
      <div class="board">
        <div class="group">
          <CmGroup />
        </div>
        <div class="info">
          <div>{{ board.introduction || "暂无" }}</div>
          <div class="editBtn" @click="editInfo()">
            <img class="" src="@/assets/img/edit.png" />
          </div>
        </div>
        <div class="teamList">
          <div class="teamItem" @click="goTeam()">
            <img class="" src="@/assets/img/partyb.png" />
            <div class="label">{{ board.userNum || 0 }}</div>
          </div>
          <div class="teamItem" @click="thumbsUpFun">
            <img class="" src="@/assets/img/thumbs.png" />
            <div class="label">{{ board.upNum || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="tabsList">
        <div class="tabsItem" v-for="(item, index) in tabsList" :key="index" @click="curChange(item.id)">
          <div :class="currentId === item.id ? 'titleCur' : 'title'">
            {{ item.title }}
          </div>
        </div>
      </div>
      <folderList ref="folderList" v-show="currentId === 1" />
      <messageList ref="messageList" v-show="currentId === 2" />
    </div>
    <!--弹框 编辑简介  -->
    <van-dialog v-model="showEdit" title="编辑简介" show-cancel-button confirmButtonColor="#1A75FF" @confirm="editConfirm"
      :before-close="onBeforeClose">
      <div class="editBox">
        <van-field v-model="introduction" placeholder="请输入" type="textarea" autosize maxlength="140" rows="6"
          show-word-limit />
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { groupUpdate, thumbsUp } from "@/api/guidanceSpace";
import { groupList } from "@/api/organization";
import CmGroup from "@/views/components/CmGroup.vue";

import folderList from "./folderList.vue";
import messageList from "./messageList.vue";
import { getGroupId, getToken } from "@/utils/auth";
export default {
  name: "tutorialTimeTree",
  components: { folderList, messageList, CmGroup },
  data() {
    return {
      groupId: "",
      currentId: 1,
      board: {
        userNum: 0,
        upNum: 0,
        introduction: "暂无",
      },
      showEdit: false,
      introduction: "", // 简介
      tabsList: [
        {
          id: 1,
          title: "团队文件",
        },
        {
          id: 2,
          title: "团队动态",
        },
      ],
    };
  },
  created() {
    this.groupId = getGroupId()
  },
  mounted() {
    if (!getToken()) {
      this.$router.push({
        path: "/home",
        query: { url: "guidanceSpace" },
      });
    } else {
      if (this.groupId) {
        this.groupListFun(); // 群组
        this.$refs.folderList.folderListFun()
        this.$refs.messageList.messageListFun(1); // 消息列表
      }
    }
  },
  methods: {
    changeGroupId() {
      this.groupId = getGroupId();
      if(this.groupId){
        this.groupListFun(); // 群组
        this.$refs.folderList.folderListFun()
        this.$refs.messageList.messageListFun(1); // 消息列表
      }
    },
    thumbsUpFun() {
      thumbsUp({
        groupId: this.groupId,
      }).then((res) => {
        this.groupListFun();
      });
    },
    groupListFun() {
      groupList().then((res) => {
        if (res.responseCode === "100000") {
          this.board = res.result.filter(item => Number(this.groupId) === item.groupId)[0]
        }
      });
    },
    // 组织机构
    goOrganization() {
      this.$router.push({ path: "/organization" });
    },
    // 当前导航切换
    curChange(id) {
      this.currentId = id;
    },
    // 编辑简介
    editInfo() {
      this.introduction = this.board.introduction
      this.showEdit = true;
    },
    onBeforeClose(action, done) {
      if (action === "confirm") {
        return done(false);
      } else {
        return done();
      }
    },
    // 编辑简介 提交
    editConfirm() {
      if (this.introduction) {
        let obj = {
          groupId: this.groupId,
          introduction: this.introduction,
        };
        groupUpdate(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.showEdit = false;
            this.introduction = ''
            this.$toast.success("提交成功");
            this.groupListFun();
          }
        });
      } else {
        this.$toast.fail("请填写简介");
        return false;
      }
    },
    // 团队成员
    goTeam() {
      this.$router.push({
        path: "/teamList",
        query: { groupId: this.groupId },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tutorialTimeTree {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.tabsList {
  height: 40px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  margin-top: 16px;

  .tabsItem {
    width: 50%;
    text-align: center;
    line-height: 40px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    font-size: 16px;
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

.board {
  min-height: 104px;
  background: #ffffff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;

  .group {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    padding: 16px 0;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    border-bottom: 1px solid #dedede;
    position: relative;

    .editBtn {
      position: absolute;
      right: 0;
      bottom: 16px;

      img {
        width: 14px;
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
        height: 16px;
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

.navRight {
  height: 24px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 24px;
}

.groupIpt {
  width: 272px;
  margin: 32px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.editBox {
  border: 1px solid #dedede;
  margin: 24px 16px;
}
</style>
