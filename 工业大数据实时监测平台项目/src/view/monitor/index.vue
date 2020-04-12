<template>
  <div>
    <!-- <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>-->
    <Row>
      <i-col :xs="18" :md="12" :lg="6" v-for="(i,index) in machineList" :key="index">
        <Card
          :bordered="false"
          :shadow="false"
          style="margin:5px"
          @click.native="handleClick(i.name,i.id)"
        >
          <div class="boxBorder">
            <Row>
              <i-col span="8" offset="2">
                <img class="spinnerNormal" src="../../assets/images/monitor/2.png">
              </i-col>
              <i-col span="14">
                <Tag type="dot" color="success">{{i.name}}</Tag>
                <!-- <Button style="display: inline;margin-right: 5px" type="default" size="small">维修记录</Button>
                <Button type="primary" size="small">历史记录</Button>-->
              </i-col>
              <i-col span="24">
                <div>
                  <Divider dashed/>
                  <p>机器名称: <span class="spanStyle">{{i.name}}</span></p>
                  <p>机器型号:<span class="spanStyle">{{i.machType}}</span> </p>
                  <p>机器生产时间: <span class="spanStyle">{{i.date}}</span></p>
                  <p>办事处:<span class="spanStyle">{{i.office}}</span> </p>
                  <p>所属客户:<span class="spanStyle">{{i.customer}}</span> </p>
                </div>
              </i-col>
            </Row>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { getMachines } from "@/api/equipment.js";
import { errMessage } from "@/api/index.js";
import { stampToDate } from "@/libs/tools.js";
export default {
  components: {
    InforCard,
    CountTo
  },
  data() {
    return {
      spinShow: true,
      inforCardData: [
        {
          title: "新增用户",
          icon: "md-person-add",
          count: 803,
          color: "#2d8cf0"
        },
        { title: "累计点击", icon: "md-locate", count: 232, color: "#19be6b" },
        {
          title: "新增问答",
          icon: "md-help-circle",
          count: 142,
          color: "#ff9900"
        },
        { title: "分享统计", icon: "md-share", count: 657, color: "#ed3f14" },
        {
          title: "新增互动",
          icon: "md-chatbubbles",
          count: 12,
          color: "#E46CBB"
        },
        { title: "新增页面", icon: "md-map", count: 14, color: "#9A66E4" }
      ],
      machineList: []
    };
  },
  methods: {
    async getMachines() {
      try {
        const {
          data: { msg }
        } = await getMachines();
        this.machineList = [];
        for (let i = 0, l = msg.length; i < l; i++) {
          this.machineList.push({
            id: msg[i].machineId,
            name: msg[i].machineName,
            machType: msg[i].machTypeName,
            office: msg[i].office,
            date: stampToDate(msg[i].dateOfProduct),
            customer: msg[i].customerName
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
    handleClick(name, id) {
      this.$store.commit("setGeneralChoose", true);
      this.$store.commit("setMachId", id);
      this.$router.push("/monitor/borad");
    }
  },
  beforeMount() {
    this.getMachines();
  }
};
</script>

<style lang="less">
@import "./monitor.less";
.count-style {
  font-size: 50px;
}
.titleNormal {
  font-size: 28px;
  margin-top: -44px;
}
</style>
