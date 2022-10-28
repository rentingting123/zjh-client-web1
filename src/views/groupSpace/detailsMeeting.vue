<template>
  <div class="container">
    <CmNavBar title="组会空间">
      <template slot="right">
        <div class="navRight" v-if="details.isSelf" @click="showAction()">
          更多
        </div>
      </template>
    </CmNavBar>
    <div class="suggestions">
      <div>
        <div class="meetingItem">
          <div class="content">
            <div class="contTop">
              <span class="name">{{ details.conferenceTitle }}</span>
            </div>
            <div class="contMid">
              <div class="create">
                <div class="createInfo">
                  <img class="img1" src="@/assets/img/meetIcon1.png" alt="" />
                  <span class="text"
                    >{{ details.createUsername }} （组织者）</span
                  >
                </div>
                <div class="createInfo">
                  <img class="img2" src="@/assets/img/meetIcon2.png" alt="" />
                  <span class="text"
                    >{{ details.conferenceDate }} {{ details.startTime }}-{{
                      details.endTime
                    }}</span
                  >
                </div>
              </div>
              <div class="timeBtn" v-if="details.timeLeft">
                {{ details.timeLeft }}
              </div>
            </div>
          </div>
        </div>
        <div class="meetingCon">
          <div class="name">会议内容</div>
          <div class="content">
            {{ details.content }}
          </div>
        </div>
        <van-form>
          <div class="fieldBom">
            <div class="cell" @click="goParticipant()">
              <div class="title">参与人</div>
              <div class="value">
                <span class="textGray"
                  >已邀请{{
                    details.participants ? details.participants.length : 0
                  }}人
                </span>
                <img src="@/assets/img/rightIcon.png" alt="" />
              </div>
            </div>
            <div class="cell">
              <div class="title" v-if="details.isRemind">
                <span class=""> {{ remindName }}提醒，</span>
                <span class=""> {{ channelName }}提醒我</span>
              </div>
              <div class="title" v-else>
                <span class=""> 开始前不需要提醒</span>
              </div>
            </div>
            <div class="cell">
              <div class="title">入会口令</div>
              <div class="value">
                <span class="textGray"> {{ details.dingRoomCode }} </span>
                <img
                  class="copy dingRoomCode"
                  src="@/assets/img/copy.png"
                  alt=""
                  :data-clipboard-text="details.dingRoomCode"
                  @click="copyFun"
                />
              </div>
            </div>
            <div class="cell">
              <div class="title">会议记录</div>
              <div class="value">
                <van-uploader
                  class="uploader"
                  accept=".jpg,.gif,.png,.jpeg,.txt,.pdf,.doc,.docx,.xls,.xlsx"
                  :after-read="afterRead"
                >
                  <img src="@/assets/img/meetIcon3.png" alt="" />
                </van-uploader>
              </div>
            </div>
            <div style="padding: 5px 16px">
              <div
                class="filelist"
                v-for="(item, index) in details.conferenceAttrs"
                :key="index"
              >
                <div class="titleGray">{{ item.fileName }}</div>
                <div class="value">
                  <!-- <a :href="item.fileUrl" :download="item.fileName"> -->
                  <img
                    class="meetIcon4"
                    style="margin-right: 10px"
                    src="@/assets/img/meetIcon5.png"
                    alt=""
                    @click="downFile(item.fileUrl,item.fileName)"
                  />
                  <!-- </a> -->
                  <img
                    v-if="details.isSelf"
                    class="meetIcon4"
                    src="@/assets/img/meetIcon4.png"
                    alt=""
                    @click="delectFile(index, item.attrId)"
                  />
                </div>
              </div>
            </div>
          </div>
        </van-form>
      </div>

      <div class="submit" @click="submit">加入会议</div>
      <!-- 会议日期弹框 -->
      <van-calendar
        title="会议日期"
        v-model="showDate"
        @confirm="onConfirm"
        :row-height="30"
        color="#1a75ff"
        :show-mark="false"
      />
      <!-- 会议时间弹框 -->
      <van-dialog
        v-model="showTime"
        title="选择时间"
        show-cancel-button
        confirmButtonColor="#1A75FF"
        @confirm="timeConfirm"
      >
        <van-datetime-picker
          v-model="currentTime"
          type="time"
          :show-toolbar="false"
          :visible-item-count="4"
        />
      </van-dialog>
    </div>
    <van-action-sheet
      v-model="showedit"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="actionSelect"
    />
    <addGroupUser
      ref="addGroupUser"
      :userIds="details.participants"
      :openGroupUser="openGroupUser"
      @cancel="openGroupUser = false"
      :disabled="true"
    />
  </div>
