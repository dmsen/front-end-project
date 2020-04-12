<template>
  <div>
    <Card class="headerCard" :dis-hover="true">
      <Steps :current="current">
        <Step title="选择异常记录信息" icon="md-arrow-dropdown-circle"></Step>
        <Step title="选择解决方案" icon="md-arrow-dropdown-circle"></Step>
        <Step title="提交反馈" icon="ios-mail"></Step>
        <Step title="完成" icon="ios-checkmark-circle"></Step>
      </Steps>
    </Card>
    <Card :dis-hover="true" v-show="current === 0">
      点击前往
      <a @click="handleGo('/alarm/record')">异常记录页面</a>选择异常记录
    </Card>
    <Card :dis-hover="true" v-show="current === 1">
      <tables
              border
              :disabled-hover="true"
              ref="tables"
              editable
              searchable
              search-place="top"
              v-model="alarmCodesTableData"
              :columns="alarmCodesColumns"
      />
      <!--点击前往-->
      <!--<a @click="handleGo('/alarm/solution')">解决方案页面</a>选择解决方案-->
    </Card>
    <Card :dis-hover="true" v-show="current === 2">
      <Divider orientation="left">异常记录</Divider>
      <Table :columns="record" :data="recordData"></Table>
      <Divider orientation="left">组合码记录</Divider>
      <Table :columns="group" :data="groupData"></Table>
      <Divider orientation="left">解决方案</Divider>
      <Table :columns="solution" :data="solutionData"></Table>
      <Select v-model="status" style="margin: 10px 0">
        <Option :value="0">失败</Option>
        <Option :value="1">成功</Option>
        <Option :value="2">处理中</Option>
      </Select>
      <Input v-model="msg" type="textarea" :rows="4" placeholder="反馈信息"/>
      <Button @click="handleSubmit" style="margin: 10px 0" type="success">提交反馈</Button>
    </Card>
    <Card :dis-hover="true" v-show="current === 3">
      提交成功..
      <a @click="handleReset">继续提交</a>
    </Card>
  </div>
</template>
<script>
import Tables from "_c/tables";
import {
  addDiagnosisGroup,
  addDiagnosisSingle,
  getDiagnosis
} from "@/api/alarm.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
      Tables
  },
  data() {
    return {
      status: 0,
      msg: "",
      current: this.$store.state.alarm.current,
      recordData: [],
      record: [
        { title: "异常码名称", key: "codeName" },
        { title: "设备名称", key: "macName" },
        { title: "监测点名称", key: "iopName" },
        { title: "异常码", key: "code" },
        { title: "异常消息", key: "codeMsg" },
        { title: "开始时间", key: "sDate" },
        { title: "持续时间", key: "duration" },
        { title: "严重级别", key: "level" }
      ],
      groupData: [],
      group: [
        { title: "组合码名称", key: "codeName" },
        { title: "监测点组名称", key: "iopName" },
        { title: "异常码", key: "code" },
        { title: "异常消息", key: "codeMsg" },
        { title: "开始时间", key: "sDate" },
        { title: "持续时间", key: "duration" },
        { title: "严重级别", key: "level" }
      ],
      solution: [
        { title: "名称", key: "name" },
        { title: "描述", key: "detail" },
        { title: "适用异常码/组合码", key: "list" }
      ],
      solutionData: [],
      alarmCodesTableData: [],
      alarmCodesColumns: [
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
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginLeft: "-10px"
                                    },
                                    on: {
                                        click: () => {
                                            this.handleGo('/alarm/solution')
                                        }
                                    }
                                },
                                "选择解决方案"
                            )
                        ]);
                    }
                ]
            }
      ],
    };
  },
  watch: {
    current(newVal, oldVal) {
      this.current = newVal;
    }
  },
  methods: {
    async handleSubmit() {
      var p = false;
      const _this = this;
      if (this.recordData.length > 0) {
        var solution = this.solutionData[0].id;
        var code = this.recordData[0].code;
        var sDate = this.recordData[0].sDate;
        var record = this.recordData[0].id;
        var status = this.status ;
        var msg = this.msg;
        var macName = this.recordData[0].macName;
      } else {
        var solution = this.solutionData[0].id;
        var code = this.groupData[0].code;
        var sDate = this.groupData[0].sDate;
        var record = this.groupData[0].id;
        var status = this.status;
        var msg = this.msg;
        p = true;
      }
      try {
        if (p) {
          const res = await addDiagnosisGroup({
            solution,
            record,
            sDate,
            code,
            msg,
            status
          });
            if(res.data.result === 1)
            {
                _this.$Message.error(res.data.msg);

            }else {
                _this.$Message.success(res.data.msg);
            }
          _this.$store.commit("setCurrent", 3);
          _this.current = 3;
        } else {
          const res = await addDiagnosisSingle({
            solution,
            record,
            sDate,
            code,
            msg,
            status,
            macName
          });
          console.log("+++")
           if(res.data.result === 1)
            {
                _this.$Message.error(res.data.msg);

            }else {
                _this.$Message.success(res.data.msg);
            }
          _this.$store.commit("setCurrent", 3);
          _this.current = 3;
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    handleGo(path) {
      this.$router.push(path);
    },
    handleReset() {
      this.$store.commit("setCurrent", 0);
      this.current = 0;
    }
  },
  beforeMount() {
    if(this.current ===1)
      {
          this.alarmCodesTableData = [];
          this.alarmCodesTableData.push(this.$store.state.alarm.alarmRecord)
      }
    this.solutionData.push(this.$store.state.alarm.solution);
    this.recordData.push(this.$store.state.alarm.alarmRecord);
    this.groupData.push(this.$store.state.alarm.alarmRecordGroup);
  }
};
</script>
<style lang="less" scoped>
</style>
