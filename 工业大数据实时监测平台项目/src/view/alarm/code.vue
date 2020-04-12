<template>
  <Card :dis-hover="true">
    <tables
      border
      :disabled-hover="true"
      ref="tables"
      editable
      searchable
      search-place="top"
      v-model="tableData"
      :columns="columns"
      @on-delete="handleDelete"
    />
      <Row style="margin-top: 16px">
          <Col span="3">
              <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
          </Col>
          <Col span="5">
              <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddCode">增加异常码</Button>
          </Col>
          <Col span = "10" offset = "6">
              <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
          </Col>
      </Row>


    <Card v-if="handleCode" :dis-hover="true">
      <Row>
        <i-col span="17">
          <Form :model="formItem" ref="formItem" :label-width="80" class="form">
            <FormItem label="异常码" prop="code">
              <Input v-model="formItem.code" :disabled="!formItem.isAdd" style="width: auto"/>
            </FormItem>
            <FormItem label="异常码名" prop="name">
              <Input v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="选择设备" prop="macId">
              <Select v-model="formItem.macId" style="width: auto" @on-change="handleChooseMac">
                <Option v-for="(i,index) in formItem.macList" :key="index" :value="i.id">{{i.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择监测点" prop="iopId">
              <Select v-model="formItem.iopId" style="width: auto">
                <Option v-for="(i,index) in formItem.iopList" :key="index" :value="i.id">{{i.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="最小值" prop="min">
              <Input v-model="formItem.min" style="width: auto"/>
            </FormItem>
            <FormItem label="最大值" prop="max">
              <Input v-model="formItem.max" style="width: auto"/>
            </FormItem>
            <FormItem label="异常消息" prop="msg">
              <Input v-model="formItem.msg" style="width: auto"/>
            </FormItem>
            <FormItem label="异常等级" prop="level">
              <Select v-model="formItem.level" style="width: auto">
                <Option :value="1">1</Option>
                <Option :value="2">2</Option>
                <Option :value="3">3</Option>
              </Select>
            </FormItem>
            <FormItem label="时延" prop="timeLimit">
              <Input v-model="formItem.timeLimit" style="width: auto"/>
            </FormItem>
            <Button style="margin: 10px 0 10px 100px;" type="primary" @click="handleSubmit">确认提交</Button>
            <Button style="margin: 10px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
          </Form>
        </i-col>
      </Row>
    </Card>
  </Card>
</template>
<script>
import Tables from "_c/tables";
import { getCodes, addCode, deleteCode, changeCode } from "@/api/alarm.js";
import {  getIopConfigs } from "@/api/gateway.js";
import { errMessage } from "@/api/index.js";
import {getMachines} from "@/api/equipment.js"
export default {
  components: {
    Tables
  },
  data() {
    return {
    dataLength:0,
    currentPages:1,
      handleCode: false,
      formItem: {
        isAdd: true,
        id: "",
        code: "",
        name: "",
        macId: "",
          macName:'',
        macList: [],
        iopId: "",
        iopList: [],
        min: "",
        max: "",
        level: "",
        msg: "",
        timeLimit: ""
      },
      columns: [
        { title: "异常码", key: "code" },
        { title: "异常码名", key: "name" },
        { title: "设备名", key: "macName" },
        { title: "监控点名", key: "iopName" },
        { title: "最小值", key: "min" },
        { title: "最大值", key: "max" },
        { title: "异常消息", key: "msg" },
        { title: "异常等级", key: "level" },
        { title: "时延", key: "timeLimit" },
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
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.showChangeCode(params);
                      }
                    }
                  },
                  "修改"
                ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "你确定要删除吗?"
                    },
                    style: {
                      marginLeft: "-5px"
                    },
                    on: {
                      "on-ok": () => {
                        vm.$emit("on-delete", params);
                        vm.$emit(
                          "input",
                          params.tableData.filter(
                            (item, index) => index !== params.row.initRowIndex
                          )
                        );
                      }
                    }
                  },
                  [
                    h(
                      "Button",
                      {
                        props: {
                          type: "error",
                          size: "small"
                        }
                      },
                      "删除"
                    )
                  ]
                )
              ]);
            }
          ]
        }
      ],
      tableData: []
    };
  },
  methods: {
  changePages(val){
      this.currentPages =  val
      this.getCodes();
  },
    async getMacs() {
      try {
        const {
          data: { msg }
        } = await getMachines();
        console.log(msg)
        this.formItem.macList = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.formItem.macList.push({
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
    async getIops(id) {
      try {
        const {
          data: { msg }
        } = await getIopConfigs({ id });
        this.formItem.iopList = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.formItem.iopList.push({
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
    async handleDelete(params) {
      const _this = this;
      const id = this.tableData[params.index].code;
      try {
        const deleteRes = await deleteCode({ id });
        if(deleteRes.data.result ===1){
            _this.$Message.error(deleteRes.data.msg);
        }else {
            _this.$Message.success("删除成功");
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getCodes();
    },
    async getCodes() {
      try {
      const sendPage = this.currentPages;
        const codesList = await getCodes(sendPage);
        console.log(codesList)
        this.tableData = [];
         this.dataLength = codesList.data.allDateLength;
        for (let i = 0, l = codesList.data.msg.length; i < l; i++) {
          this.tableData.push({
            // id: codesList.data.msg[i].id,
            code: codesList.data.msg[i].alarmCode,
            name: codesList.data.msg[i].alarmName,
            // macId: codesList.data.msg[i].machineId,
            macName:codesList.data.msg[i].machineName,
            // iopId: codesList.data.msg[i].configId,
            iopName: codesList.data.msg[i].physicalName,
            min: codesList.data.msg[i].valueMin,
            max: codesList.data.msg[i].valueMax,
            msg: codesList.data.msg[i].alarmMsg,
            level: codesList.data.msg[i].level,
            timeLimit: codesList.data.msg[i].timeLimit
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
    handleChooseMac(id) {
      this.getIops(id);
    },
    showAddCode() {
      this.handleCode = true;
    },
    showChangeCode(param) {
      this.formItem.isAdd = false;
      const {
          code,
        name,
          macName,
          iopName,
        min,
        max,
        msg,
        level,
        timeLimit
      } = this.tableData[param.index];
      this.formItem.name = name;
      this.formItem.id = code;
      this.formItem.macId = macName;
      this.formItem.iopId = iopName;
      this.formItem.min = min;
      this.formItem.max = max;
      this.formItem.level = level;
      this.formItem.msg = msg;
      this.formItem.timeLimit = timeLimit;
      this.handleCode = true;
      // this.handleChooseMac(macId);
    },
    handleCancel() {
      this.handleCode = false;
      this.formItem = {
        isAdd: true,
        id: "",
        code: "",
        name: "",
        macId: "",
        macList: [],
        iopId: "",
        iopList: [],
        min: "",
        max: "",
        level: "",
        msg: "",
        timeLimit: ""
      };
      this.getMacs();
    },
    async handleSubmit() {
      const _this = this;
      const {
        isAdd,
        id,
        code,
        name,
        iopId,
        min,
        max,
        msg,
        level,
        timeLimit,
          macId
      } = this.formItem;
      try {
        if (isAdd) {
          const addRes = await addCode({
            code,
            name,
            macId,
            iopId,
            min,
            max,
            msg,
            level,
            timeLimit
          });
          console.log(addRes)
            if(addRes.data.result === 0)
            {
                _this.$Message.success("添加成功");
            }
            else {
                _this.$Message.error(addRes.data.msg);
            }
        } else {
          const changeRes = await changeCode({
            id,
            name,
            macId,
            iopId,
            min,
            max,
            msg,
            level,
            timeLimit
          });
            if(changeRes.data.result === 0)
            {
                _this.$Message.success("修改成功");
            }
            else {
                _this.$Message.error(changeRes.data.msg);
            }
        }
      } catch (err) {
          console.log(err)
    if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getCodes();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getCodes();
    this.getMacs();
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
