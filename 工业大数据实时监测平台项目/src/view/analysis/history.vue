<template>
  <div>
    <Card :dis-hover="true" class="headerCard">

      <Select
        v-model="equipmentId"
        filterable
        placeholder="请选择机器"
        label-in-value
        @on-change="handleChooseMac"
      >
        <Option v-for="item in equipmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Select
        v-model="iop"
        filterable
        placeholder="请选择监测点"
        label-in-value
        style="margin: 20px 0 0 0"
        v-show="hasChoose"
      >
        <Option v-for="item in iopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <DatePicker
        type="date"
        v-model="fDate"
        format="yyyy-MM-dd HH:mm:ss"
        style="width: auto; margin: 20px 20px 0 0"
      ></DatePicker>
      <DatePicker
        type="date"
        v-model="lDate"
        format="yyyy-MM-dd HH:mm:ss"
        style="width: auto; margin: 20px 20px 0 0"
      ></DatePicker>
      <Button type="primary" @click="handleGetHistory" style="margin: 0 0 0 0">查询历史记录</Button>
      <Rate :value="1" :count = "1" character="直接点击查询即可，后台保存了2019/4/12  18:00 ~ 20:00的数据"  style="margin-left: 60px;margin-top: 15px"/>
    </Card>
    <Card :dis-hover="true">
      <hchartsLine :options="line" ref="line" ></hchartsLine>
    </Card>
  </div>
</template>
<script>
import { hchartsLine } from "_c/charts";
import { errMessage } from "@/api/index.js";
import { getHistory } from "@/api/analysis.js";
import { getMachines } from "@/api/equipment.js";
import { getIopConfigs } from "@/api/gateway.js";

const themeColor = localStorage.themeStyle === 'dark' ? '#666' : localStorage.themeStyle==='blue'? '#4884e2':localStorage.themeStyle === 'light'? '#19be6b':
    '#ffa3d5'

export default {
  components: {
    hchartsLine
  },
  data() {
    return {
      hasChoose: false,
      equipmentId: "",
      fDate: "",
      lDate: "",
      equipmentList: [],
      iopList: [],
      iop: "",
      line: {
        title: "历史记录", // 标题  没有则可去掉
        // subtitle: "历史记录", // 副标题
        series: [],
      }
    };
  },
  methods: {
    async getMachines() {
      try {
        const {
          data: { msg }
        } = await getMachines();
        for (let i = 0, length = msg.length; i < length; i++) {
          this.equipmentList.push({
            id: msg[i].machineId,
            name: msg[i].machineName
          });
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    async getIopConfigs(id) {
      try {
        const {
          data: { msg }
        } = await getIopConfigs({ id });
        this.iopList = [];
        for (let i = 0, length = msg.length; i < length; i++) {
          this.iopList.push({
            id: msg[i].id,
            name: msg[i].physicalName
          });
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    async handleGetHistory() {
      try {
        let fDate = this.fDate.valueOf();
        let lDate = this.lDate.valueOf();
        const { equipmentId, iop } = this;
        let req = {
          gwsWithIOPs: {},
          timeLeft: fDate,
          timeRight: lDate
        };
        req.gwsWithIOPs[equipmentId] = [iop];
        const {
          data: { msg }
        } = await getHistory({
          req
        });
        console.log(msg)
        let list = [];
        this.line = {
          title: "",
          subtitle: "历史记录",
          series: [],
        };
        for (
          let i = 0, arr = Object.keys(msg[0].records), l = arr.length;
          i < l;
          i++
        ) {
          list.push([Number(arr[i]), msg[0].records[arr[i]]]);
        }
        this.line = {
          title: msg[0].machineName,
          subtitle: "历史记录",
          color:[themeColor], // 让数据线颜色跟随主题变更
          series: [
            {
              name: msg[0].physicalName,
              data: list
            }
          ]
        };
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    async handleChooseMac() {
      await this.getIopConfigs(this.equipmentId);
      this.hasChoose = true;
    }
  },
  beforeMount() {
    this.getMachines();
  }
};
</script>
<style>
</style>
