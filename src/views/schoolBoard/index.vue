<template>
  <div class="container">
    <CmNavBar title="校级看板" />
    <div class="details">
      <div class="numList">
        <div class="numitem">
          <div class="num">{{ bulletinNum.groupNum || 0 }}</div>
          <div class="name">导学团队数</div>
        </div>
        <div class="numitem">
          <div class="num">{{ bulletinNum.teacherNum || 0 }}</div>
          <div class="name">导师用户数</div>
        </div>
        <div class="numitem">
          <div class="num">{{ bulletinNum.studentNum || 0 }}</div>
          <div class="name">学生用户数</div>
        </div>
      </div>
      <div class="numList">
        <div class="numitem1">
          <div class="num">{{ bulletinNum.conferenceFreq || 0 }}</div>
          <div class="name">团队组会数</div>
        </div>
        <div class="numitem1">
          <div class="num">{{ bulletinNum.fileNum || 0 }}</div>
          <div class="name">团队文件资源</div>
        </div>
      </div>
      <div class="userSpread">
        <div class="title">用户分布</div>
        <div id="main" class="chartsbox"></div>
      </div>
      <div class="userSpread">
        <div class="title">组会频率（按月）</div>
        <div ref="chartFrequency1" class="chartsbox1">
          <img src="@/assets/img/empty.png" alt class="emptyimg" />
        </div>
      </div>
      <div class="userSpread">
        <div class="top">
          <div class="title">学院组会频率（按月）</div>
          <div class="schoolSelect">
            <van-dropdown-menu active-color="#1A75FF" class="dropMenu" :overlay="false">
              <van-dropdown-item
                v-model="departmentM"
                :options="departOption"
                @change="changeSchoolM"
              />
            </van-dropdown-menu>
          </div>
        </div>
        <div v-show="showCharts" ref="chartFrequency2" class="chartsbox1"></div>
        <div v-show="!showCharts" class="chartsbox1">
          <img src="@/assets/img/empty.png" alt class="emptyimg" />
        </div>
      </div>
      <div class="userSpread">
        <div class="title">组会频率TOP5团队</div>
        <table class="tableBox" cellspacing="0">
          <thead>
            <tr class="tableHead">
              <th
                v-for="(item, index) in courseTableOption"
                :key="index"
                class="headItem"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody v-if="meetingfrequency.length > 0" align="center">
            <tr class="bodyList" v-for="(item, index) in meetingfrequency" :key="index">
              <td class="bodyItem" align="left">
                {{ item.groupTitle }}
              </td>
              <td class="bodyItem" width="60">{{ item.conNum }}</td>
              <td class="bodyItem" width="80">{{ item.conFreq }}次/月</td>
              <td class="bodyItem" width="110">{{ item.latestCon | dtime }}</td>
            </tr>
          </tbody>
          <tr v-else align="center">
            <td colspan="4" class="empty">暂无数据</td>
          </tr>
        </table>
      </div>
      <div class="userSpread">
        <div class="top">
          <div class="title">学院组会频率TOP5团队</div>
          <div class="schoolSelect">
            <van-dropdown-menu active-color="#1A75FF" class="dropMenu" :overlay="false">
              <van-dropdown-item
                v-model="department"
                :options="departOption"
                @change="changeSchool"
              />
            </van-dropdown-menu>
          </div>
        </div>
        <table class="tableBox tableBoxB" cellspacing="0">
          <thead>
            <tr class="tableHead">
              <th
                v-for="(item, index) in courseTableOption"
                :key="index"
                class="headItem"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody v-if="collegeMeetingfrequency.length > 0" align="center">
            <tr
              class="bodyList"
              v-for="(item, index) in collegeMeetingfrequency"
              :key="index"
            >
              <td class="bodyItem" align="left">
                {{ item.groupTitle }}
              </td>
              <td class="bodyItem" width="60">{{ item.conNum }}</td>
              <td class="bodyItem" width="80">{{ item.conFreq }}次/月</td>
              <td class="bodyItem" width="110">{{ item.latestCon | dtime }}</td>
            </tr>
          </tbody>
          <tr v-else align="center">
            <td colspan="4" class="empty">暂无数据</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  apibulletinNum,
  apibulletinUserNum,
  apidepartmentList,
  apibulletinConFreq,
  apibulletinConDeptFreq,
  apibulletinGroupConFreq,
} from "@/api/guideBoard";
import { LogLevel } from "dingtalk-jsapi/lib/sdk";
import * as echarts from "echarts";
import moment from "moment";
export default {
  name: "Homepc",
  filters: {
    dtime(val) {
      if (val) {
        return moment(val).format("YYYY-MM-DD");
      } else {
        return "-";
      }
    },
  },
  data() {
    return {
      bulletinNum: {},
      doctorNum: [],
      teacherNum: [],
      masterNum: [],
      meetingfrequency: [],
      department: "",
      departmentM: "",
      departOption: [],
      collegeMeetingfrequency: [],
      // 课程学习表格的表头标题
      courseTableOption: ["导学群", "组会数", "组会频率", "最近组会时间"],
      chart1: null,
      chart2: null,
      showCharts: true,
    };
  },
  created() {
    this.getbulletinNum();
    this.getUserNum();
    this.getGroupConFreq();
    this.getdepart();
    this.getApibulletinConFreq(); // 组会频率（按月）
  },
  mounted() {},
  methods: {
    getdepart() {
      apidepartmentList().then((res) => {
        this.departOption = res.result.map((item) => {
          return { text: item.departmentName, value: item.departmentName };
        });
        this.department = this.departOption[0].value;
        this.departmentM = this.departOption[0].value;
        this.getSchoolGroupConFreq(this.department);
        this.getAapibulletinConDeptFreq(this.departmentM); // 学院组会频率（按月）
      });
    },
    changeSchool(e) {
      this.getSchoolGroupConFreq(e);
    },
    changeSchoolM(e) {
      this.getAapibulletinConDeptFreq(e);
    },
    getbulletinNum() {
      apibulletinNum().then((res) => {
        this.bulletinNum = res.result;
      });
    },
    getUserNum() {
      apibulletinUserNum().then((res) => {
        this.teacherNum.push(res.result.teacherNum);
        this.doctorNum.push(res.result.doctorNum);
        this.masterNum.push(res.result.masterNum);
        this.drawChart();
      });
    },
    getGroupConFreq() {
      apibulletinGroupConFreq().then((res) => {
        this.meetingfrequency = res.result;
      });
    },
    getSchoolGroupConFreq(department) {
      let param = {
        department: department || "",
      };
      apibulletinGroupConFreq(param).then((res) => {
        this.collegeMeetingfrequency = res.result;
      });
    },
    drawChart() {
      // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
      let myChart = echarts.init(document.getElementById("main"));
      const color = ["#1990FF", "#FF6919", "#A319FF"];
      // 指定图表的配置项和数据
      let option = {
        color,
        tooltip: {
          trigger: "item",
        },
        legend: {
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          borderRadius: 5,
          data: ["导师", "博士生", "硕士生"],
          textStyle: {
            color: "#8C8C8C",
          },
          itemGap: 16,
          orient: "vertical",
          right: "20",
          top: "center",
        },
        series: [
          {
            type: "pie",
            radius: "80%",
            left: "-20%",
            label: {
              position: "inside",
              fontSize: "14",
              formatter: "{c}",
            },
            data: [
              { value: this.teacherNum, name: "导师" },
              { value: this.doctorNum, name: "博士生" },
              { value: this.masterNum, name: "硕士生" },
            ],

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    // 组会频率（按月）
    getApibulletinConFreq() {
      apibulletinConFreq().then((res) => {
        if (res.result.length > 0) {
          let xAxis = res.result.map((item) => item.month) || [];
          let yAxis = res.result.map((item) => item.conFreq) || [];
          this.initChart1(xAxis, yAxis);
        }
      });
    },
    // 学院组会频率（按月）
    getAapibulletinConDeptFreq() {
      let param = {
        department: this.departmentM || "",
      };
      apibulletinConDeptFreq(param).then((res) => {
        console.log(res.result, 9999);
        if (res.result.length > 0) {
          this.showCharts = true;
          let xAxis = res.result.map((item) => item.month);
          let yAxis = res.result.map((item) => item.conFreq);
          this.initChart2(xAxis, yAxis);
        } else {
          this.showCharts = false;
        }
      });
    },
    initChart1(xAxis, yAxis) {
      this.chart1 = echarts.init(this.$refs.chartFrequency1);
      let color1 = "#5B8FF9";
      let color2 = "rgba(0, 86, 255, 0.1)";
      let option = {
        grid: {
          left: "10%",
          top: "5%",
          bottom: "15%", //也可设置left和right设置距离来控制图表的大小
          right: "10%",
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "rgba(0, 0, 0, 0.45)",
              show: true,
              interval: 0,
              textStyle: {
                fontSize: 12,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: ["#E7E7E7"],
              },
            },
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#979797",
              },
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 30, //度标签的显示间隔 前一个标签和下一个标签的间隔
              showMaxLabel: true, //是否显示最大的
              showMinLabel: true, //是否显示最大的
              color: "#333333",
              align: "center",
            },
            data: xAxis,
          },
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#1990FF",
                  width: 1,
                },
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: color1,
                      },
                      {
                        offset: 1,
                        color: color2, // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
            data: yAxis,
          },
        ],
      };
      this.chart1.setOption(option);
    },
    // 图表绘制
    initChart2(xAxis, yAxis) {
      this.chart2 = echarts.init(this.$refs.chartFrequency2);
      let color1 = "#5B8FF9";
      let color2 = "rgba(0, 86, 255, 0.1)";
      let option = {
        grid: {
          left: "10%",
          top: "5%",
          bottom: "15%", //也可设置left和right设置距离来控制图表的大小
          right: "10%",
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "rgba(0, 0, 0, 0.45)",
              show: true,
              interval: 0,
              textStyle: {
                fontSize: 12,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: ["#E7E7E7"],
              },
            },
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#979797",
              },
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 30, //度标签的显示间隔 前一个标签和下一个标签的间隔
              showMaxLabel: true, //是否显示最大的
              showMinLabel: true, //是否显示最大的
              color: "#333333",
              align: "center",
            },
            data: xAxis,
          },
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#1990FF",
                  width: 1,
                },
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: color1,
                      },
                      {
                        offset: 1,
                        color: color2, // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
            data: yAxis,
          },
        ],
      };
      this.chart2.setOption(option);
    },
  },
};
</script>
<style lang="scss">
.dropMenu {
  width: 146px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.15);

  .van-dropdown-menu__bar {
    box-shadow: none;
    height: 32px;
  }

  .van-ellipsis {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 32px;
  }

  .van-dropdown-item--down {
    min-width: 260px;
  }
}
</style>

