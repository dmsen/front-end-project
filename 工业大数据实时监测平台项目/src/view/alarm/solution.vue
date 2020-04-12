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
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddScheme">增加解决方案</Button>
      </Col>
      <Col span = "10" offset = "6">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>


    <Card v-if="handleScheme" :dis-hover="true">
      <Row>
        <i-col span="17">
          <Form :model="formItem" ref="formItem" :label-width="130" class="form">
            <FormItem label="解决方案名称" prop="name">
              <Input v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="解决方案详情" prop="detail">
              <Input v-model="formItem.detail" style="width: auto"/>
            </FormItem>
            <FormItem label="适用异常码/组合码">
              <Select v-model="formItem.codes" multiple style="width: auto">
                <!--<Option v-for="(i,index) in formItem.list" :key="index" :value="i.code">{{i.name}}</Option>-->
                <Option v-for="(i,index) in formItem.list" :key="index" :value="i.name">{{i.name}}</Option>
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
  addScheme,
  getScheme,
  deleteScheme,
  changeScheme,
  getCodes,
  getCodeGroups
} from "@/api/alarm.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
    return {
      dataLength:0,
      currentPages:1,
      handleScheme: false,
      formItem: {
        isAdd: true,
        id: "",
        name: "",
        detail: "",
        list: [],
        codes: []
      },
      columns: [
        { title: "名称", key: "name" },
        { title: "描述", key: "detail" },
        { title: "适用异常码/组合码", key: "list" },
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
                ),
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
                        this.showChangeScheme(params);
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
        this.currentPages =  val;
        this.getScheme();
    },
    async handleDelete(params) {
      const _this = this;
      const id = this.tableData[params.index].id;
      try {
        const deleteRes = await deleteScheme({ id });
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
      this.getScheme();
    },
    async getScheme() {
      try {
        const sendPage = this.currentPages;
        const dataLists =  await getScheme(sendPage);
        console.log(dataLists)
        this.dataLength = dataLists.data.allDateLength;
        this.tableData = [];
        for (let i = 0, l = dataLists.data.msg.length; i < l; i++) {
          this.tableData.push({
            id: dataLists.data.msg[i].alarmSolutonId,
            name: dataLists.data.msg[i].alarmSolutonName,
            detail: dataLists.data.msg[i].alarmSolutonDetail,
            list: dataLists.data.msg[i].alarmCodeList
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
    async getCode() {
      try {
        const {
          data: { msg }
        } = await getCodes();
        this.formItem.list = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.formItem.list.push({
            code: msg[i].alarmCode,
            name: msg[i].alarmName
          });
        }
        const res = await getCodeGroups();
        const codeGroup = res.data.msg;
        for (let i = 0, l = codeGroup.length; i < l; i++) {
          this.formItem.list.push({
            code: codeGroup[i].alarmCode,
            name: codeGroup[i].alarmGroupName
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
    showAddScheme() {
      this.handleScheme = true;
    },
    showChangeScheme(param) {
      this.formItem.isAdd = false;
      const { id, detail, name, list } = this.tableData[param.index];
      this.formItem.name = name;
      this.formItem.id = id;
      this.formItem.detail = detail;
      this.handleScheme = true;
    },
    handleCancel() {
      this.handleScheme = false;
      this.formItem = {
        isAdd: true,
        id: "",
        name: "",
        detail: "",
        list: []
      };
      this.getCode();
    },
    async handleSubmit() {
      const _this = this;
      const { isAdd, id, detail, name, codes } = this.formItem;
      try {
        if (isAdd) {
          const addRes = await addScheme({
            detail,
            name,
            codes
          });
          if(addRes.data.result === 0)
          {
              _this.$Message.success("添加成功");
          }
          else {
              _this.$Message.error(addRes.data.msg);
          }
        } else {
          const changeRes = await changeScheme({
            id,
            detail,
            name,
            codes
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
      this.getScheme();
      this.handleCancel();
    },
    handleChoose(param) {
      this.$store.commit("setSolution", this.tableData[param.index]);
      this.$store.commit("setCurrent", 2);
      this.$router.push("/alarm/process");
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getScheme();
    this.getCode();
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
