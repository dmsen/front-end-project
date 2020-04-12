<template>
  <div>
    <Card dis-hover>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
      />
      <Row>
        <i-col span="2">
          <Button style="margin: 10px 0;" @click="exportExcel">导出</Button>
        </i-col>
        <i-col span="2">
          <Button style="margin: 10px 0;" @click="addBusiness" type="primary">新增</Button>
        </i-col>
        <i-col span="6" offset="16">
          <Page style="margin: 10px 0" :current="current" :total="total" simple/>
        </i-col>
      </Row>
      <br>
    </Card>
    <Card dis-hover v-if="showAddBusiness" style="margin-top: 30px">
      <Steps :current="0">
        <Step title="受理"></Step>
        <Step title="派工"></Step>
        <Step title="到达签到"></Step>
        <Step title="报完工"></Step>
        <Step title="配件核销"></Step>
        <Step title="审核"></Step>
        <Step title="回访"></Step>
        <Step title="结束"></Step>
      </Steps>
      <br>
      <Divider>新增维修单</Divider>
      <br>
      <Form :model="formItem" :label-width="80">
        <FormItem label="客户资料">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">客户名称</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">客户编号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">客户类别</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">客户等级</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">联系人</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">联系人电话</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">报修人</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">报修电话</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">要求到达日期</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="客户设备">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">设备编号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">设备名称</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">设备类型</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">机器型号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">出厂日期</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">开机日期</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">保修政策</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">保修截止日期</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">设备位置</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">服务区域</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="受理信息">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">维修单号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">维修类型</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">付款方式</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">服务费用</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">已收金额</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">未收金额</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">故障描述</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">保修截止日期</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">设备位置</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">服务区域</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="维修信息">
          <Row>
            <i-col span="24">
              <i-input v-model="formItem.input">
                <span slot="prepend">故障现象</span>
              </i-input>
            </i-col>
            <i-col span="24">
              <i-input v-model="formItem.input">
                <span slot="prepend">故障原因</span>
              </i-input>
            </i-col>
            <i-col span="24">
              <i-input v-model="formItem.input">
                <span slot="prepend">处理方法</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">是否维修换件</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">旧件返厂编号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">配件销售单号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">到达时间</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">到达地点</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="审核信息">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">审核状态</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">故障级别</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="回访信息">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">回访状态</span>
              </i-input>
            </i-col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">提交维修单</Button>
          <Button style="margin-left: 8px" type="error" @click="cancelAddBusiness">取消</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
export default {
  name: "business",
  data() {
    return {
      showAddBusiness: false,
      formItem: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      },
      columns: [
        { title: "流程状态", key: "a" },
        { title: "维修单号", key: "b" },
        { title: "机器型号", key: "c" },
        { title: "设备编码", key: "d" },
        { title: "维修类型", key: "e" },
        { title: "付款方式", key: "f" },
        { title: "服务费用", key: "g" },
        { title: "故障描述", key: "h" },
        { title: "故障级别", key: "i" },
        { title: "处理方法", key: "j" },
        { title: "工程师", key: "k" },
        { title: "客户名称", key: "l" },
        { title: "客户编码", key: "m" },
        { title: "客户等级", key: "n" },
        { title: "联系方式", key: "o" },
        { title: "报修截止日期", key: "p" },
        { title: "是否换件", key: "q" }
      ],
      tableData: [],
      //分页
      current: 1,
      total: 50
    };
  },
  components: {
    Tables
  },
  methods: {
    doAbnormal(params) {
      this.$store.state.equipmentAbnormal.abnormalInfo = this.tableData[params];
      this.$router.push("/faultManagement/maintain/maintainDiagnosis");
    },
    addBusiness() {
      this.showAddBusiness = true;
    },
    cancelAddBusiness() {
      this.showAddBusiness = false;
    },
    handleSubmit() {
      console.log("提交维修单");
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
        noHeader: true
      });
    }
  }
};
</script>

<style scoped>
</style>
