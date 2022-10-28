<template>
  <div class="container" v-if="openGroupUser">
    <van-nav-bar
      title="添加用户组成员"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="participant">
      <div class="userList">
        <div class="headbox">
          <div>
            <van-checkbox :disabled='disabled' v-model="check1" @click="checkAllAdmin" shape="square"
              >管理员（{{ adminList.length }}人）</van-checkbox
            >
          </div>
        </div>
        <van-checkbox-group :disabled='disabled' v-model="participants1" ref="checkAdmin">
          <van-checkbox
            v-for="(item, index) in adminList"
            :key="index"
            
            :name="item.userId"
            shape="square"
          >
            <div class="userItem">
              <div class="left">
                <img class="rightArrow" :src="item.avatar" />
                {{ item.username }}
              </div>
            </div>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="userList">
        <div class="headbox">
          <van-checkbox :disabled='disabled' v-model="check2" @click="checkAllMember" shape="square"
            >成员（ {{ memberList.length }}人）</van-checkbox
          >
        </div>
        <van-checkbox-group :disabled='disabled' v-model="participants2" ref="checkMember">
          <van-checkbox
            v-for="(item, index) in memberList"
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
      </div>
      <div class="checkAll" v-if="!disabled">
        <van-checkbox v-model="check3" @click="checkAll" shape="square"
          >全选</van-checkbox
        >
        <div class="checkr">
          <div class="text">
            已选中{{ participants1.length + participants2.length }}人
          </div>
          <div class="submitBtn" @click="goAdd">完成</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { groupUserList } from "@/api/organization";
export default {
  name: "addParticipant",
  components: {},
  props:['openGroupUser',"userIds",'disabled'],
  data() {
    return {
      groupId: "", // 群id
      categoryId: "", // 组id
      checked: true,
      adminList: [],
      memberList: [],
      check1: false,
      check2: false,
      check3: false,
      participants1: [],
      participants2: [],
    };
  },
  created() {},
  mounted() {
    this.groupId = this.$route.query.groupId;
    // this.categoryId = this.$route.query.categoryId;
    // this.userIds = this.$route.query.userIds;
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
          console.log(this.userIds)
          console.log(this.adminList)

          this.adminList.forEach((item) => {
            if (this.userIds.includes(item.userId)) {
              this.participants1.push(item.userId);
            }
          });
          this.memberList.forEach((item) => {
            if (this.userIds.includes(item.userId)) {
              this.participants2.push(item.userId);
            }
          });
        }
      });
    },
    checkAllAdmin() {
      if (this.check1) {
        this.$refs.checkAdmin.toggleAll(true);
      } else {
        this.$refs.checkAdmin.toggleAll();
      }
    },
    checkAllMember() {
      if (this.check2) {
        this.$refs.checkMember.toggleAll(true);
      } else {
        this.$refs.checkMember.toggleAll();
      }
    },
    // 全选
    checkAll() {
      if (this.check3) {
        this.check1 = true;
        this.check2 = true;
      } else {
        this.check1 = false;
        this.check2 = false;
      }

      this.checkAllAdmin();
      this.checkAllMember();
    },
    onClickLeft(){
      this.$emit("cancel", true);
    },
    // 添加
    goAdd() {
      this.$parent.form.participants=[...this.participants1, ...this.participants2]
       this.$emit("cancel", true);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  background: #f8f7fa;
}
.participant {
  padding: 0px 12px 80px;
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
    .text {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
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
<style>
.participant .van-checkbox__label {
  width: 100%;
}
</style>
