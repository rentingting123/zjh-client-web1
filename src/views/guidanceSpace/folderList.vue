<template>
  <div class="floder">
    <div class="folderList">
      <template v-if="folderListData.length > 0">
        <div class="fileItem" v-for="(item, index) in folderListData" :key="index">
          <div class="userInfos">
            <img src="@/assets/img/word.png" class="portrait" />
            <div class="infocon" @click="goFileList(item.folderId,item.folderName)">
              <div class="name">{{ item.folderName }}</div>
              <div class="school">
                {{ item.updateFileName }}
                <span v-if="item.updateUsername">|</span>
                {{ item.updateUsername }}
              </div>
              <div class="info">{{ item.gmtModified }} 更新</div>
            </div>
            <div class="identity" @click="showActionFolder(item)">
              <img src="@/assets/img/menu.png" />
            </div>
          </div>
        </div>
      </template>
      <img v-else class="empty" src="@/assets/img/empty.png" />
      <div @click="addFile" class="addButton">
        <img src="@/assets/img/add.png" alt="" />
      </div>
    </div>

    <!--弹框 文件夹  -->
    <van-dialog v-model="showDialogFile" :title="`${dialogTitle}文件夹`" show-cancel-button confirmButtonColor="#1A75FF"
      :before-close="onBeforeClose" @confirm="foldeConfirm">
      <van-field v-model="folderName" placeholder="填写新文件夹名称" class="groupIpt" />
    </van-dialog>
    <!-- 文件夹操作 -->
    <van-action-sheet title="" v-model="folderMore" :actions="actionFolder" close-on-click-action
      @select="folderSelect" />
  </div>
</template>
<script>
import {
  folderList,
  folderAdd,
  folderUpdate,
  folderDelete,
} from "@/api/guidanceSpace";
import { getGroupId } from "@/utils/auth";
export default {
  name: "Homepc",
  components: {},
  data() {
    return {
      showDialogFile: false,
      folderMore: false,
      dialogTitle: "新建",
      folderName: "", // 文件夹名称
      pId: "", //文件的父级id
      folderId: "", // yonghuid
      folderListData: [],
      folderItem: {},
      actionFolder: [
        { name: "分享" },
        { name: "权限管理" },
        { name: "重命名" },
        { name: "删除", color: "#ee0a24" },
      ],
    };
  },
  created() {
  },
  mounted() {
    if(getGroupId()){
      this.folderListFun(); // 团队文件
    }
  },
  methods: {
    // 团队文件
    folderListFun() {
      let obj = {
        groupId: getGroupId(),
      };
      folderList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.folderListData = res.result.folderList;
        }
      });
    },
    //文件夹 添加
    addFile() {
      this.showDialogFile = true;
      this.dialogTitle = "新建";
    },
    // 表单重置
    formReset() {
      this.folderId = "";
      this.folderName = "";
    },
    onBeforeClose(action, done) {
      this.formReset();
      if (action === "confirm") {
        return done(false);
      } else {
        return done();
      }
    },
    // 文件夹 添加修改 提交
    foldeConfirm() {
      if (this.folderId) {
        // 修改
        if (this.folderName) {
          let obj = {
            folderId: this.folderId,
            groupId: getGroupId(),
            folderName: this.folderName,
          };
          folderUpdate(obj).then((res) => {
            if (res.responseCode === "100000") {
              this.showDialogFile = false;
              this.$toast.success("修改成功");
              this.formReset();
              this.folderListFun(); // 团队文件
            } else {
              this.$toast.fail(res.message);
            }
          });
        } else {
          this.$toast.fail("请填写文件夹名称");
          return false;
        }
      } else {
        // 添加
        if (this.folderName) {
          let obj = {
            pId: this.pId,
            groupId: getGroupId(),
            folderName: this.folderName,
          };
          folderAdd(obj).then((res) => {
            if (res.responseCode === "100000") {
              this.showDialogFile = false;
              this.$toast.success("提交成功");
              this.formReset();
              this.folderListFun(); // 团队文件
            }
          });
        } else {
          this.$toast.fail("请填写文件夹名称");
          return false;
        }
      }
    },
    // 展示操作面板
    showActionFolder(item) {
      this.folderId = item.folderId;
      this.folderName = item.folderName;
      this.folderItem = item;
      this.folderMore = true;
    },
    // 操作面板  回调 文件夹
    folderSelect(action, index) {
      if (index === 0) {
        // 分享
      } else if (index === 1) {
        // 权限管理
        let params = { groupId: getGroupId(), folderItem: this.folderItem };
        console.log(params);
        this.$router.push({
          name: "powerList",
          params,
        });
      } else if (index === 2) {
        //2 重命名
        this.showDialogFile = true;
        this.dialogTitle = "重命名";
      } else if (index === 3) {
        // 删除
        let obj = {
          groupId: getGroupId(),
          folderId: this.folderId,
        };
        folderDelete(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("删除成功");
            this.folderListFun();
          }
        });
      } else {
        this.folderMore = false;
      }
    },
    // 去资源分享
    goFileList(folderId,folderName) {
      this.$router.push({
        path: "/fileList",
        query: { folderId, groupId: getGroupId(), folderName},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.folderList {
  position: relative;
  padding-bottom: 180px;

  .fileItem {
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
        height: 60px;
        border-radius: 6px;
        margin-right: 16px;
        margin-left: 12px;
      }

      .infocon {
        flex: 1;
        min-height: 80px;

        .name {
          font-size: 16px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          margin-top: 10px;
        }

        .school {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #333333;
          margin: 3px 0;
          line-height: 18px;
          min-height: 18px;
        }

        .info {
          font-size: 14px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
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
}

.addButton {
  position: fixed;
  right: 12px;
  top: 80vh;
  width: 50px;
  height: 50px;
  background: #1a75ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
  }
}

.empty {
  display: block;
  width: 204px;
  margin: 50px auto;
}
</style>
<style>
.van-dialog {
  /* height: 208px; */
  border-radius: 8px;
}
.groupIpt{
  margin: 10px 0px;
}
</style>