</template>
<script>
import addGroupUser from "./addGroupUser.vue";
import Clipboard from "clipboard";
import * as dd from "dingtalk-jsapi";
import {
  groupConferenceDetail,
  groupConAttrDelete,
  groupConAttrUpload,
  groupConferenceDelete,
} from "@/api/groupSpace";
export default {
  name: "addMeeting",
  components: { addGroupUser },
  data() {
    return {
      showedit: false,
      currentId: 1,
      openGroupUser: false,
      groupId: "",
      conferenceId: "",
      form: {
        groupId: "",
        conferenceTitle: "",
        conferenceDate: "",
        startTime: "开始时间",
        endTime: "结束时间",
        content: "",
        participants: [],
        isRemind: "", // 是否提醒，0-不提醒，1-提醒
        remindTime: 15,
        remindChannel: "", //提醒渠道，1-钉钉，2-短信，3-电话
        conferenceAttrs: [],
      },
      actions: [{ name: "修改" }, { name: "移除", color: "#ee0a24" }],
      currentTime: "", // 当前时间
      timeType: 1, // 时间展示类型
      showDate: false, // 会议日期
      showTime: false, // 会议时间
      remindName: "开始前15分钟",
      channelName: "应用内",
      details: {},
    };
  },
  created() {
    this.groupId = this.$route.query.groupId;
    this.conferenceId = this.$route.query.conferenceId;
  },
  mounted() {
    this.getDetail();
    // this.form.participants = this.$route.query.participants;
    // console.log(this.form.participants);
  },
  methods: {
    // 组会空间添加
    // goAddMeeting() {
    //   // this.$router.push({ path: "/addMeeting",query: { groupId: this.groupId } });
    // },
    showAction() {
      this.showedit = true;
    },
    // 操作面板 回调
    actionSelect(action, index) {
      if (index === 0) {
        this.$router.push({
          path: "/addMeeting",
          query: { groupId: this.groupId, conferenceId: this.conferenceId },
        });
      } else if (index === 1) {
        this.$dialog
          .confirm({
            title: "删除提醒",
            message: "\n确定删除该会议吗\n\n",
            confirmButtonColor: "#1A75FF",
            confirmButtonText: "确定",
          })
          .then(() => {
            let data = {
              conferenceId: this.details.conferenceId,
              groupId: this.groupId,
            };
            groupConferenceDelete(data).then((res) => {
              if ((res.responseCode = "100000")) {
                this.$toast.success("删除成功");
                this.$router.push({
                  path: "/groupSpace",
                  query: { groupId: this.groupId },
                });
              }
            });
            // this.categoryUserDel();
          });
      }
    },
    getDetail() {
      let param = {
        groupId: this.groupId,
        conferenceId: this.conferenceId,
      };
      groupConferenceDetail(param).then((res) => {
        this.details = res.result;
      });
    },
    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
      setTimeout(async () => {
        file.message = "上传成功";
        file.status = "";
        let formatData = new FormData();
        formatData.append("file", file.file);
        formatData.append("groupId", this.groupId);
        formatData.append("conferenceId", this.details.conferenceId);
        let res = await groupConAttrUpload(formatData);
        if (res.responseCode == "100000") {
          let data = {
            fileName: file.file.name,
            attrId: res.result,
          };
          this.details.conferenceAttrs.push(data);
        }
        console.log(res);
      });
    },
    delectFile(index, id) {
      let data = {
        groupId: this.groupId,
        attrId: id,
      };
      groupConAttrDelete(data).then((res) => {
        if (res.responseCode == "100000") {
          this.details.conferenceAttrs.splice(index, 1);
        }
      });
    },
    downFile(url,fileName) {
      dd.biz.util
        .downloadFile({
          url: url,
          name: fileName,
          onProgress: (msg) => {},
          onSuccess: (result) => {},
          onFail: (err) => {
            // 说明不在钉钉环境，或打开失败
            this.jxDownload(url,fileName);
          },
        })
        .catch((err) => {
          this.jxDownload(url,fileName);
        });
    },
    //下载导出jx方法
    jxDownload(url,fileName) {
      const downloadElement = document.createElement('a')
      downloadElement.href = url
      downloadElement.download = fileName;
      downloadElement.target = '_blank'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
    },
    // 复制
    copyFun() {
      var clipboard = new Clipboard(".dingRoomCode"); //绑定数据标签的类名
      clipboard.on("success", (e) => {
        this.$toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        this.$toast.fail("该浏览器或手机权限不支持复制功能");
        // 释放内存
        clipboard.destroy();
      });
    },
    curChange(id) {
      this.currentId = id;
    },
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.showDate = false;
      this.form.conferenceDate = this.formatDate(date);
    },
    //展示会议时间
    showTimeFun(timeType) {
      this.timeType = timeType;
      this.showTime = true;
    },
    //时间选择回调
    timeConfirm() {
      if (this.timeType === 1) {
        this.form.startTime = this.currentTime;
      } else {
        this.form.endTime = this.currentTime;
      }
    },
    goFile() {
      window.location.href = "https://docs.dingtalk.com/i";
    },
    // 去会 添加参与人
    goParticipant() {
      this.openGroupUser = true;
      // this.$router.push({ path: "/addParticipant" });
    },
    // 去 会议设置页面
    goRemind() {
      this.$router.push({ path: "/remind" });
    },
    submit() {
      window.location.href = this.details.dingConferenceLink;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}
