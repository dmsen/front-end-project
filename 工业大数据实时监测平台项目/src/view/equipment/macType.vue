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
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddMacType">增加设备类型</Button>
      </Col>
      <Col span = "10" offset = "6">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>


    <Card v-if="handleMacType" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" ref="formItem" :label-width="80" class="form">
            <FormItem label="类型名称" prop="name">
              <Input prefix="ios-person" v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="类型描述" prop="detail">
              <Input prefix="ios-contacts" v-model="formItem.detail" style="width: auto"/>
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
  addMacType,
  deleteMacType,
  changeMacType,
  getMacTypes
} from "@/api/equipment.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      dataLength:0,
      currentPages:1,
      handleMacType: false,
      formItem: {
        isAdd: true,
        id: "",
        name: "",
        detail: ""
      },
      columns: [
        { title: "类型编号", key: "id" },
        { title: "设备类型", key: "name" },
        { title: "描述", key: "detail" },
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
                        this.showChangeMacType(params);
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
          this.getMacTypes();
      },
    async handleDelete(params) {
      const _this = this
      const id = this.tableData[params.index].machTypeId;
      try {
        const deleteRes = await deleteMacType({ id });
        console.log(deleteRes)
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
      this.getMacTypes();
    },
    async getMacTypes() {
      try {
        const sendPage = this.currentPages;
        const macTypeList = await getMacTypes(sendPage);
        console.log(macTypeList)
        this.dataLength = macTypeList.data.allDateLength;
        this.tableData = [];
        for (let i = 0, length = macTypeList.data.msg.length; i < length; i++) {
          this.tableData.push({
            id: macTypeList.data.msg[i].machTypeCode,
            name: macTypeList.data.msg[i].machTypeName,
            detail: macTypeList.data.msg[i].machTypeDesc,
              machTypeId:macTypeList.data.msg[i].machTypeId
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
    showAddMacType() {
      this.handleMacType = true;
    },
    showChangeMacType(param) {
      this.formItem.isAdd = false;
      const { machTypeId, detail, name } = this.tableData[param.index];
      console.log(this.tableData[param.index])
      this.formItem.name = name;
      this.formItem.id = machTypeId;
      this.formItem.detail = detail;
      this.handleMacType = true;
    },
    handleCancel() {
      this.handleMacType = false;
      this.formItem = {
        isAdd: true,
        id: "",
        name: "",
        detail: ""
      };
    },
    async handleSubmit() {
      const _this = this;
      const { isAdd, id, detail, name } = this.formItem;
      try {
        if (isAdd) {
          const addRes = await addMacType({
            detail,
            name
          });
          console.log(addRes)
            if(addRes.data.result === 1)
            {
                _this.$Message.error(addRes.data.msg);

            }else {
                _this.$Message.success("添加成功");
            }
        } else {
          const changeRes = await changeMacType({
            id,
            detail,
            name
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
      }
      this.getMacTypes();
      this.handleCancel();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getMacTypes();
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
