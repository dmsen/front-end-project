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
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddGwIop">增加监测点</Button>
      </Col>
      <Col span = "10" offset = "6">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>
    <Card v-if="handleGwIop" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" ref="formItem" :label-width="120" class="form">
            <FormItem label="选择设备" prop="macId">
              <Select v-model="formItem.macId" style="width: auto">
                <Option v-for="i in macList" :value="i.id" :key="i.id">{{ i.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择网关" prop="gwId">
              <Select v-model="formItem.gwId" style="width: auto" >
                <Option v-for="i in gwList" :value="i.id" :key="i.id">{{ i.name }}</Option>
              </Select>
            </FormItem>
            <!--<FormItem label="选择网关" prop="gwId">-->
              <!--<Select v-model="formItem.gwId" style="width: auto" @on-change="handleChooseGwId">-->
                <!--<Option v-for="i in gwList" :value="i.id" :key="i.id">{{ i.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <!--<FormItem label="选择接入点" prop="iop" v-show="handleChooseGw">-->
              <!--<Select v-model="formItem.iop" style="width: auto">-->
                <!--<Option v-for="i in iopList" :value="i.name" :key="i.id">{{ i.name }}</Option>-->
              <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="自定义监测点名称" prop="name">
              <Input v-model="formItem.name" :disabled="!formItem.isAdd" style="width: auto"/>
            </FormItem>
            <FormItem label="最小量程" prop="minRange">
              <Input v-model="formItem.minRange" style="width: auto"/>
            </FormItem>
            <FormItem label="最大量程" prop="maxRange">
              <Input v-model="formItem.maxRange" style="width: auto"/>
            </FormItem>
            <FormItem label="校准值" prop="aline">
              <Input v-model="formItem.aline" style="width: auto"/>
            </FormItem>
            <FormItem label="计算方式" prop="computedWay">
              <Select v-model="formItem.computedWay" style="width: auto">
                <Option :value="0">/10</Option>
                <Option :value="1">4-20MA计算</Option>
                <Option :value="2">/100</Option>
                <Option :value="3">/1000</Option>
              </Select>
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
  addGwIopConfig,
  changeGwIopConfig,
  deleteGwIopConfig,
  getGwIopConfigs,
  getGwIops,
  getUnUseGws,
  getUnUseIops
} from "@/api/gateway.js";
import { getMachines } from "@/api/equipment.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      dataLength:0,
      currentPages:1,
      handleGwIop: false,
      handleChooseGw: false,
      macList: [],
      gwList: [],
      iopList: [],
      formItem: {
        isAdd: true,
        id: "",
        macId: "",
        gwId: "",
        iop: "",
        name: "",
        minRange: "",
        maxRange: "",
        aline: "",
        computedWay: ""
      },
      columns: [
        { title: "设备", key: "macName" },
        { title: "网关", key: "gwId" },
        // { title: "接入点", key: "iop" },
        { title: "监测点名称", key: "name" },
        { title: "最小量程", key: "minRange" },
        { title: "最大量程", key: "maxRange" },
        { title: "校准值", key: "aline" },
        { title: "计算方式", key: "computedWay", searchable: false },
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
                        this.showChangeGwIop(params);
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
        this.getGwIops();
    },
    async handleDelete(params) {
      const _this = this;
      const id = this.tableData[params.index].id;
      try {
        const deleteRes = await deleteGwIopConfig({ id });
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
      this.getGwIops();
    },
    async getMacs() {
      try {
        const list = await getMachines();
        for (let _i = 0, length = list.data.msg.length; _i < length; _i++) {
          this.macList.push({
            id: list.data.msg[_i].machineId,
            name: list.data.msg[_i].machineName
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
    async getIops(gw) {
      try {
        const list = await getUnUseIops({ gw });
        this.iopList = [];
        for (let _i = 0, length = list.data.msg.length; _i < length; _i++) {
          this.iopList.push({
            id: "gw" + _i,
            name: list.data.msg[_i]
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
    async getGws() {
      try {
        const list = await getUnUseGws();
        console.log(list)
        for (let _i = 0, length = list.data.length; _i < length; _i++) {
          this.gwList.push({
            id: list.data[_i].gatewayId,
            name: list.data[_i].gatewayName
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
    async getGwIops() {
      try {
        const sendPage = this.currentPages;
        const list = await getGwIopConfigs(sendPage);
        console.log(list)
        this.tableData = [];
        this.dataLength = list.data.allDateLength;
        for (let i = 0, length = list.data.msg.length; i < length; i++) {
          this.tableData.push({
            id: list.data.msg[i].configId,
            macId: list.data.msg[i].machineId,
            macName: list.data.msg[i].machineName,
            gwId: list.data.msg[i].gwId,
            iop: list.data.msg[i].iop,
            name: list.data.msg[i].physicalName,
            minRange: list.data.msg[i].minLC,
            maxRange: list.data.msg[i].maxLC,
            aline: list.data.msg[i].aline,
            computedWay: list.data.msg[i].method
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
    handleChooseGwId(param) {
      this.getIops(param);
      this.handleChooseGw = true;
    },
    showAddGwIop() {
      this.handleGwIop = true;
    },
    showChangeGwIop(param) {
      this.formItem.isAdd = false;
      const {
        id,
        macId,
        gwId,
        iop,
        name,
        minRange,
        maxRange,
        aline,
        computedWay
      } = this.tableData[param.index];
      this.formItem.macId = macId;
      this.formItem.id = id;
      this.formItem.iop = iop;
      this.formItem.gwId = gwId;
      this.formItem.name = name;
      this.formItem.minRange = minRange;
      this.formItem.maxRange = maxRange;
      this.formItem.aline = aline;
      this.formItem.computedWay = computedWay;
      this.handleGwIop = true;
    },
    handleCancel() {
      this.handleGwIop = false;
      this.formItem = {
        isAdd: true,
        id: "",
        macId: "",
        gwId: "",
        iop: "",
        name: "",
        minRange: "",
        maxRange: "",
        aline: "",
        computedWay: ""
      };
    },
    async handleSubmit() {
      const _this = this;
      const {
        isAdd,
        id,
        macId,
        gwId,
        // iop,
        name,
        minRange,
        maxRange,
        aline,
        computedWay
      } = this.formItem;
      try {
        if (isAdd) {
          const addRes = await addGwIopConfig({
            gwId,
            macId,
            // iop,
            name,
            minRange,
            maxRange,
            aline,
            computedWay
          });
            if(addRes.data.result === 0)
            {
                _this.$Message.success("添加成功");
            }
            else {
                _this.$Message.error(addRes.data.msg);
            }
        } else {
          const changeRes = await changeGwIopConfig({
            id,
            gwId,
            macId,
            // iop,
            minRange,
            maxRange,
            aline,
            computedWay
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
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getGwIops();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getGwIops();
    this.getMacs();
    this.getGws();
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
