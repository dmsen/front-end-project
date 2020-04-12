<template>
  <Card shadow style="height: 100%;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="zoom-box">
        <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
      </div>
      <div class="view-box">
        <org-view
          v-if="data"
          :data="data"
          :zoom-handled="zoomHandled"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
  </Card>
</template>

<script>
import OrgView from "./components/org-view.vue";
import ZoomController from "./components/zoom-controller.vue";
import { getOrgData } from "@/api/data";
const menuDic = {
  edit: "编辑",
  detail: "查看",
  new: "新增",
  delete: "删除"
};
export default {
  name: "org_tree_page",
  components: {
    OrgView,
    ZoomController
  },
  data() {
    return {
      data: {
        id: 0,
        label: "真·公司",
        children: [
          {
            id: 2,
            label: "产品研发部",
            children: [
              {
                id: 9,
                label: "设计"
              },
              {
                id: 10,
                label: "产品经理"
              }
            ]
          },
          {
            id: 3,
            label: "项目开发",
            children: [
              {
                id: 7,
                label: "前端开发",
                children: [
                  {
                    id: 7,
                    label: "曾·程序猿(我)"
                  }
                ]
              },
              {
                id: 8,
                label: "后端开发",
                  children: [
                      {
                          id: 9,
                          label: "曾·程序猿(我)"
                      }
                  ]
              }
            ]
          },
          {
            id: 4,
            label: "财务部"
          },
          {
            id: 11,
            label: "人事部"
          }
        ]
      },
      zoom: 100
    };
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100;
    }
  },
  methods: {
    setDepartmentData(data) {
      data.isRoot = true;
      return data;
    },
    handleMenuClick({ data, key }) {
      this.$Message.success({
        duration: 5,
        content: `点击了《${data.label}》节点的'${menuDic[key]}'菜单`
      });
    },
    getDepartmentData() {
      // getOrgData().then(res => {
      //   const { data } = res;
      //   this.data = data;
      // });
    }
  },
  mounted() {
    this.getDepartmentData();
  }
};
</script>

<style lang="less">
@import "./mechanism.less";
</style>
