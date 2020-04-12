<template>
  <div>
    <Card dis-hover>
      <Row>
        <i-col span="20" offset="2">
          <Card>
            <!--<Divider  style="font-size: 25px">通用量程配置</Divider>-->
            <Form :modal="configForm">
              <FormItem label="机器编号">
                <Select
                  v-model="configForm.machineId"
                  placeholder="请输入机器名称"
                  @on-change="getPhysicName"
                  label-in-value
                  filterable
                  multiple
                >
                  <Option
                    v-for="i in machineLists"
                    :value="i.machineId"
                    :key="i.machineId"
                  >{{i.machineName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="查询类型" v-if="!!configForm.machineId">
                <Select v-model="configForm.physicalName" filterable>
                  <Option
                    v-for="(i,index) in physicalNameLists"
                    :value="i.id"
                    :key="index"
                  >{{i.physicalName}}</Option>
                </Select>
              </FormItem>
              <div>
                <div v-show="!configForm.physicalName">
                  <p>请选择相应的机器和监测点</p>
                </div>
                <FormItem label="输入量程">
                  <Row>
                    <i-col span="10"><Input style="margin-top: 3px"  v-model="configForm.min" placeholder="请输入最小值"/></i-col>
                    <i-col span="4"></i-col>
                    <i-col span="10">
                      <i-input style="margin-top: 3px"  v-model="configForm.max"  placeholder="请输入最大值">
                      </i-input>
                    </i-col>
                  </Row>
                </FormItem>
                <FormItem label="计算模式"  >
                  <Select v-model="configForm.method" >
                    <Option value="0" >0</Option>
                    <Option value="1" >1</Option>
                  </Select>
                </FormItem>
                <FormItem label="校准值">
                  <i-input style="margin-top: 3px"  v-model="configForm.num" placeholder="">
                  </i-input>
                </FormItem>
                <Button slot="append"  size="large" type="primary" >配置</Button>
              </div>
            </Form>
          </Card>
        </i-col>

      </Row>
    </Card>
  </div>
</template>
<script>
  import { getIopConfigs } from "@/api/gateway.js";
  import { getMachines } from "@/api/equipment.js";
  import { errMessage } from "@/api/index.js";
  export default {
    data () {
      return {
        machineLists: [],
        physicalNameLists: [],
        configForm:{
          machineId:[],
          physicalName:'',
          max:'',
          min:'',
          method:'',
          num:''
        },
      }
    },
    methods: {
      async handleGetEquipment() {
        try {
          const res = await getMachines();
          for (let i = 0; i < res.data.msg.length; i++) {
            this.machineLists.push(res.data.msg[i]);
          }
        } catch (err) {
          console.log(err);
        }
      },
      getPhysicName(value) {
        this.configForm.physicalName = "";
        this.handleGetIopConfigs(value.value);
      },
      async handleGetIopConfigs(id) {
        let that = this;
        this.physicalNameLists = [];
        try {
          const res = await getIopConfigs({ id });
          for (let i = 0; i < res.data.msg.length; i++) {
            that.physicalNameLists.push(res.data.msg[i]);
          }
        } catch (err) {
          console.log(err);
        }
      },
    },
    created () {
      this.handleGetEquipment();
    }
  }
</script>

<style lang="less">
</style>
