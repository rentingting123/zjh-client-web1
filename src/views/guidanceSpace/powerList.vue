<template>
  <div class="container">
    <CmNavBar title="权限管理"> </CmNavBar>
    <div class="organization">
      <div class="fileItem">
        <div class="userInfos">
          <img src="@/assets/img/word.png" class="portrait" />
          <div class="infocon" @click="goFileList(folderItem.folderId)">
            <div class="name">{{ folderItem.folderName }}</div>
            <div class="school">
              {{ folderItem.updateFileName }}
              <span v-if="folderItem.updateUsername">|</span>
              {{ folderItem.updateUsername }}
            </div>
            <div class="info">{{ folderItem.gmtModified }} 更新</div>
          </div>
        </div>
      </div>
      <div class="userList">
        <van-collapse v-model="activeNames">
          <van-collapse-item name="1" :is-link="false" @toggle="toggleTitle(1)">
            <template #title>
              <div class="collapseTitle">
                <div>
                  <img class="img1" src="@/assets/img/collapseD.png" />
                  <span class="text">管理员（{{ adminUser.length }}人）</span>
                </div>
              </div>
            </template>
            <div class="userItem1" v-for="(item, index) in adminUser" :key="index">
              <div class="userbox">
                <div v-if="item.avatar" :style="{ backgroundImage: `url(${item.avatar})` }" class="avatar"></div>
                <img class="avatar" v-else src="@/assets/img/tx.png" />
                <div class="role">
                  {{ item.role === 1 ? "群主" : "管理员" }}
                </div>
                <div class="name">{{ item.username }}</div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
        <div class="groupList">
          <div class="groupItem" v-for="(item, index) in categoryList" :key="item.objectId">
            <div class="groupTitle">
              <div class="groupL" @click="
                categoryUserListFun(item.folderId, item.objectId, index)
              ">
                <div class="imgbox">
                  <img :class="item.open ? 'img1' : 'img11'" :src="item.open ? collapseD : collapseR" />
                </div>
                <span class="text">{{ item.objectName }}
                  <template v-if="item.userIds">
                    （{{ item.userIds.length || 0 }}人）
                  </template>
                </span>
              </div>
              <div @click="showAction(item)">
                <span class="permission">{{ item.permission }}</span>
                <img class="img3" src="@/assets/img/bottomIcon.png" />
              </div>
            </div>
            <div class="userList1" v-show="item.open">
              <div class="userItem1" v-for="(item1, index1) in item.userList" :key="index1">
                <div class="userbox">
                  <div v-if="item1.avatar" :style="{ backgroundImage: `url(${item1.avatar})` }" class="avatar"></div>
                  <img class="avatar" v-else src="@/assets/img/tx.png" />
                  <div class="name">{{ item1.objectName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="collapseTitle collapseTitle1">
            <span class="text">成员（{{ userList.length }}人）</span>
          </div>
          <div class="userItem" v-for="(item, index) in userList" :key="index">
            <div class="left">
              <div v-if="item.avatar" class="img" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
              <img class="img" v-else src="@/assets/img/tx.png" />
              {{ item.objectName }}
            </div>
            <div @click="showAction(item)">
              <span class="permission">{{ item.permission }}</span>
              <img class="img3" src="@/assets/img/bottomIcon.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" close-on-click-action @select="actionSelect" />
  </div>
</template>
<script>
import {
  permissionList,
  permissionUser,
  permissionEnum,
  permissionUpdate,
} from "@/api/guidanceSpace";
import collapseD from "@/assets/img/collapseD.png";
import collapseR from "@/assets/img/collapseR.png";
import { getGroupId } from "@/utils/auth";

export default {
  name: "powerList",
  data() {
    return {
      actionName: "",
      collapseR,
      collapseD,
      show: false,
      folderItem: {},
      categoryName: "",
      activeNames: ["1"],
      dialogTitle: "添加", // 弹框标题
      actions: [],
      userList: [], // 成员列表
      adminUser: [], // 管理列表
      categoryList: [], // 分组列表
      permissionItem: {}, // 选中的权限
    };
  },
  created() { },
  mounted() {
    this.folderItem = this.$route.params.folderItem;
    this.permissionEnumFun();
    if (getGroupId()) {
      this.permissionListFun(); //组织机构-成员列表
    }
  },
  methods: {
    toggleTitle(expand) {
      console.log(expand, "expand");
    },
    // 展示操作面板
    showAction(item) {
      this.permissionItem = item;
      this.show = true;
    },
    // 查询权限列表
    permissionEnumFun() {
      permissionEnum().then((res) => {
        if (res.responseCode === "100000") {
          this.actions = res.result.map((item) => {
            return {
              id: item.id,
              name: item.permission,
              subname: item.permissionDesc,
            };
          });
        }
      });
    },
    // 操作面板 回调
    actionSelect(action, index) {
      this.permissionConfirm(action.id);
    },
    // 查询分组列表
    permissionListFun() {
      let obj = {
        groupId: getGroupId(),
        folderId: this.folderItem.folderId,
      };
      permissionList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.adminUser = res.result.adminUser;
          this.userList = res.result.userList;
          console.log(res.result.categoryList);
          this.categoryList = res.result.categoryList.map((item) => {
            return {
              ...item,
              userList: [],
              open: false,
            };
          });
        }
      });
    },
    // 查询分组 成员 列表
    categoryUserListFun(folderId, categoryId, index) {
      this.categoryList[index].open = !this.categoryList[index].open;
      if (this.categoryList[index].open) {
        let obj = {
          groupId: getGroupId(),
          folderId: folderId,
          categoryId: categoryId,
        };
        permissionUser(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.categoryList[index].userList = res.result
          }
        });
      }
    },
    // 用户组 添加修改 提交
    permissionConfirm(permissionId) {
      let obj = {
        folderPermissionId: this.permissionItem.folderPermissionId,
        groupId: getGroupId(),
        folderId: this.permissionItem.folderId,
        objectId: this.permissionItem.objectId, // 是否排除群主和管理员
        objectType: this.permissionItem.objectType,
        permissionId: permissionId, // 是否排除群主和管理员
      };
      permissionUpdate(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.$toast.success("权限修改成功");
          this.permissionListFun();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.organization {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.collapseTitle1 {
  margin: 16px 0;
}

.collapseTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .text {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
  }

  .img1 {
    width: 14px;
    height: 10px;
    margin-right: 8px;
  }

  .img2 {
    width: 14px;
  }

  .power {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #1a75ff;
    line-height: 21px;
  }

  .img3 {
    width: 13px;
    margin-left: 8px;
  }
}

.permission {
  height: 14px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 21px;
}

.img3 {
  width: 13px;
  margin-left: 8px;
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
      // background-color: #d0021b;
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
      margin-left: 8px;
    }
  }
}

