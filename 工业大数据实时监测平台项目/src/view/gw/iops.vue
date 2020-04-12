<template>
  <div>
    <Card :dis-hover="true">
      <tree-table
        expand-key="type"
        :expand-type="false"
        :selectable="false"
        :columns="columns"
        :data="val"
      ></tree-table>

        <Rate :value="1" :count = "1" character="此页面仅供参考" />

      <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddIops">增加监控点组</Button>
      <Button style="margin: 10px 0 10px 5px;" type="error" @click="showDeleteIops">删除监控点组</Button>
      <Card v-if="handleAdd" :dis-hover="true">
        <Row>
          <i-col span="16">
            <Form :label-width="120" class="form">
              <FormItem label="监测组名称" prop="name">
                <Input v-model="name" style="width: auto"/>
              </FormItem>
              <FormItem
                v-for="(item, index) in items"
                v-show="item.status"
                :key="index"
                label="配置监测点"
              >
                <Row>
                  <i-col span="9">
                    <Select v-model="item.mac" placeholder="选择机器" @on-change="handleClick(item)">
                      <Option v-for="i in macList" :key="i.id" :value="i.id">{{i.name}}</Option>
                    </Select>
                  </i-col>
                  <i-col span="9" offset="1">
                    <Select v-model="item.iops" multiple v-show="item.click">
                      <Option v-for="i in item.iopList" :key="i.id" :value="i.id">{{i.name}}</Option>
                    </Select>
                  </i-col>
                  <i-col span="4" offset="1">
                    <Button @click="handleRemove(index)">删除</Button>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem>
                <Button type="dashed" @click="handleAddItem" icon="md-add">新增机器</Button>
              </FormItem>
              <Button style="margin: 10px 0 10px 100px;" type="primary" @click="handleSubmit">确认添加</Button>
              <Button style="margin: 10px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
            </Form>
          </i-col>
        </Row>
      </Card>
      <Card v-if="handleDelete" :dis-hover="true">
        <Form :label-width="160" class="form">
          <FormItem label="请选择要删除的监测点组">
            <Select v-model="deleteId">
              <Option v-for="i in val" :key="i.id" :value="i.id">{{i.name}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button style="margin: 10px 0 10px 5px;" type="primary" @click="handleSubmitDelete">确认删除</Button>
            <Button style="margin: 10px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
          </FormItem>
        </Form>
      </Card>
    </Card>
  </div>
</template>
<script>
import { errMessage } from "@/api/index.js";
import { getMachines } from "@/api/equipment.js";
import {
  getIopGroups,
  deleteIopGroup,
  getMacConfigs,
  getIopConfigs,
  addIopGroup,
  // getGwIopConfigs
} from "@/api/gateway.js";
export default {
  data() {
    return {
      handleAdd: false,
      handleDelete: false,
      deleteId: "",
      macList: [],
      columns: [
        {
          title: "名字",
          key: "name",
          width: "250px"
        },
        {
          title: "类型",
          key: "type",
          minWidth: "50px"
        }
      ],
      val: [],
      name: "",
      items: [
        {
          index: 1,
          mac: "",
          click: false,
          iopList: [],
          iops: [],
          status: 1
        }
      ]
    };
  },
  methods: {
    async getIopGroups() {
      try {
          const  pdata = await getIopGroups()
        const {
          data: { msg }
        } = await getIopGroups();
        console.log(pdata)
        this.val = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.val.push({
            id: msg[i].iopGroupId,
            name: msg[i].iopGroupName,
            type: "监测点组",
            children: []
          });
          for (
            let j = 0, arr = Object.keys(msg[i].gwsWithIOPs), l = arr.length;
            j < l;
            j++
          ) {
            this.val[i].children.push({
              name: arr[j],
              type: "机器",
              children: []
            });
            for (let z = 0, l = msg[i].gwsWithIOPs[arr[j]].length; z < l; z++) {
              this.val[i].children[j].children.push({
                name: msg[i].gwsWithIOPs[arr[j]][z],
                type: "监测点"
              });
            }
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
    async getMacConfigs() {
      const _this = this;
      try {
        // const {
        //   data: { msg }
        // } = await getMacConfigs();
        const dataLists =  await getMachines();
        console.log(dataLists)
        for (let _i = 0, l = dataLists.data.msg.length; _i < l; _i++) {
          this.macList.push({
            id: dataLists.data.msg[_i].machineId.toString(),
            name: dataLists.data.msg[_i].machineName
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
    showAddIops() {
      this.handleAdd = true;
    },
    showDeleteIops() {
      this.handleDelete = true;
    },
    async handleSubmit() {
      const _this = this;
      try {
        // let req = {
        //   iopGroupName: this.name,
        //   gwsWithIOPs: {}
        // };
        // for (let i = 0, l = this.items.length; i < l; i++) {
        //   if (this.items[i].status === 0) {
        //   } else {
        //     req.gwsWithIOPs[this.items[i].mac] = this.items[i].iops;
        //   }
        // }
        // const res = await addIopGroup({ req });
        _this.$Message.success("此页面仅供参考");
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getIopGroups();
    },
    async handleSubmitDelete() {
      const _this = this;
      try {
        const id = this.deleteId;
        // const res = await deleteIopGroup({ id });
        this.$Message.success("此页面仅供参考");
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getIopGroups();
    },
    handleCancel() {
      this.handleAdd = false;
      this.handleDelete = false;
      this.items = [
        {
          index: 1,
          mac: "",
          click: false,
          iopList: [],
          iops: [],
          status: 1
        }
      ];
      this.macList = [];
    },
    handleRemove(index) {
      this.items[index].status = 0;
    },
    handleAddItem() {
      this.key++;
      this.items.push({
        index: this.key,
        mac: "",
        click: false,
        iopList: [],
        iops: [],
        status: 1
      });
    },
    async handleClick(i) {
      try {
        const id = i.mac;
        const {
          data: { msg }
        } = await getIopConfigs({ id });
        for (let _i = 0, l = msg.length; _i < l; _i++) {
          i.iopList.push({
            id: msg[_i].id,
            name: msg[_i].physicalName
          });
        }
        i.click = true;
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    }
  },
  beforeMount() {
    this.getIopGroups();
    this.getMacConfigs();
  }
};
</script>

<style lang="less" scoped>
</style>
