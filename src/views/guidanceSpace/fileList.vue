<template>
  <div class="container">
    <CmNavBar :title="folderName"> </CmNavBar>
    <div class="sharing">
      <div class="fileList">
        <template v-if="fileList.length > 0">
          <div class="fileItem" v-for="(item, index) in fileList" :key="index">
            <div class="userInfos">
              <img v-if="item.fileType == 'xls' || item.fileType == 'xlsx'" :src="exeIcon" class="portrait" />
              <img v-else-if="item.fileType == 'doc' || item.fileType == 'docx'" :src="docIcon" class="portrait" />
              <img v-else-if="item.fileType == 'pdf'" :src="pdfIcon" class="portrait" />
              <img v-else :src="otherIcon" class="portrait" />
              <div class="infocon">
                <div class="name">{{ item.fileName }}</div>
                <div class="school">{{ item.createUsername }}</div>
                <div class="info">{{ item.gmtCreate }}</div>
              </div>
              <div class="identity" @click="showAction(item.fileId, item.fileName)">
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
      <van-dialog v-model="showDialogFile" title="重命名文件" show-cancel-button confirmButtonColor="#1A75FF"
        :before-close="onBeforeClose" @confirm="foldeConfirm">
        <van-field v-model="filePrefix" placeholder="填写新文件夹名称" class="groupIpt" />
      </van-dialog>
      <!-- 弹框 上传文件 -->
      <van-dialog v-model="showFile" title="选择" show-cancel-button :show-confirm-button="false"
        confirmButtonColor="#1A75FF" :before-close="onBeforeClose">
        <van-uploader accept=".jpg,.gif,.png,.jpeg,.txt,.pdf,.doc,.docx,.xls,.xlsx" :after-read="afterRead">
          <div class="selectFile">
            <div class="selectFileBth">选取文件</div>
          </div>
        </van-uploader>
      </van-dialog>
      <van-action-sheet v-model="showMore" :actions="actionsMore" close-on-click-action @select="actionMore" />
    </div>
  </div>
</template>
<script>
import {
  folderList,
  fileUpload,
  fileDelete,
  download,
  fileRename
} from "@/api/guidanceSpace";
import docIcon from "@/assets/img/docIcon.png";
import exeIcon from "@/assets/img/exeIcon.png";
import pdfIcon from "@/assets/img/pdfIcon.png";
import otherIcon from "@/assets/img/otherIcon.png";
import { getGroupId } from "@/utils/auth";
import * as dd from "dingtalk-jsapi";

