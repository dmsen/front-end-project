<template>
  <div>
    <Card :dis-hover="true" class="headerCard">




      <Form :label-width="80" style="font-weight: bold">
        <Rate :value="1" :count = "1" character="直接点击查询即可，后台保存了2019/4/12 18:00 ~ 19:00的数据"  style="margin-left: 60px"/>
        <Rate :value="1" :count = "1" character="可选中第一个图表的任意一点返回前后半个小时数据"  style="margin-left: 60px"/>
        <Rate :value="1" :count = "1" character="可选中第二个图表的任意一点返回前后15分钟数据"  style="margin-left: 60px"/>
        <FormItem label="机器编号" >
          <Select
            v-model="searchForm.id"
            placeholder="请输入机器名称"
            @on-change="getPhysicName"
            label-in-value
            filterable
          >
            <Option
              v-for="i in machineLists"
              :value="i.machineId"
              :key="i.machineId"
            >{{i.machineName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="查询类型" v-if="!!searchForm.id">
          <Select v-model="searchForm.type" filterable>
            <Option
              v-for="(i,index) in physicalNameLists"
              :value="i.id"
              :key="index"
            >{{i.physicalName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="日期区间">
          <Row>
            <i-col span="12">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期..."
                :v-model="searchForm.fdate"
                @on-change="changeFdate"
              ></DatePicker>
            </i-col>
            <i-col span="12">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期..."
                :v-model="searchForm.ldate"
                @on-change="changeLdate"
              ></DatePicker>
            </i-col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">查询</Button>
        </FormItem>

      </Form>

    </Card>
    <Card :dis-hover="true" style="margin: 10px;">
      <Row>
        <i-col span="24">
          <div id="record" :style="{width: '1000px', height: '450px',margin:'auto'}"></div>
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
          <div
            id="recordChild"
            :style="{width: '1000px', height: '450px',margin:'auto'}"
            v-show="recordChild"
          ></div>
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
          <div
            id="recordChildChild"
            :style="{width: '1000px', height: '450px',margin:'auto'}"
            v-show="recordChildChild"
          ></div>
        </i-col>
      </Row>
    </Card>
  </div>
</template>
<script>
function transformTime(timestamp) {
  let date = new Date(timestamp);
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = date.getDate() + " ";
  let h = date.getHours() + ":";
  let m = date.getMinutes() + ":";
  let s = date.getSeconds();
  return Y + M + D + h + m + s;
}
import { getHistoryDate,getHistoryDate2,getHistoryDate3 } from "@/api/analysis.js";
import { getIopConfigs } from "@/api/gateway.js";
import { getMachines } from "@/api/equipment.js";
import { errMessage } from "@/api/index.js";
export default {
  data() {
    return {
      spinShow: false,
      chartsName: "",
      machineLists: [],
      physicalNameLists: [],
      recordChild: false,
      recordChildChild: false,
      xList: [],
      yList: [],
      recordc: [],
      recordChildc: [],
      recordChildChildc: [],
      searchForm: {
        id: "",
        type: "",
        fdate: "",
        ldate: ""
      }
    };
  },
  methods: {
    async handleGetEquipment() {
      try {
        const res = await getMachines();
        for (let i = 0; i < res.data.msg.length; i++) {
          this.machineLists.push(res.data.msg[i]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    getPhysicName(value) {
      this.searchForm.type = "";
      this.chartsName = value.label;
      this.handleGetIopConfigs(value.value);
    },
    async handleGetIopConfigs(id) {
      let that = this;
      this.physicalNameLists = [];
      try {
        const res = await getIopConfigs({ id });
        for (let i = 0; i < res.data.msg.length; i++) {
          that.physicalNameLists.push(res.data.msg[i]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    changeFdate(date) {
      this.searchForm.fdate = date;
      this.searchForm.fdate = Date.parse(new Date(this.searchForm.fdate));
    },
    changeLdate(date) {
      this.searchForm.ldate = date;
      this.searchForm.ldate = Date.parse(new Date(this.searchForm.ldate));
    },
    initCharts() {
      // 基于准备好的dom，初始化echarts实例
      let that = this;
      let record = this.$echarts.init(document.getElementById("record"));
      record.setOption({
        title: {
          text: "数据/小时"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: [1, 2, 3]
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        toolbox: {
          left: "center",
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            startValue: "2014-06-01"
          },
          {
            type: "inside"
          }
        ],
        visualMap: {
          top: 10,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 10,
              color: "#096"
            },
            {
              gt: 10,
              lte: 50,
              color: "#ffde33"
            },
            {
              gt: 50,
              lte: 100,
              color: "#ff9933"
            },
            {
              gt: 100,
              lte: 300,
              color: "#cc0033"
            },
            {
              gt: 300,
              lte: 500,
              color: "#660099"
            },
            {
              gt: 500,
              color: "#7e0023"
            }
          ],
          outOfRange: {
            color: "#999"
          }
        },
        series: {
          name: "",
          type: "line",
          data: [],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 10
              },
              {
                yAxis: 50
              },
              {
                yAxis: 100
              },
              {
                yAxis: 300
              },
              {
                yAxis: 500
              }
            ]
          }
        }
      });
      //请求结束
    },
    async handleSubmit() {
      let that = this;
      that.recordChild = false;
      that.recordChildChild = false;
      that.recordc = [];
      that.recordChildc = [];
      that.recordChildChildc = [];
      try {
        let sendJson = {};
        sendJson["gwsWithIOPs"] = {};
        sendJson["gwsWithIOPs"][that.searchForm.id] = [that.searchForm.type];
        sendJson["timeLeft"] = that.searchForm.fdate;
        sendJson["timeRight"] = that.searchForm.ldate;
        sendJson["count"] = 1000;
        const res = await getHistoryDate({ sendJson });
        console.log(res)
        if(res.data.msg.records === null){
          // that.$Message.error("查询失败！当前区间没有数据");
          that.initCharts()
        }
        if (Object.keys(res.data.msg.records).length === 0) {
          that.$Message.error("查询失败！当前区间没有数据");
        }
        if (Object.keys(res.data.msg.records).length > 0) {
          that.$Message.success("查询成功！正在为您加载数据");
          that.xList = Object.keys(res.data.msg.records);
          that.yList = Object.values(res.data.msg.records);
          that.xList = Array.from(that.xList, x => transformTime(Number(x)));
          let record = that.$echarts.init(document.getElementById("record"));
          record.clear();
          record.setOption({
            title: {
              text: "数据/小时"
            },
            tooltip: {
              trigger: "axis"
            },
            xAxis: {
              data: that.xList
            },
            yAxis: {
              splitLine: {
                show: false
              }
            },
            toolbox: {
              left: "center",
              feature: {
                dataZoom: {
                  yAxisIndex: "none"
                },
                restore: {},
                saveAsImage: {}
              }
            },
            dataZoom: [
              {
                startValue: "2014-06-01"
              },
              {
                type: "inside"
              }
            ],
            series: {
              name: "",
              type: "line",
              data: that.yList,
              markLine: {
                silent: true
              }
            }
          });
          record.off("dblclick");
          record.on("dblclick", async function(params) {
            let sendJson = {};
            sendJson["gwsWithIOPs"] = {};
            sendJson["gwsWithIOPs"][that.searchForm.id] = [
              that.searchForm.type
            ];
            sendJson["timeLeft"] =
              Date.parse(new Date(params.data.xAxis)) - 30 * 60 * 1000;
            sendJson["timeRight"] =
              Date.parse(new Date(params.data.xAxis)) + 30 * 60 * 1000;
            sendJson["count"] = 1000;
            that.recordChildc = [];
            that.recordChildChild = false;
            let recordChild = that.$echarts.init(
              document.getElementById("recordChild")
            );
            const res2 = await getHistoryDate2({ sendJson });
            console.log(res2)
            if (Object.keys(res2.data.msg.records).length === 0) {
              that.$Message.error("查询失败！当前区间没有数据");
            }
            if (Object.keys(res2.data.msg.records).length > 0) {
              that.xList = Object.keys(res2.data.msg.records);
              that.yList = Object.values(res2.data.msg.records);
              that.xList = Array.from(that.xList, x =>
                transformTime(Number(x))
              );
              that.$Message.success("查询成功！正在为您加载数据");
              that.recordChild = true;
              recordChild.clear();
              recordChild.setOption({
                title: {
                  text: "数据/分钟"
                },
                tooltip: {
                  trigger: "axis"
                },
                xAxis: {
                  data: that.xList
                },
                yAxis: {
                  splitLine: {
                    show: false
                  }
                },
                toolbox: {
                  left: "center",
                  feature: {
                    dataZoom: {
                      yAxisIndex: "none"
                    },
                    restore: {},
                    saveAsImage: {}
                  }
                },
                dataZoom: [
                  {
                    startValue: "2014-06-01"
                  },
                  {
                    type: "inside"
                  }
                ],
                series: {
                  name: "",
                  type: "line",
                  data: that.yList,
                  markLine: {
                    silent: true
                  }
                }
              });
              //添加点击事件，点击图表内参数触发事件
              recordChild.off("dblclick");
              recordChild.on("dblclick", async function(params) {
                that.recordChildChildc = [];
                let recordChildChild = that.$echarts.init(
                  document.getElementById("recordChildChild")
                );
                let sendJson = {};
                sendJson["gwsWithIOPs"] = {};
                sendJson["gwsWithIOPs"][that.searchForm.id] = [
                  that.searchForm.type
                ];
                sendJson["timeLeft"] =
                  Date.parse(new Date(params.data.xAxis)) - 15 * 60 * 1000;
                sendJson["timeRight"] =
                  Date.parse(new Date(params.data.xAxis)) + 15 * 60 * 1000;
                sendJson["count"] = 1000;
                const res3 = await getHistoryDate3({ sendJson });
                console.log(res3)
                if (Object.keys(res3.data.msg.records).length === 0) {
                  that.$Message.error("查询失败！当前区间没有数据");
                }
                if (Object.keys(res3.data.msg.records).length > 0) {
                  that.xList = Object.keys(res3.data.msg.records);
                  that.yList = Object.values(res3.data.msg.records);
                  that.xList = Array.from(that.xList, x =>
                    transformTime(Number(x))
                  );
                  that.$Message.success("查询成功！正在为您加载数据");
                  that.recordChildChild = true;
                  recordChildChild.clear();
                  recordChildChild.setOption({
                    title: {
                      text: "数据/秒"
                    },
                    tooltip: {
                      trigger: "axis"
                    },
                    xAxis: {
                      data: that.xList
                    },
                    yAxis: {
                      splitLine: {
                        show: false
                      }
                    },
                    toolbox: {
                      left: "center",
                      feature: {
                        dataZoom: {
                          yAxisIndex: "none"
                        },
                        restore: {},
                        saveAsImage: {}
                      }
                    },
                    dataZoom: [
                      {
                        startValue: "2014-06-01"
                      },
                      {
                        type: "inside"
                      }
                    ],
                    series: {
                      name: "",
                      type: "line",
                      data: that.yList,
                      markLine: {
                        silent: true
                      }
                    }
                  });
                  recordChildChild.off("click");
                  recordChildChild.on("click", function(param) {
                    that.recordChildChildc.push({
                      value: param.data,
                      xAxis: param.name,
                      yAxis: param.data
                    });
                    recordChildChild.setOption({
                      series: [
                        {
                          markPoint: {
                            data: that.recordChildChildc
                          }
                        }
                      ]
                    });
                  });
                }
              });
              recordChild.off("click");
              recordChild.on("click", function(param) {
                that.recordChildc.push({
                  value: param.data,
                  xAxis: param.name,
                  yAxis: param.data
                });
                recordChild.setOption({
                  series: [
                    {
                      markPoint: {
                        data: that.recordChildc
                      }
                    }
                  ]
                });
              });
            }
          });
          record.off("click");
          record.on("click", function(param) {
            that.recordc.push({
              value: param.data,
              xAxis: param.name,
              yAxis: param.data
            });
            record.setOption({
              series: [
                {
                  markPoint: {
                    data: that.recordc
                  }
                }
              ]
            });
          });
        }
      } catch (err) {
        that.$Message.error("查询失败！当前区间没有数据");
        that.initCharts()
        // console.log(err);
      }
    }
  },
  created() {
    this.handleGetEquipment();
  },
  mounted() {
    this.initCharts();
  }
};
</script>
