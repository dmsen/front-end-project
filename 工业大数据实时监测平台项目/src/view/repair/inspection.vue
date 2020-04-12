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
        <Step title="发起"></Step>
        <Step title="派工"></Step>
        <Step title="到达签到"></Step>
        <Step title="报完工"></Step>
        <Step title="审核"></Step>
        <Step title="回访"></Step>
        <Step title="结束"></Step>
      </Steps>
      <br>
      <Divider>新增巡检单</Divider>
      <br>
      <Form :model="formItem" :label-width="80">
        <FormItem label="巡检信息">
          <Row>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">巡检单号</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">计划巡检日期</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">巡检地址</span>
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
            <i-col span="24">
              <i-input v-model="formItem.input">
                <span slot="prepend">巡检内容</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">指派工程师</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">派工备注</span>
              </i-input>
            </i-col>
            <i-col span="24">
              <i-input v-model="formItem.input">
                <span slot="prepend">巡检结果</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">巡检工作单时间</span>
              </i-input>
            </i-col>
            <i-col span="8">
              <i-input v-model="formItem.input">
                <span slot="prepend">到达地点</span>
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
  name: "inspect",
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
        { title: "客户联系人电话", key: "a" },
        { title: "审核时间", key: "b" },
        { title: "完工时间", key: "c" },
        { title: "流程状态", key: "d" },
        { title: "受理时间", key: "e" },
        { title: "到达地点", key: "f" },
        { title: "到达时间", key: "g" },
        { title: "巡检单号", key: "h" },
        { title: "巡检地址", key: "i" },
        { title: "巡检联系人", key: "j" },
        { title: "巡检电话", key: "k" },
        { title: "巡检内容", key: "l" },
        { title: "巡检结果", key: "m" },
        { title: "工程师", key: "n" },
        { title: "客户名称", key: "o" },
        { title: "客户编码", key: "p" },
        { title: "客户类别", key: "q" },
        { title: "客户等级", key: "r" },
        { title: "客户联系人", key: "s" },
        { title: "计划巡检日期", key: "t" },
        { title: "审核状态", key: "u" },
        { title: "派工时间", key: "v" },
        { title: "回访备注", key: "w" },
        { title: "回访状态", key: "x" }
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