export default {
  name: "fileList",
  components: {},
  data() {
    return {
      docIcon,
      exeIcon,
      pdfIcon,
      otherIcon,
      folderId: "",
      folderName: "",
      file: [],
      showDialogFile: false,
      showFile: false,
      showMore: false,
      filePrefix: '',//  文件名
      fileSuffix: '',//  文件后缀
      fileList: [],
      fileId: "",
      fileName:'',
      actionsMore: [
        { name: "下载" },
        // { name: "分享" },
        // { name: "权限管理" },
        { name: "重命名" },
        { name: "删除", color: "#ee0a24" },
      ],
    };
  },
  created() { },
  mounted() {
    this.folderId = this.$route.query.folderId;
    this.folderName = this.$route.query.folderName;
    this.folderListFun(); // 团队文件
  },
  methods: {
    //文件夹 添加
    addFile() {
      this.showFile = true;
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      setTimeout(async () => {
        file.message = "上传成功";
        file.status = "";
        let formatData = new FormData();
        formatData.append("file", file.file);
        formatData.append("groupId", getGroupId());
        formatData.append("folderId", this.folderId);
        let res = await fileUpload(formatData);
        if (res.responseCode == "100000") {
          this.showFile = false;
          this.folderListFun();
        }
        console.log(res);
      });
    },
    // 团队文件
    folderListFun() {
      let obj = {
        groupId: getGroupId(),
        folderId: this.folderId,
      };
      folderList(obj).then((res) => {
        if (res.responseCode === "100000") {
          this.fileList = res.result.fileList;
        }
      });
    },
    onBeforeClose(action, done) {
      if (action === "confirm") {
        return done(false);
      } else {
        return done();
      }
    },
    // 展示操作面板
    showAction(fileId, fileName) {
      this.filePrefix = fileName.substring(0, fileName.lastIndexOf("."))
      this.fileSuffix = fileName.substring(fileName.lastIndexOf("."))
      this.showMore = true;
      this.fileId = fileId;
      this.fileName = fileName;
    },
    // 操作面板 回调
    actionMore(action, index) {
      if (index === 0) {
        // 下载
        let obj = {
          fileId: this.fileId,
        };
        download(obj).then((res) => {
          if (res.responseCode === "100000") {
            // this.jxDownload(res.result)
            dd.biz.util.downloadFile({
              url:res.result,
              name: this.fileName, 
              onProgress: (msg) => {
     
              },
              onSuccess: (result) => {

              },
              onFail: (err) => {
                // 说明不在钉钉环境，或打开失败
                 this.jxDownload(res.result)
              }
            }).catch(err => {
              this.jxDownload(res.result)
                  // 说明不在钉钉环境，或打开失败   
                    // 这里为了适配传统的下载方式，当调用失败后在这里调用getReportDownloadExcel
            })
          }
        });
      } else if (index === 1) {
        // 重命名
        this.showDialogFile = true;
      } else if (index === 2) {
        // 删除
        let obj = {
          groupId: getGroupId(),
          fileId: this.fileId,
        };
        fileDelete(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.$toast.success("删除成功");
            this.folderListFun();
          }
        });
      } else {
        this.folderMore = false;
      }
    },
    // 文件名 修改
    foldeConfirm() {
      if (this.filePrefix) {
        let obj = {
          fileId: this.fileId,
          fileName: this.filePrefix + this.fileSuffix,
        };
        fileRename(obj).then((res) => {
          if (res.responseCode === "100000") {
            this.showDialogFile = false;
            this.$toast.success("重命名成功");
            this.folderListFun(); // 团队文件
          } else {
            this.$toast.fail(res.message);
          }
        });
      } else {
        this.$toast.fail("请填写文件名称");
        return false;
      }
    },
    //下载导出jx方法
    jxDownload(url) {
      const downloadElement = document.createElement('a')
      downloadElement.href = url
      downloadElement.download = this.fileName;
      // downloadElement.target = '_blank'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
    },
  },
};
</script>
<style lang="scss" scoped>
.van-cell {
  padding: 0;
}

.sharing {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.fileList {
  position: relative;

  .fileItem {
    min-height: 80px;
    background: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;

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

        // height: 80px;
        .name {
          // height: 14px;
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

.groupIpt {
  width: 272px;
  margin: 32px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.btnBox {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px auto 27px;

  .cancelBtn {
    width: 107px;
    height: 36px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    font-size: 17px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1a75ff;
    line-height: 24px;
    letter-spacing: 1px;
    text-align: center;
    line-height: 36px;
  }

  .completeBtn {
    width: 107px;
    height: 36px;
    background: #1a75ff;
    border-radius: 4px;
    font-size: 17px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 24px;
    letter-spacing: 1px;
    text-align: center;
    line-height: 36px;
    margin-left: 15px;
  }
}

.selectFile {
  width: 320px;
}

.selectFileBth {
  width: 240px;
  height: 40px;
  background: #1a75ff;
  border-radius: 4px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  line-height: 21px;
  margin: 54px auto;
  text-align: center;
  line-height: 40px;
}

.empty {
  display: block;
  width: 204px;
  margin: 100px auto;
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

.power .van-action-sheet__item {
  text-align: left;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 6px 24px;
}

.power .van-action-sheet__subname {
  margin-top: 0;
}

.van-dialog {
  /* height: 208px; */
  border-radius: 8px;
}
</style>
