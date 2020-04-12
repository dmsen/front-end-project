<template>
  <div>
    <Card :dis-hover="true" class="headerCard">
      <Tabs :value="tabCodes" @on-click="handleTab">
        <TabPane label="单个码异常" name="code"></TabPane>
        <TabPane label="组合码异常" name="codes"></TabPane>
      </Tabs>
    </Card>
    <Card :dis-hover="true" v-if="!showCode">
      <tables
        border
        :disabled-hover="true"
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="table"
        :columns="column"
      />
    </Card>
    <Card v-if="!showCode"> <Rate :value="1" :count = "1" character="仅供参考" /></Card>
    <Card :dis-hover="true" v-if="showCode">
      <Select v-model="equipmentId" placeholder="请选择机器" @on-change="handleSearch">
        <Option v-for="item in equipmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <tables
        border
        :disabled-hover="true"
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
      />
      <Row style="margin-top: 16px">
        <Col span="3">
          <Button style="margin: 10px 0;" type="primary" @click="initAlarm">初始化异常记录</Button>
        </Col>
        <Col span = "10" offset = "11">
          <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
        </Col>
      </Row>
    </Card>

  </div>
</template>
<script>
import Tables from "_c/tables";
import { getMachines } from "@/api/equipment.js";
import { getRecord, getGroupRecord,singleAlarmCodesInit } from "@/api/alarm.js";
import { errMessage } from "@/api/index.js";
import { stampToDate } from "@/libs/tools.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      tabCodes:"code",
      dataLength:0,
      currentPages:1,
      showCode: true,
      equipmentId: "",
      equipmentList: [],
      columns: [
        { title: "设备名称", key: "macName" },
        { title: "监测点名称", key: "iopName" },
        { title: "异常码", key: "code" },
        { title: "异常码名称", key: "codeName" },
        { title: "异常消息", key: "codeMsg" },
        { title: "开始时间", key: "sDate" },
        { title: "持续时间", key: "duration" },
        { title: "严重级别", key: "level" },
        {
          title: "异常记录状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 0
                ? "default"
                : row.status === 2
                ? "primary"
                : "success";
            const text =
              row.status === 0
                ? "未处理"
                : row.status === 2
                ? "处理中"
                : "已处理";
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                },
                  style: {
                      marginLeft: "-5px"
                  },
              },
              text
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          searchable: false,
          button: [
            (h, params, vm) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.handleChoose(params);
                      }
                    }
                  },
                  "选择"
                )
              ]);
            }
          ]
        }
      ],
      tableData: [],
      column: [
        { title: "监测点组名称", key: "iopName" },
        { title: "异常码", key: "code" },
        { title: "组合码名称", key: "codeName" },
        { title: "异常消息", key: "codeMsg" },
        { title: "开始时间", key: "sDate" },
        { title: "持续时间", key: "duration" },
        { title: "严重级别", key: "level" },
        {
          title: "异常记录状态",
          key: "status",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 0
                ? "default"
                : row.status === 2
                ? "primary"
                : "success";
            const text =
              row.status === 0
                ? "未处理"
                : row.status === 2
                ? "处理中"
                : "已处理";
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                },
                style: {
                      marginLeft: "-5px"
                  },
              },
              text
            );
          }
        },
        {
          title: "操作",
          key: "handle",
          searchable: false,
          button: [
            (h, params, vm) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },

                    on: {
                      click: () => {
                        this.handleChooseGroup(params);
                      }
                    }
                  },
                  "选择"
                )
              ]);
            }
          ]
        }
      ],
      table: []
    };
  },
  methods: {
      async initAlarm() {
          const  _this = this
          if(this.equipmentId)
          {
              try {
                  const res = await singleAlarmCodesInit();
                  if(res.data.result === 0)
                  {
                      _this.$Message.success(res.data.msg);
                      _this.handleSearch()
                  }
                  else {
                      _this.$Message.error(res.data.msg);
                  }
              } catch (err) {
                  if (err.response !== undefined) {
                      errMessage(err.response.status);
                  } else {
                      errMessage(1);
                  }
              }
          }else {
              try {
                  const res = await singleAlarmCodesInit();
                  if(res.data.result === 0)
                  {
                      _this.$Message.success(res.data.msg);
                  }
                  else {
                      _this.$Message.error(res.data.msg);
                  }
              } catch (err) {
                  if (err.response !== undefined) {
                      errMessage(err.response.status);
                  } else {
                      errMessage(1);
                  }
              }
          }

      },
    changePages(val){
        this.currentPages =  val;
        if (this.tabCodes === "code") {
            this.handleSearch()
        } else{
            this.$Message.error("此功能无")
            // this.getGroupRecord();
        }
    },
    async getMachines() {
      try {
        const {
          data: { msg }
        } = await getMachines();
        for (let i = 0, l = msg.length; i < l; i++) {
          this.equipmentList.push({
            name: msg[i].machineName,
            id: msg[i].machineId
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
    async handleSearch() {
      try {
        const sendPage = this.currentPages;
        const id = this.equipmentId;
        const dataLists = await getRecord({ id,sendPage });
        this.dataLength = dataLists.data.allDateLength;
        this.tableData = [];
        for (let _i = 0, l = dataLists.data.msg.length; _i < l; _i++) {
          this.tableData.push({
            id: dataLists.data.msg[_i].alarmId,
            macId: dataLists.data.msg[_i].machineId,
            macName: dataLists.data.msg[_i].machineName,
            iopName: dataLists.data.msg[_i].physicalName,
            code: dataLists.data.msg[_i].alarmCode,
            codeName: dataLists.data.msg[_i].alarmName,
            codeMsg: dataLists.data.msg[_i].alarmMsg,
            sDate:  stampToDate(dataLists.data.msg[_i].startTime, "year"),
            duration: dataLists.data.msg[_i].duration,
            level: dataLists.data.msg[_i].level,
            status: dataLists.data.msg[_i].status
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
    async getGroupRecord() {
      try {
        const {
          data: { msg }
        } = await getGroupRecord();
        this.table = [];
        for (let _i = 0, l = msg.length; _i < l; _i++) {
          this.table.push({
            id: msg[_i].multiAlarmId,
            iopName: msg[_i].iopGroupName,
            code: msg[_i].alarmCode,
            codeName: msg[_i].alarmGroupName,
            codeMsg: msg[_i].alarmMsg,
            sDate: msg[_i].startTime,
            duration: msg[_i].duration,
            level: msg[_i].level,
            status: msg[_i].status
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
    handleChoose(e) {
        console.log(this.tableData[e.index])
      this.$store.commit("setRecord", this.tableData[e.index]);
      this.$store.commit("setCurrent", 1);
      this.$router.push("/alarm/process");
    },
    handleChooseGroup(e) {
      this.$store.commit("setRecordGroup", this.tableData[e.index]);
      this.$store.commit("setCurrent", 1);
      this.$router.push("/alarm/process");
    },
    handleTab(e) {

      if (e === "code") {
        this.showCode = true;
      } else {
        // this.getGroupRecord();
        this.$Message.error("此功能无")
        this.showCode = false;
      }
    }
  },
  beforeMount() {
    this.getMachines();
  }
};
</script>

<style lang="less" scoped>
#formImg {
  height: 208px;
  width: 100%;
  border-radius: 8px;
  padding: 0 0 -12px 0;
  opacity: 0.75;
}
.form {
  margin-top: 20px;
}
</style>
