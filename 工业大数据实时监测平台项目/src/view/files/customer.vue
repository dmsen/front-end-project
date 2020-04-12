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
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddCustomer">增加客户</Button>
      </Col>
      <Col span = "10" offset = "6">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>


    <Card v-if="handleCustomer" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" ref="formItem" :label-width="80" class="form">
            <FormItem label="客户名称" prop="name">
              <Input v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="客户类型" prop="type">
              <Input v-model="formItem.type" style="width: auto"/>
            </FormItem>
            <FormItem label="客户等级" prop="level">
              <Select v-model="formItem.level" style="width: auto">
                <Option :value="1">高级</Option>
                <Option :value="2">中级</Option>
                <Option :value="3">普通</Option>
              </Select>
            </FormItem>
            <FormItem label="负责人" prop="person">
              <Input v-model="formItem.person" style="width: auto"/>
            </FormItem>
            <FormItem label="联系方式" prop="phone">
              <Input v-model="formItem.phone" style="width: auto"/>
            </FormItem>
            <FormItem label="地址" prop="address">
              <Input v-model="formItem.address" style="width: auto"/>
            </FormItem>
            <FormItem label="设备数量" prop="count">
              <Input v-model="formItem.count" style="width: auto"/>
            </FormItem>
            <FormItem label="备注" prop="remark">
              <Input v-model="formItem.remark" style="width: auto"/>
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
  addCustomer,
  deleteCustomer,
  changeCustomer,
  getCustomers
} from "@/api/files.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
        dataLength:0,
        currentPages:1,
      handleCustomer: false,
      formItem: {
        isAdd: true,
        id: "",
        name: "",
        type: "",
        level: "",
        person: "",
        phone: "",
        address: "",
        count: "",
        remark: ""
      },
      columns: [
        { title: "客户名称", key: "name" },
        { title: "客户类型", key: "type" },
        { title: "级别", key: "level" },
        { title: "负责人", key: "person" },
        { title: "联系方式", key: "phone" },
        { title: "地址", key: "address" },
        { title: "设备数量", key: "count" },
        { title: "备注", key: "remark" },
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
                        this.showChangeCustomer(params);
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
          console.log(this.currentPages)
          this.getCustomers();
      },
    async handleDelete(params) {
      const _this = this;
      const id = this.tableData[params.index].id;
      try {
        const deleteRes = await deleteCustomer({ id });
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
      this.getCustomers();
    },
    async getCustomers() {
      try {
        const sendPage = this.currentPages;
        const customerList = await getCustomers(sendPage);
        console.log(customerList)
        this.tableData = [];
        this.dataLength = customerList.data.allDateLength;
        for (
          let i = 0, length = customerList.data.msg.length;
          i < length;
          i++
        ) {
          this.tableData.push({
            id: customerList.data.msg[i].customerId,
            name: customerList.data.msg[i].customerName,
            type: customerList.data.msg[i].customerType,
            level:
              customerList.data.msg[i].customerLevel === 1
                ? "高级"
                : customerList.data.msg[i].customerLevel === 2
                ? "中级"
                : "普通",
            person: customerList.data.msg[i].sponsor,
            phone: customerList.data.msg[i].phone,
            address: customerList.data.msg[i].address,
            count: customerList.data.msg[i].machCount,
            remark: customerList.data.msg[i].remark
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
    showAddCustomer() {
      this.handleCustomer = true;
    },
    showChangeCustomer(param) {
      this.formItem.isAdd = false;
      const {
        id,
        name,
        type,
        level,
        person,
        phone,
        address,
        count,
        remark
      } = this.tableData[param.index];
      this.formItem.id = id;
      this.formItem.name = name;
      this.formItem.type = type;
      this.formItem.level = level == "高级" ? 1 : level == "中级" ? 2 : 3;
      this.formItem.person = person;
      this.formItem.phone = phone;
      this.formItem.address = address;
      this.formItem.count = count;
      this.formItem.remark = remark;
      this.handleCustomer = true;
    },
    handleCancel() {
      this.handleCustomer = false;
      this.formItem = {
        isAdd: true,
        id: "",
        name: "",
        type: "",
        level: "",
        person: "",
        phone: "",
        address: "",
        count: "",
        remark: ""
      };
    },
    async handleSubmit() {
      const _this = this;
      const {
        isAdd,
        id,
        name,
        type,
        level,
        person,
        phone,
        address,
        count,
        remark
      } = this.formItem;
      try {
        if (isAdd) {
          const addRes = await addCustomer({
            name,
            type,
            level,
            person,
            phone,
            address,
            count,
            remark
          });
            if(addRes.data.result === 0)
            {
                _this.$Message.success("添加成功");
            }
            else {
                _this.$Message.error(addRes.data.msg);
            }
        } else {
          const changeRes = await changeCustomer({
            id,
            name,
            type,
            level,
            person,
            phone,
            address,
            count,
            remark
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
      this.getCustomers();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getCustomers();
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