<style lang="scss" scoped>
.tableBox {
  width: 100%;
  background: #ffffff;
  padding: 10px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-top: 20px;

  .tableHead {
    height: 47px;
    background: #fafafa;
    border: none;
    box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.06);

    th {
      border: none;
    }

    .headItem {
      text-align: center;
      font-size: 12px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 47px;
    }
  }

  .bodyList {
    height: 47px;
    box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.06);

    .bodyItem {
      height: 22px;
      font-size: 12px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: rgba(102, 102, 102, 0.85);
      line-height: 22px;
    }
  }
}

.details {
  padding: 60px 12px 16px;
  box-sizing: border-box;
}

.numList {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 12px;

  .numitem,
  .numitem1 {
    min-width: 110px;
    height: 60px;
    background: #ffffff;
    border-radius: 2px;
    text-align: center;
    box-sizing: border-box;
    margin-right: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .num {
      font-size: 20px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #1990ff;
      line-height: 24px;
    }

    .name {
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
  }

  .numitem:nth-child(3n) {
    margin-right: 0;
  }

  .numitem1 {
    min-width: 170px;
  }
}

.userSpread {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #333333;
    line-height: 18px;
    margin-top: 20px;
  }

  .chartsbox {
    height: 256px;
    background: #ffffff;
    border-radius: 4px;
    margin: 20px auto;
  }

  .chartsbox1 {
    height: 243px;
    background: #ffffff;
    border-radius: 4px;
    margin: 20px auto;
  }
}

.schoolSelect {
  margin-top: 20px;
}

.empty {
  font-size: 12px;
  padding: 20px;
}

.tableBoxB {
  margin-bottom: 40px;
}

.emptyimg {
  display: block;
  width: 150px;
  padding-top: 50px;
  margin: 0 auto;
}
</style>
