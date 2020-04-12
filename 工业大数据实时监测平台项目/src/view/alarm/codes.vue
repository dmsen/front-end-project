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
    <Rate :value="1" :count = "1" character="此页面暂仅供参考" />
    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddCodeGroup">增加组合码</Button>
    <Card v-if="handleCodeGroup" :dis-hover="true">
      <Row>
        <i-col span="17">
          <Form :model="formItem" ref="formItem" :label-width="100" class="form">
            <FormItem label="组合码名称">
              <Input v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="选择监测点组">
              <Select v-model="formItem.id" style="width: auto" @on-change="handleChooseIopGroup">
                <Option v-for="(i, index) in formItem.iopList" :key="index" :value="i.id">{{i.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="it.name" v-for="it in formItem.item" :key="it.id">
              <Select v-model="it.iop" v-show="formItem.id" multiple style="width: auto">
                <Option v-for="(i, index) in it.iops" :key="index" :value="i.id">{{i.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="异常消息">
              <Input v-model="formItem.msg" style="width: auto"/>
            </FormItem>
            <FormItem label="异常等级">
              <Select v-model="formItem.level" style="width: auto">
                <Option :value="1">1</Option>
                <Option :value="2">2</Option>
                <Option :value="3">3</Option>
              </Select>
            </FormItem>
            <FormItem label="时延">
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
import {
  addCodeGroup,
  deleteCodeGroup,
  getCodeGroups,
  getCodeByIop
} from "@/api/alarm.js";
import { getIopGroups, getIopsByGroup } from "@/api/gateway.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      handleCodeGroup: false,
      formItem: {
        isAdd: true,
        name: "",
        id: "",
        iops: [],
        iopList: [],
        codeList: [],
        item: [],
        msg: "",
        level: "",
        timeLimit: ""
      },
      columns: [
        { title: "组合码", key: "code" },
        { title: "组合码名称", key: "name" },
        { title: "监控点组名称", key: "iopName" },
        { title: "异常消息", key: "msg" },
        { title: "异常级别", key: "level" },
        { title: "时延", key: "timeLimit" },
        {
          title: "操作",
          key: "handle",
          searchable: false,
          button: [
            (h, params, vm) => {
              return h("div", [
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
    handleChooseIopGroup() {
      this.getIopsByGroup(this.formItem.id);
    },
    async getIopsByGroup(id) {
      try {
        const res = await getIopsByGroup({ id });
        const iopList = res.data.msg;
        this.formItem.item = [];
        for (let _i = 0, l = iopList.length; _i < l; _i++) {
          this.formItem.item.push({
            id: iopList[_i].configId,
            name: iopList[_i].machineName + iopList[_i].physicalName,
            iops: [],
            iop: []
          });
          let id = iopList[_i].configId;
          const {
            data: { msg }
          } = await getCodeByIop({ id });
          for (let x = 0, l = msg.length; x < l; x++) {
            this.formItem.item[_i].iops.push({
              id: msg[x].id,
              name: msg[x].alarmName
            });
          }
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    async getIopGroups() {
      try {
        const {
          data: { msg }
        } = await getIopGroups();
        this.formItem.iopList = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.formItem.iopList.push({
            id: msg[i].iopGroupId,
            name: msg[i].iopGroupName
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
      const id = this.tableData[params.index].code;
      try {
        // const deleteRes = await deleteCodeGroup({ id });
        this.$Message.success("此页面仅供参考");
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getCodeGroups();
    },
    async getCodeGroups() {
      try {
        const {
          data: { msg }
        } = await getCodeGroups();
        console.log(msg)
        this.tableData = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.tableData.push({
            id: msg[i].id,
            code: msg[i].alarmCode,
            name: msg[i].alarmGroupName,
            iopId: msg[i].iopGroupId,
            iopName: msg[i].alarmGroupName,
            msg: msg[i].alarmMsg,
            level: String(msg[i].level),
            timeLimit: msg[i].timeLimit
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
    showAddCodeGroup() {
      this.handleCodeGroup = true;
    },
    handleCancel() {
      this.handleCodeGroup = false;
      this.formItem = {
        isAdd: true,
        name: "",
        iopId: "",
        iops: [],
        iopList: [],
        codeList: [],
        item: [],
        msg: "",
        level: "",
        timeLimit: ""
      };
      this.getIopGroups();
    },
    async handleSubmit() {
      const _this = this;
      const { name, id, item, msg, level, timeLimit } = this.formItem;
      for (let k = 0, l = item.length; k < l; k++) {
        this.formItem.iops = this.formItem.iops.concat(item[k].iop);
      }
      const iops = this.formItem.iops;
      try {
        // const addRes = await addCodeGroup({
        //   name,
        //   id,
        //   iops,
        //   msg,
        //   level,
        //   timeLimit
        // });
        _this.$Message.success("此页面仅供参考");
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getCodeGroups();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getCodeGroups();
    this.getIopGroups();
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
