<template>
  <Card :bordered="false" :shadow="true">
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
      @on-save-edit="handleClickChange"
    />
    <Button style="margin: 10px 5px 10px 0;" type="default" @click="showAddModal">增加维修单</Button>
    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    <Page :current="1" :total="50" simple style="margin: 10px 0;float: right;"/>
    <Card :bordered="false" :shadow="false" v-show="addModal">
      <Form :label-width="80">
        <FormItem label="设备id">
          <Input type="text" v-model="addForm.id"/>
        </FormItem>
        <FormItem label="机器编号">
          <Input type="text" v-model="addForm.macId"/>
        </FormItem>
        <FormItem label="维修单号">
          <Input type="text" v-model="addForm.rName"/>
        </FormItem>
        <FormItem label="描述">
          <Input type="text" v-model="addForm.desc"/>
        </FormItem>
      </Form>
      <Button style="margin: 10px 5px 10px 0;" type="primary">增加维修单</Button>
      <Button style="margin: 10px 5px 10px 0;" type="default" @click="hideAddModal">取消</Button>
    </Card>
  </Card>
</template>
<script>
import Tables from '_c/tables';
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
	components: {
    Tables
  },
  data() {
  	return {
      addModal: false,
      addForm: {
        id: '',
        macId: '',
        rName: '',
        desc: '',
      },
  		columns: [
        {title: '设备id', key: 'id', sortable: true},
        {title: '机器编号', key: 'macId', editable: true},
        {title: '维修单号', key: 'rName', editable: true},
        {title: '描述', key: 'desc', edittable: true},
      ],
      tableData: []

  	}
  },
  computed: mapState({
    warehouseList: state => state.archive.warehouseList
  }),
  methods: {
    ...mapMutations([
      'changeWarehouseList'
    ]),
    ...mapActions([
      'deleteWarehouse',
      'changeWarehouse'
    ]),
    //修改某一行数据
    async handleClickChange(params) {
      let paramsObj = this.tableData[params.index]
      console.log(paramsObj)
      console.log(params.index, params.column.key, params.value)
      try {
        await this.changeWarehouse({ params });
      } catch(err) {
        this.$Message.error('修改失败!')
      }
    },
    //删除操作
  	async handleDelete(params) {
      const res = await this.deleteWarehouse({ params })
    },
    //展示增加客户表单
    showAddModal() {
      this.addModal = true
    },
    //隐藏增加客户表单
    hideAddModal() {
      this.addForm = {
        id: '',
        macId: '',
        rName: '',
        desc: '',
      }
      this.addModal = false
    },
    pageReady() {
      //获取表单数据
    },
    //导出为csv文件
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  created() {
  }
}
</script>
