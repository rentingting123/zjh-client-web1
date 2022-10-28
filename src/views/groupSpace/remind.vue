<template>
  <div class="container" v-if="openRemind">
    <van-nav-bar title="会议提醒设置" left-arrow @click-left="onClickLeft" />
    <!-- <CmNavBar title="会议提醒设置" /> -->
    <div class="suggestions">
      <van-form>
        <div class="fieldBom">
          <div class="cell" @click="showDate = true">
            <div class="title">是否需要提醒</div>
            <div class="switch">
              <van-switch v-model="form.isRemind" size="16" />
            </div>
          </div>
          <div v-if="form.isRemind">
            <div class="cell" @click="showRemind = true">
              <div class="title">选择提醒时间</div>
              <div class="value">
                <span style="font-size: 16px;">{{ form.remindTimeDetail }}</span>
                <img src="@/assets/img/rightIcon.png" alt="" />
              </div>
            </div>
            <div class="cell">
              <div class="title">提醒渠道</div>
              <van-checkbox-group v-model="form.remindChannel" direction="horizontal" class="checkbox">
                <van-checkbox :name="1" :value="1" shape="square">钉钉</van-checkbox>
                <van-checkbox :name="2" :value="2" shape="square">短信</van-checkbox>
              </van-checkbox-group>
            </div>
          </div>
        </div>
      </van-form>
      <div class="submit" @click="submit">确定</div>
      <van-action-sheet v-model="showRemind" :actions="timelist" @select="onSelectRemind" />
    </div>
  </div>
</template>
<script>
import { feedbackAdd } from "@/api/find";
export default {
  name: "addMeeting",
  components: {},
  props: ['openRemind'],
  data() {
    return {
      channel: [1],
      isRemind: true,
      remindTimeDetail: '',
      form: {
        isRemind: true, // 是否提醒，0-不提醒，1-提醒
        remindTime: 15,
        remindChannel: [1], //提醒渠道，1-钉钉，2-短信，3-电话
        remindTimeDetail: '开始前15分钟'
      },
      timeType: 1, // 时间展示类型
      showDate: false,
      showTime: false,
      showRemind: false, // 提醒
      showChannel: false, // 渠道
      remindName: "开始前15分钟",
      timelist: [
        {
          id: 0,
          name: "开始时",
        },
        {
          id: 5,
          name: "开始前5分钟",
        },
        {
          id: 15,
          name: "开始前15分钟",
        },
        {
          id: 30,
          name: "开始前30分钟",
        },
        {
          id: 120,
          name: "开始前2小时",
        },
        {
          id: 1440,
          name: "开始前1天",
        },
        {
          id: 2880,
          name: "开始前2天",
        },
      ],
    };
  },
  created() { },
  mounted() { },
  methods: {
    submit() {
      let data = {}
      if (this.form.isRemind == false) {
        data.isRemind = this.form.isRemind
        this.$emit("meetingSet", data)
      } else {
        this.$emit("meetingSet", this.form)
      }
      // query: { participants:[...this.participants1, ...this.participants2] }
      // this.$router.push({ path: "/addMeeting" });
    },
    onClickLeft() {
      this.$emit("cancel", true);
    },
    render(isRemind, remindTime, remindChannel, remindTimeDetail) {
      this.form.isRemind = isRemind;
      this.form.remindTime = remindTime;
      this.form.remindTimeDetail = remindTimeDetail;
      this.form.remindChannel = remindChannel;
    },
    onSelectRemind(e) {
      this.form.remindTime = e.id;
      this.form.remindTimeDetail = e.name;
      this.showRemind = false;
    },
  },
};
</script>
<style>
.van-nav-bar .van-icon {
  width: 9px;
  height: 17px;
  color: rgba(0, 0, 0, 0.9) !important;
}
</style>
<style lang="scss" scoped>
.left-icon {
  font-size: 18px;
}

.van-nav-bar__title {
  font-size: 18px;
}

.van-nav-bar {
  background: #f2f2f2;
}

.container {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}

.checkbox {
  height: 14px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #999999;
  line-height: 21px;
}

.suggestions {
  padding: 10px 12px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 91vh;
  background: #f8f7fa;
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
