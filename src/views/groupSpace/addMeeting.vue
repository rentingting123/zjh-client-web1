<template>
  <div class="container">
    <CmNavBar title="发起会议" />
    <div class="suggestions" v-if="openRemind == false">
      <van-form>
        <van-field
          v-model="form.conferenceTitle"
          placeholder="请输入会议主题"
          type="textarea"
          maxlength="32"
          autosize
          rows="2"
          class="fieldBom"
        />
        <div class="fieldBom">
          <div class="cell" @click="showDate = true">
            <div class="title">会议日期</div>
            <div class="value">
              <span class="text"> {{ form.conferenceDate }} </span>
              <img src="@/assets/img/rightIcon.png" alt="" />
            </div>
          </div>
          <div class="cell">
            <div class="title">会议时间</div>
            <div class="timebox">
              <div class="time"  @click="showTimeFun(1)">
                {{ form.startTime }}
              </div>
              <span class="line">—</span>
              <div class="time" @click="showTimeFun(2)">
                {{ form.endTime }}
              </div>
            </div>
          </div>
          <div class="cell" @click="goParticipant()">
            <div class="title">参与人</div>
            <div class="value">
              <span class="text"
                >{{ form.participants ? form.participants.length : 0 }}人
              </span>
              <img src="@/assets/img/rightIcon.png" alt="" />
            </div>
          </div>
          <div class="cell">
            <div class="title">会议文件</div>
            <div class="value">
              <van-uploader
                class="uploader"
                accept=".jpg,.gif,.png,.jpeg,.txt,.pdf,.doc,.docx,.xls,.xlsx"
                :after-read="afterRead"
              >
                <!-- <span class="text"> {{ form.conferenceAttrs }} </span> -->
                <img src="@/assets/img/meetIcon3.png" alt="" />
              </van-uploader>
            </div>
          </div>
          <div style="padding: 5px 16px">
            <div
              class="filelist"
              v-for="(item, index) in filelist"
              :key="index"
            >
              <div class="titleGray">{{ item.fileName }}</div>
              <div class="value">
                <img
                  class="meetIcon4"
                  src="@/assets/img/meetIcon4.png"
                  alt=""
                  @click="delectfile(index, item.attrId)"
                />
              </div>
            </div>
          </div>
          <div class="cell" @click="goRemind()">
            <div class="title" v-if="this.form.isRemind">
              <span class=""> {{ form.remindTimeDetail }}提醒，</span>
              <span
                class=""
                v-for="(item, index) in form.remindChannel"
                :key="index"
                >{{ index == 0 ? "" : "、"
                }}{{ item == 1 ? "钉钉" : "短信" }}</span
              ><span>提醒我</span>
            </div>
            <div class="title" v-else>
              <span class=""> 不需要提醒</span>
            </div>
            <div class="value">
              <img src="@/assets/img/rightIcon.png" alt="" />
            </div>
          </div>
        </div>
        <van-field
          v-model="form.content"
          placeholder="请输入会议内容"
          type="textarea"
          autosize
          maxlength="200"
          rows="6"
          show-word-limit
          class="textarea"
        />
      </van-form>

      <div class="submit" @click="submit">确定</div>
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
          swipe-duration="500"
        />
      </van-dialog>
    </div>
    <remind
      ref="remind"
      :openRemind="openRemind"
      @meetingSet="meetingSet"
      @cancel="openRemind = false"
    />
    <addGroupUser
      ref="addGroupUser"
      :userIds="form.participants"
      :openGroupUser="openGroupUser"
      @cancel="openGroupUser = false"
      :disabled="false"
    />
  </div>
