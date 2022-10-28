<template>
  <van-nav-bar :border="border" fixed :z-index="zIndex">
    <template v-slot:left>
      <slot name="left">
        <van-icon class="left-icon" name="arrow-left" @click="goBack" />
      </slot>
    </template>
    <template v-slot:title>
      <slot name="title" class="title">{{  title  }}</slot>
    </template>
    <template v-slot:right>
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    border: {
      type: Boolean,
      default: true,
    },
    pathName: {
      type: String,
      default: "",
    },
    zIndex: {
      type: Number,
      default: 999,
    },
  },
  methods: {
    goBack() {
      if (this.pathName) {
        this.$router.push({ name: this.pathName });
      } else {
        this.$router.back(-1);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.left-icon {
  font-size: 18px;
}

.van-nav-bar__title {
  font-size: 18px;
}

.van-nav-bar {
  background: #fff;
  max-width: 375px;
  margin: 0 auto;
  left:calc(50% - 188px)
}

.van-nav-bar .van-icon {
  width: 9px;
  height: 17px;
  color: rgba(0, 0, 0, 0.9);
}
</style>