.categoryList {
  .categoryItem {
    height: 46px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
    margin-top: 8px;

    .name {
      height: 14px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
    }

    .right {
      display: flex;
      align-items: center;
      color: #d0021b;
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
      width: 100%;
      border-right: 1px solid #dedede;
      cursor: pointer;

      img {
        height: 14px;
        margin-right: 8px;
      }

      .label {
        height: 19px;
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

      .img {
        width: 34px;
        height: 34px;
        margin-right: 16px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
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

  .userList1 {
    display: flex;
    flex-wrap: wrap;
  }

  .userItem1 {
    width: 44px;
    // margin: 16px;
    margin-right: 16px;
    margin-bottom: 16px;

    .userbox {
      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 6px;
        border: 1px solid #ffffff;
        background-size: cover;
      }

      .role {
        width: 44px;
        height: 20px;
        background: rgba(26, 117, 255, 0.2);
        border-radius: 10px;
        font-size: 11px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #1a75ff;
        line-height: 20px;
        text-align: center;
      }

      .name {
        height: 12px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        text-align: center;
      }
    }
  }

  .userItem1:nth-child(6n) {
    margin-right: 0;
  }
}

.fileItem {
  min-height: 80px;
  background: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;

  .userInfos {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .portrait {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      margin-right: 16px;
      margin-left: 12px;
    }

    .infocon {
      flex: 1;
      margin-right: 10px;

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
        height: 12px;
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
        width: 12px;
      }
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

.van-collapse-item__content {
  background: #f8f7fa;
  display: flex;
  align-items: center;
}
</style>
