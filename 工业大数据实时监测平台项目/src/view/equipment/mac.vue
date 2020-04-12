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
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddMachine">增加设备</Button>
      </Col>
      <Col span = "10" offset = "6">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>
    <Card v-if="handleMachine" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" :label-width="80" class="form">
            <FormItem label="设备名称" prop="name">
              <Input v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="类型编号" prop="code">
              <Select v-model="formItem.code" style="width: auto">
                <Option
                  v-for="i in macTypes"
                  :key="i.machTypeCode"
                  :value="i.machTypeCode"
                >{{i.machTypeName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="设备描述" prop="desc">
              <Input v-model="formItem.desc" style="width: auto"/>
            </FormItem>
            <FormItem label="生产日期" prop="date">
              <DatePicker
                type="date"
                v-model="formItem.date"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: auto"
              ></DatePicker>
            </FormItem>
            <FormItem label="所属客户" prop="customer">
              <Select v-model="formItem.customer" style="width: auto">
                <Option
                  v-for="i in customers"
                  :key="i.customerId"
                  :value="i.customerId"
                >{{i.customerName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="办事处" prop="office">
              <Input v-model="formItem.office" style="width: auto"/>
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
  getMachines,
  addMachine,
  deleteMachine,
  changeMachine
} from "@/api/equipment.js";
import { errMessage } from "@/api/index.js";
import { stampToDate } from "@/libs/tools.js";
import { getMacTypes } from "@/api/equipment.js";
import { getCustomers } from "@/api/files.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      dataLength:0,
      currentPages:1,
      handleMachine: false,
      macTypes: [],
      customers: [],
      formItem: {
        isAdd: true,
        id: "",
        name: "",
        code: "",
        desc: "",
        date: "",
        customer: "",
        office: ""
      },
      columns: [
        { title: "设备名称", key: "name" },
        { title: "类型", key: "codeName" },
        { title: "设备描述", key: "desc" },
        { title: "生产日期", key: "date" },
        { title: "所属客户", key: "customerName" },
        { title: "办事处", key: "office" },
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
                        this.showChangeMachine(params);
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
        this.getMachines();
    },
    async getMacTypes() {
      try {
        const macTypes = await getMacTypes();
        console.log(macTypes)
        this.macTypes = macTypes.data.msg;
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    async getCustomers() {
      try {
        const customers = await getCustomers();
        this.customers = customers.data.msg;
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
      const id = this.tableData[params.index].id;
      try {
        const deleteRes = await deleteMachine({ id });
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
      this.getMachines();
    },
    async getMachines() {
      try {
        const sendPage = this.currentPages;
        let machineList = await getMachines(sendPage);
        console.log(machineList)
        this.dataLength = machineList.data.allDateLength;
        this.tableData = [];
        for (let i = 0, length = machineList.data.msg.length; i < length; i++) {
          this.tableData.push({
            name: machineList.data.msg[i].machineName,
            code: machineList.data.msg[i].machTypeCode,
            codeName: machineList.data.msg[i].machTypeId,
            desc: machineList.data.msg[i].machineDesc,
            date: stampToDate(machineList.data.msg[i].dateOfProduct, "year"),
            customer: machineList.data.msg[i].customerId,
            customerName: machineList.data.msg[i].customerName,
            office: machineList.data.msg[i].office,
            id: machineList.data.msg[i].machineId
          });
        }
      } catch (err) {
          console.log(err)
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    },
    showAddMachine() {
      this.handleMachine = true;
    },
    showChangeMachine(param) {
      this.formItem.isAdd = false;
      const { id, name, code, desc, date, customer, office } = this.tableData[
        param.index
      ];
      this.formItem.name = name;
      this.formItem.code = code;
      this.formItem.desc = desc;
      this.formItem.id = id;
      this.formItem.date = date;
      this.formItem.customer = customer;
      this.formItem.office = office;
      this.handleMachine = true;
    },
    handleCancel() {
      this.handleMachine = false;
      this.formItem = {
        isAdd: true,
        id: "",
        name: "",
        password: "",
        pwdCheck: "",
        jurisdiction: 1,
        status: "",
        remark: "",
        role: ""
      };
    },
    async handleSubmit() {
      const _this = this;
      let {
        isAdd,
        name,
        id,
        code,
        desc,
        date,
        customer,
        office
      } = this.formItem;
      date = date.valueOf();
      try {
        if (isAdd) {
          const addRes = await addMachine({
            name,
            code,
            desc,
            date,
            customer,
            office
          });
          console.log(addRes)
            if(addRes.data.result === 1)
            {
                _this.$Message.error(addRes.data.msg);

            }else {
                _this.$Message.success("添加成功");
            }
        } else {
          const changeRes = await changeMachine({
            name,
            id,
            code,
            desc,
            date,
            customer,
            office
          });
            if(changeRes.data.result === 1)
            {
                _this.$Message.error(changeRes.data.msg);

            }else {
                _this.$Message.success("修改成功");
            }
        }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
        errMessage(err.response.status);
      }
      this.getMachines();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getMachines();
    this.getMacTypes();
    this.getCustomers();
  }
};
</script>

<style lang="less" scoped>
#formImg {
  height: 408px;
  width: 100%;
  border-radius: 8px;
  padding: 0 0 -12px 0;
  opacity: 0.75;
}
</style>