</template>
<script>
import {
  meetingAdd,
  groupConAttrUpload,
  groupConAttrDelete,
  groupConferenceDetail,
  groupConferenceUpdate,
} from "@/api/groupSpace";
import remind from "./remind.vue";
import addGroupUser from "./addGroupUser.vue";
export default {
  name: "addMeeting",
  components: { remind, addGroupUser },
  data() {
    return {
      openRemind: false,
      openGroupUser: false,
      conferenceId: "",
      filelist: [],
      currentId: 1,
      form: {
        groupId: "",
        conferenceTitle: "",
        conferenceDate: "",
        startTime: "开始时间",
        endTime: "结束时间",
        content: "",
        participants: [],
        isRemind: true, // 是否提醒，0-不提醒，1-提醒
        remindTime: 15,
        remindTimeDetail: "开始前15分钟",
        remindChannel: [1], //提醒渠道，1-钉钉，2-短信，3-电话
        conferenceAttrs: [],
      },
      currentTime: "", // 当前时间
      timeType: 1, // 时间展示类型
      showDate: false, // 会议日期
      showTime: false, // 会议时间
      remindName: "",
      channelName: "",
    };
  },
  created() {
    this.form.groupId = this.$route.query.groupId;
    if (this.$route.query.conferenceId) {
      this.conferenceId = this.$route.query.conferenceId;
    }
  },
  mounted() {
    if (this.conferenceId) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      let param = {
        groupId: this.form.groupId,
        conferenceId: this.conferenceId,
      };
      groupConferenceDetail(param).then((res) => {
        // this.details = res.result;
        this.form.conferenceTitle = res.result.conferenceTitle;
        this.filelist = res.result.conferenceAttrs;
        this.form.conferenceDate = res.result.conferenceDate;
        this.form.startTime = res.result.startTime;
        this.form.endTime = res.result.endTime;
        this.form.content = res.result.content;
        this.form.conferenceId = res.result.conferenceId;
        this.form.isRemind = res.result.isRemind;
        this.form.remindTime = res.result.remindTime;
        this.form.remindTimeDetail = res.result.remindTimeDetail;
        this.form.remindChannel = res.result.remindChannel;
        this.form.dingEventId = res.result.dingEventId;
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
        formatData.append("groupId", this.form.groupId);
        if (this.form.conferenceId) {
          formatData.append("conferenceId", this.form.conferenceId);
        }
        let res = await groupConAttrUpload(formatData);
        if (res.responseCode == "100000") {
          let data = {
            fileName: file.file.name,
            attrId: res.result,
          };
          this.filelist.push(data);
          if (this.form.conferenceId) {
          } else {
            this.form.conferenceAttrs.push(res.result);
          }
        }
      });
    },
    delectfile(index, id) {
      let data = {
        groupId: this.form.groupId,
        attrId: id,
      };
      groupConAttrDelete(data).then((res) => {
        if (res.responseCode == "100000") {
          this.filelist.splice(index, 1);
          this.form.conferenceAttrs.splice(
            this.form.conferenceAttrs.indexOf(id),
            1
          );
        }
      });
    },
    curChange(id) {
      this.currentId = id;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
    },
    onConfirm(date) {
      this.showDate = false;
      this.form.conferenceDate = this.formatDate(date);
    },
    // 会议提醒时间
    meetingSet(e) {
      this.openRemind = false;
      if (e.isRemind == false) {
        this.form.isRemind = e.isRemind;
      } else {
        this.form.isRemind = e.isRemind;
        this.form.remindTime = e.remindTime;
        this.form.remindChannel = e.remindChannel;
        this.form.remindTimeDetail = e.remindTimeDetail;
      }
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
      // this.$router.push({ path: "/addParticipant" });
      this.openGroupUser = true;
    },
    // 去 会议设置页面
    goRemind() {
      this.openRemind = true;
      this.$refs.remind.render(
        this.form.isRemind,
        this.form.remindTime,
        this.form.remindChannel,
        this.form.remindTimeDetail
      );
      // this.$router.push({ path: "/remind" });
    },
    submit() {
      if (this.form.content == "") {
        this.$toast.fail("请输入会议内容");
      } else {
        if (this.form.conferenceId) {
          groupConferenceUpdate(this.form).then((res) => {
            if (res.responseCode === "100000") {
              this.$toast.success("修改成功");
              this.$router.push({
                path: "/groupSpace",
                query: { groupId: this.form.groupId },
              });
            }
          });
        } else {
          meetingAdd(this.form).then((res) => {
            if (res.responseCode === "100000") {
              this.$toast.success("提交成功");
              this.$router.push({
                path: "/groupSpace",
                query: { groupId: this.form.groupId },
              });
            }
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
}
.suggestions {
  padding: 60px 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

.fieldBom {
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 16px;
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
.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 40px;
  cursor: pointer;
  .title {
    height: 14px;
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
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
