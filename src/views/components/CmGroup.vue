<template>
  <div class="name">
    <van-dropdown-menu
      v-if="groupListData.length > 0"
      active-color="#1a75ff"
      :overlay="false"
      class="dropdown"
    >
      <van-dropdown-item
        v-model="groupId"
        :options="groupListData"
        @change="menuChange"
      />
    </van-dropdown-menu>
    <van-skeleton v-else :row="3" />
    <img class="" src="@/assets/img/sortIcon.png" />
  </div>
</template>
<script>
import { setGroupId, getGroupId, setRole, getRole } from "@/utils/auth";
import { groupList } from "@/api/organization";
export default {
  data() {
    return {
      groupId: "",
      role:'',
      groupListData: [],
      groupList:[]
    };
  },
  created() {
    this.groupListFun(); // 群列表
  },
  mounted() {},
  methods: {
    // 群列表
    groupListFun() {
      groupList().then((res) => {
        if (res.responseCode === "100000") {
          if (getGroupId()) {
            this.groupId = Number(getGroupId());
            this.role =Number(getRole());
          } else {
            this.groupId = res.result[0].groupId;
            this.role = res.result[0].role
            setGroupId(this.groupId);
            setRole(this.role)
            this.$parent.changeGroupId();
          }
          this.groupList=res.result
          this.groupListData = res.result.map((item) => {
            return {
              text: item.groupTitle,
              value: item.groupId,
            };
          });
        }
      });
    },
    menuChange(val) {
      this.groupId = val;
      setGroupId(this.groupId);
      let item=this.groupList.find( item => item.groupId ==  val)
      setRole(item.role)
      this.$parent.changeGroupId();
    },
  },
};
</script>
<style scoped lang="scss">
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
.dropdown {
  position: relative;
}
</style>
<style>
.dropdown .van-popup--top,
.van-dropdown-item {
  width: 356px;
  z-index: 999999999999;
  left: 6px;
  overflow:inherit;
}
.van-dropdown-menu__bar {
  box-shadow: none;
}
.van-dropdown-menu__title{
  font-size: 18px;
  padding-left: 0;
}
.van-dropdown-menu__title::after,
.van-dropdown-menu__title--down::after {
  display: none;
}
.van-popup--top{
box-shadow: 5px 0px 30px 5px rgba(0, 0, 0, 0.1);
}
</style>
