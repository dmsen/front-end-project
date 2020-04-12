<template>
  <Card :dis-hover="true">
    <p>我的菜单</p>
    <Row style="margin-left:30px">
      <i-col :xs="12" :md="8" :lg="4" v-for="i in existList" :key="i.meta">
        <div class="box">
          <div class="box_close" style="z-index: 9999">
            <Poptip
              confirm
              :transfer="true"
              title="你确定要移除这个项目?"
              @on-ok="handleClose(i)"
              @on-cancel="cancelClose"
            >
              <img class="close_icon" src="../../assets/images/menuConfig/close.png">
            </Poptip>
          </div>
          <img class="box_img" :src="i.imgUrl">
          <p class="box_title">{{i.title}}</p>
        </div>
      </i-col>
    </Row>
    <Divider></Divider>
    <p>不常用菜单</p>
    <Row style="margin-left:30px">
      <i-col v-for="i in addList" :key="i.title" :xs="12" :md="8" :lg="4">
        <div class="box">
          <div class="box_close" style="z-index: 9999">
            <Poptip
              confirm
              :transfer="true"
              title="你确定要添加这个项目?"
              @on-ok="handleAdd(i)"
              @on-cancel="cancelClose"
            >
              <img class="close_icon" src="../../assets/images/menuConfig/add.png">
            </Poptip>
          </div>
          <img class="box_img" :src="i.imgUrl">
          <p class="box_title">{{i.title}}</p>
        </div>
      </i-col>
    </Row>
  </Card>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      menuList: [
        {
          title: "数据分析",
          meta: "analysis",
          imgUrl: require("../../assets/images/menuConfig/line-chart.png")
        },
        {
          title: "监测点管理",
          imgUrl: require("../../assets/images/menuConfig/range.png"),
          meta: "iop"
        },
        {
          title: "实时监控",
          imgUrl: require("../../assets/images/menuConfig/monitor.png"),
          meta: "monitor"
        },
        {
          title: "故障维修",
          imgUrl: require("../../assets/images/menuConfig/maintain.png"),
          meta: "repair"
        },
        {
          title: "个人中心",
          imgUrl: require("../../assets/images/menuConfig/userManage.png"),
          meta: "user"
        },
        {
          title: "异常报警",
          imgUrl: require("../../assets/images/menuConfig/abnormal.png"),
          meta: "alarm"
        },
        {
          title: "档案管理",
          imgUrl: require("../../assets/images/menuConfig/archive.png"),
          meta: "archive"
        },
        {
          title: "在线专家",
          imgUrl: require("../../assets/images/menuConfig/expert.png"),
          meta: "expert"
        },
        {
          title: "设备管理",
          imgUrl: require("../../assets/images/menuConfig/set.png"),
          meta: "mac"
        }
      ],
      addList: [],
      existList: []
    };
  },
  methods: {
    ...mapActions(["removeItem", "addItem"]),
    handleAdd(i) {
      const { meta } = i;
      this.addItem({ meta });
    },
    handleClose(i) {
      const { meta } = i;
      this.removeItem({ meta });
    },
    cancelClose() {
      this.$Message.info("您取消了操作");
    },
    menuReady() {
      if (sessionStorage.getItem("analysisMenuLand")) {
        this.addList.push(this.menuList[0]);
      } else {
        this.existList.push(this.menuList[0]);
      }
      if (sessionStorage.getItem("iopMenuLand")) {
        this.addList.push(this.menuList[1]);
      } else {
        this.existList.push(this.menuList[1]);
      }
      if (sessionStorage.getItem("monitorMenuLand")) {
        this.addList.push(this.menuList[2]);
      } else {
        this.existList.push(this.menuList[2]);
      }
      if (sessionStorage.getItem("repairMenuLand")) {
        this.addList.push(this.menuList[3]);
      } else {
        this.existList.push(this.menuList[3]);
      }
      if (sessionStorage.getItem("userMenuLand")) {
        this.addList.push(this.menuList[4]);
      } else {
        this.existList.push(this.menuList[4]);
      }
      if (sessionStorage.getItem("alarmMenuLand")) {
        this.addList.push(this.menuList[5]);
      } else {
        this.existList.push(this.menuList[5]);
      }
      if (sessionStorage.getItem("archiveMenuLand")) {
        this.addList.push(this.menuList[6]);
      } else {
        this.existList.push(this.menuList[6]);
      }
      if (sessionStorage.getItem("expertMenuLand")) {
        this.addList.push(this.menuList[7]);
      } else {
        this.existList.push(this.menuList[7]);
      }
      if (sessionStorage.getItem("macMenuLand")) {
        this.addList.push(this.menuList[8]);
      } else {
        this.existList.push(this.menuList[8]);
      }
    }
  },
  beforeMount() {
    this.menuReady();
  }
};
</script>
<style lang="less" scoped>
@import "./power.less";
</style>
