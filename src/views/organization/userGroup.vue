<template>
  <div class="container">
    <CmNavBar title="用户组"> </CmNavBar>
    <div class="organization">
      <div class="board">
        <div class="group">
          <CmGroup  />
        </div>
        <div class="teamList">
          <div class="teamItem" @click="categoryCreate">
            <img class="" src="@/assets/img/peoplesIcon.png" />
            <div class="label">添加用户组</div>
          </div>
        </div>
      </div>
      <div class="groupList">
        <div
          class="groupItem"
          v-for="(item, index) in categoryData"
          :key="item.categoryId"
        >
          <div class="groupTitle">
            <div
              class="groupL"
              @click="categoryUserListFun( item.categoryId, index)"
            >
              <div class="imgbox">
                <img
                  :class="item.open ? 'img1' : 'img11'"
                  :src="item.open ? collapseD : collapseR"
                />
              </div>
              <span class="text"
                >{{ item.categoryName }}（{{ item.userNum }}人）</span
              >
            </div>
            <div>
              <img
                class="img2"
                src="@/assets/img/userAddIcon.png"
                @click="
                  goGroupUser(item.groupId, item.categoryId, item.userIds)
                "
              />
              <img
                class="img3"
                src="@/assets/img/menu.png"
                @click="showAction(item.categoryName, item.categoryId)"
              />
            </div>
          </div>
          <div class="userList" v-show="item.open">
            <div
              class="userItem"
              v-for="(item1, index1) in item.userList"
              :key="index1"
            >
              <div class="left">
                <div
                  v-if="item1.avatar"
                  class="img"
                  :style="{ backgroundImage: `url(${item1.avatar})` }"
                ></div>
                <img v-else class="img" src="@/assets/img/tx.png" />
                {{ item1.username }}
              </div>
              <div class="del" @click="userDel(item1)">
                <span>移除</span>
              </div>
            </div>
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
    <van-dialog
      v-model="showCategory"
      :title="`${dialogTitle}用户组`"
      show-cancel-button
      confirmButtonColor="#1A75FF"
      @confirm="categoryConfirm"
    >
      <van-field
        v-model="categoryName"
        placeholder="填写用户组名称"
        class="groupIpt"
      />
    </van-dialog>
  </div>
</template>
<script>
import {
  categoryList,
  categoryAdd,
  categoryUpdate,
  categoryDelete,
  categoryUserList,
  categoryUserDel,
} from "@/api/organization";
import CmGroup from "@/views/components/CmGroup.vue";
import collapseD from "@/assets/img/collapseD.png";
import collapseR from "@/assets/img/collapseR.png";
import { getGroupId } from "@/utils/auth";
export default {
  name: "userGroup",
  components: { CmGroup },
  data() {
    return {
      collapseR,
      collapseD,
      show: false,
      groupId: "",
      categoryId: "",
      categoryName: "",
      showCategory: false,
      dialogTitle: "添加", // 弹框标题
      actions: [{ name: "编辑" }, { name: "删除", color: "#ee0a24" }],
      categoryData: [], // 组列表
    };
  },
  created() {
    this.groupId=getGroupId()
  },
  mounted() {
    if(this.groupId){
      this.categoryListFun(); //组织机构-成员列表
    }
  },
  methods: {
    changeGroupId() {
      this.groupId = getGroupId();
      this.categoryListFun();
    },
    // 查询分组列表
    categoryListFun() {
      let obj = {
        groupId: this.groupId,
      };
      categoryList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.categoryData = res.result.map((item) => {
            return {
              ...item,
              userList: [],
              open: false,
              lock: false,
            };
          });
        }
      });
    },
    // 查询分组 成员 列表
    categoryUserListFun(categoryId, index) {
      this.categoryData[index].open = !this.categoryData[index].open;
      if (this.categoryData[index].open) {
        this.categoryData[index].lock = true;
        if (this.categoryData[index].lock) {
          let obj = {
            groupId: this.groupId,
            categoryId: categoryId,
          };
          categoryUserList(obj).then((res) => {
            if (res.responseCode === "100000") {
              this.categoryData[index].userList = res.result;
            }
          });
        }
      }
    },
    // 操作面板 回调 编辑 删除
    actionSelect(action, index) {
      console.log(action, "action");
      if (index === 0) {
        this.showCategory = true;
        this.dialogTitle = "编辑";
      } else {
        this.$dialog
          .confirm({
            title: "删除提醒",
            message: "\n确定删除该组吗\n\n",
            confirmButtonColor: "#1A75FF",
            confirmButtonText: "确定",
          })
          .then(() => {
            this.categoryDel();
          });
      }
    },
    // 去用户组成员页面
    goGroupUser(groupId, categoryId, userIds) {
      this.$router.push({
        path: "/addGroupUser",
        query: { groupId, categoryId, userIds },
      });
    },
    // 用户组添加
    categoryCreate() {
      this.categoryId = ''
      this.showCategory = true;
      this.dialogTitle = "添加";
    },
    // 用户组 添加修改 提交
    categoryConfirm() {
      if (this.categoryId) {
        let obj = {
          categoryId: this.categoryId,
          groupId: this.groupId,
          categoryName: this.categoryName,
        };
        categoryUpdate(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("修改成功");
            this.categoryName = "";
            this.categoryId = "";
            this.categoryListFun();
          }
        });
      } else {
        let obj = {
          groupId: this.groupId,
          categoryName: this.categoryName,
        };
        categoryAdd(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("添加成功");
            this.categoryName = "";
            this.categoryListFun();
          }
        });
      }
    },
    // 用户组 删除
    categoryDel() {
      let obj = {
        groupId: this.groupId,
        categoryId: this.categoryId,
      };
      categoryDelete(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("删除成功");
          this.categoryName = "";
          this.categoryListFun();
        }
      });
    },
    userDel(item) {
      this.$dialog
        .confirm({
          title: "移除提醒",
          message: "\n确定移除该成员吗\n\n",
          confirmButtonColor: "#1A75FF",
          confirmButtonText: "确定",
        })
        .then(() => {
          // on close
          let obj = {
            groupId: item.groupId,
            categoryId: item.categoryId,
            userId: item.userId,
          };
          categoryUserDel(obj).then((res) => {
            if (res.responseCode === "100000") {
              this.$toast.success("删除成功");
              this.categoryListFun();
            }
          });
        });
    },
    toggleTitle(expand) {
      console.log(expand, "expand");
    },
    // 展示操作面板
    showAction(categoryName, categoryId) {
      this.categoryName = categoryName;
      this.categoryId = categoryId;
      this.show = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.organization {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}
.groupList {
  .groupItem {
    margin-top: 16px;
  }
  .groupTitle {
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 46px;
    .groupL {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .text {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
    }
    .imgbox {
      width: 20px;
      margin-right: 8px;
      display: flex;
      align-items: center;
    }
    .img1 {
      width: 14px;
    }
    .img11 {
      height: 14px;
    }
    .img2 {
      width: 14px;
    }
    .img3 {
      width: 13px;
      margin-left: 32px;
    }
  }
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
      width: 100%;
      border-right: 1px solid #dedede;
      cursor: pointer;
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
.groupIpt {
  width: 272px;
  margin: 32px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
    padding: 0 8px;
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

      .img {
        width: 34px;
        height: 34px;
        border-radius: 4px;
        margin-right: 16px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #f7f7f7;
      }
    }
    .del {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #d0021b;
      line-height: 20px;
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
.van-dialog {
  /* height: 208px; */
  border-radius: 8px;
}
</style>