.filelist {
  width: 100%;
  height: 24px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  .titleGray {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
    width: 70%;
    height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .value {
    line-height: 24px;
    .copy,
    .meetIcon4 {
      height: 14px;
    }
  }
}
.suggestions {
  padding: 60px 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
.navRight {
  height: 24px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #1a75ff;
  line-height: 24px;
}

.meetingItem {
  .title {
    height: 46px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 46px;
  }
  .content {
    height: 80px;
    background: #ffffff;
    border-radius: 4px;
    padding: 6px 16px;
    box-sizing: border-box;
    .contTop {
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #333333;
        line-height: 21px;
      }
      .status {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
        line-height: 21px;
      }
    }
    .contMid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .create {
        .createInfo {
          // height: 20px;
          line-height: 20px;
          .img1 {
            width: 12px;
            // vertical-align: middle;
            margin-right: 8px;
          }
          .img2 {
            width: 12px;
            // height: 10px;
            margin-right: 8px;
          }
          .text {
            font-size: 14px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: #999999;
            // line-height: 18px;
          }
        }
      }
      .timeBtn {
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 11px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #1a75ff;
        line-height: 20px;
        height: 20px;
        background: rgba(26, 117, 255, 0.2);
        border-radius: 10px;
      }
    }
  }
}
.meetingCon {
  background: #ffffff;
  border-radius: 4px;
  margin: 16px auto;
  padding: 16px;
  .name {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
  }
  .content {
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
}
.fieldBom {
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 16px;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  cursor: pointer;
  .title {
    height: 14px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
  }
  .titleGray {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
  }
  .value {
    .text {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
    }
    .textGray {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
    }
    .textBlue {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #1a75ff;
      line-height: 21px;
    }
    img {
      height: 10px;
      margin-left: 12px;
    }
    .copy,
    .meetIcon4 {
      height: 12px;
    }
  }
  .uploader {
    padding-left: 30px;
    img {
      height: 12px;
    }
  }
  .timebox {
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    display: flex;
    align-items: center;
    .time {
      padding: 0 6px;
      height: 18px;
      background: #f8f7fa;
      cursor: pointer;
    }
    .line {
      margin: 0 5px;
    }
  }
}
.textarea {
  margin-bottom: 46px;
}
.submit {
  width: 352px;
  height: 40px;
  background: #1a75ff;
  border-radius: 4px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  line-height: 40px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
