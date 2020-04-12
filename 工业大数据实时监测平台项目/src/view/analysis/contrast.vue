<template>
  <div>
    <Card :dis-hover="true" class="headerCard">
      <Rate :value="1" :count = "1" character="直接点击查询即可"  style="margin-top: 15px"/>
      <Form :label-width="0" class="form">
        <Row
          v-for="(item, index) in items"
          v-show="item.status"
          :key="index"
          style="margin: 10px 0 0 0"
        >
          <i-col span="7">
            <Select
              v-model="item.equipmentId"
              filterable
              placeholder="请选择机器"
              label-in-value
              @on-change="handleChooseMac(item)"
            >
              <Option v-for="i in equipmentList" :value="i.id" :key="i.id">{{ i.name }}</Option>
            </Select>
          </i-col>
          <i-col span="7" offset="1">
            <Select
              v-model="item.iops"
              filterable
              multiple
              placeholder="请选择监测点"
              label-in-value
              style="margin: 0 0 0 0"
              v-show="item.click"
            >
              <Option v-for="i in item.iopList" :value="i.id" :key="i.id">{{ i.name }}</Option>
            </Select>
          </i-col>
          <i-col span="4" offset="1">
            <Button @click="handleRemove(index)" type="error" v-show="items.length > 1">删除</Button>
          </i-col>
        </Row>
        <Button style="margin:0 20px 0 0" type="dashed" @click="handleAddItem" icon="md-add">增加选项</Button>
        <DatePicker
          type="date"
          v-model="fDate"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: auto; margin: 0px 20px 0 0"
        ></DatePicker>
        <DatePicker
          type="date"
          v-model="lDate"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: auto; margin: 20px 20px 0 0"
        ></DatePicker>
        <Button style="margin: 10px 0 10px 10px;" type="primary" @click="handleGetHistory">查询</Button>
      </Form>
    </Card>
    <Card :dis-hover="true">
      <hchartsLine :options="line" ref="line"></hchartsLine>
    </Card>
  </div>
</template>
<script>
import { hchartsLine } from "_c/charts";
import { errMessage } from "@/api/index.js";
import { getHistoryContrast } from "@/api/analysis.js";
import { getMachines } from "@/api/equipment.js";
import { getIopConfigs } from "@/api/gateway.js";
export default {
  components: {
    hchartsLine
  },
  data() {
    return {
      items: [
        {
          index: 1,
          equipmentId: "",
          click: false,
          iopList: [],
          iops: [],
          status: 1
        }
      ],
      fDate: "",
      lDate: "",
      equipmentList: [],
      line: {
        title: "",
        series: []
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
    async handleGetHistory() {
      try {
        let fDate = this.fDate.valueOf();
        let lDate = this.lDate.valueOf();
        let req = {
          gwsWithIOPs: {},
          timeLeft: fDate,
          timeRight: lDate
        };
        for (let x = 0, l = this.items.length; x < l; x++) {
          if (this.items[x].status == 0) {
          } else {
            req.gwsWithIOPs[this.items[x].equipmentId] = this.items[x].iops;
          }
        }
        const {
          data: { msg }
        } = await getHistoryContrast({
          req
        });
        console.log(msg)
        this.line = {
          title: "数据对比",
          series: []
        };
        let list = [];
        for (let _k = 0, l = msg.length; _k < l; _k++) {
          list.push([]);
          for (
            let i = 0, arr = Object.keys(msg[_k].records), l = arr.length;
            i < l;
            i++
          ) {
            list[_k].push([Number(arr[i]), Number(msg[_k].records[arr[i]])]);
          }
          this.line.series.push({
            name: msg[_k].machineName + msg[_k].physicalName,
            data: list[_k]
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
    async handleChooseMac(i) {
      try {
        let id = i.equipmentId;
        const {
          data: { msg }
        } = await getIopConfigs({ id });
        i.iopList = [];
        for (let z = 0, length = msg.length; z < length; z++) {
          i.iopList.push({
            id: msg[z].id,
            name: msg[z].physicalName
          });
        }
        i.click = true;
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    handleRemove(index) {
      this.items[index].status = 0;
    },
    handleAddItem() {
      this.key++;
      this.items.push({
        index: this.key,
        mac: "",
        click: false,
        iopList: [],
        iops: [],
        status: 1
      });
    }
  },
  beforeMount() {
    this.getMachines();
  }
};
</script>
<style>
</style>
