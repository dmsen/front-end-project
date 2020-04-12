<template>
  <Layout style="height: 100%" class="main">
    <Sider
      hide-trigger
      collapsible
      :width="220"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      :style="{overflow: 'hidden'}"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <div class="logo-con">
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo">-->
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" style="width: 200px;height: 75px;margin-top: -6px">
          <img v-show="collapsed" :src="minLogo" key="min-logo">
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
          <language
            v-if="$config.useI18n"
            @on-lang-change="setLocal"
            style="margin-right: 10px;"
            :lang="local"
          />
          <error-store
            v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
            :has-read="hasReadErrorPage"
            :count="errorCount"
          ></error-store>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          <img
            style="height: 80px;width:300px;margin-top: 0;margin-right: 10px"
            src="../../assets/images/lin_max_log.png"
          >
          <!--<img-->
            <!--style="height: 36px;margin-top: 14px;margin-right: 15px;"-->
            <!--src="../../assets/images/main/logo_title.png"-->
          <!--&gt;-->
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import ABackTop from "./components/a-back-top";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import ErrorStore from "./components/error-store";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, getNextRoute, routeEqual } from "@/libs/util";
import minLogo from "@/assets/images/lin.png";
import maxLogo from "@/assets/images/lin_max_log.png";
import "./main.less";
import Tables from "_c/tables";
import { Message } from "iview";
export default {
  name: "Main",
  components: {
    Tables,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data() {
    return {
      columns: [
        { title: "编号", key: "customerId", sortable: true },
        { title: "客户名称", key: "customerName", editable: true },
        { title: "客户类型", key: "customerType", editable: true },
        { title: "客户等级", key: "customerLevel", edittable: true },
        { title: "负责人", key: "sponsor", editable: true },
        { title: "联系方式", key: "phone", editable: true },
        { title: "地址", key: "address", editable: true },
        { title: "备注", key: "remark", editable: true },
        { title: "设备数", key: "machCount", editable: true },
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
                        // this.showCustomerChangeModal(params)
                      }
                    }
                  },
                  "处理"
                )
              ]);
            }
          ]
        }
      ],
      tableData: [],
      collapsed: localStorage.getItem("collapseLand") == "true" ? true : false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      showWarnModal: false,
      count: 100,
      errorMessage: 20
    };
  },
  computed: {
    ...mapGetters(["errorCount"]),
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return  'http://112.74.59.53/media/' + this.$store.state.user.avatorImgPath;
    },
    cacheList() {
      return this.tagNavList.length
        ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
        : [];
    },
    menuList() {
      return this.$store.getters.menuList;
    },
    local() {
      return this.$store.state.app.local;
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage;
    }
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    ...mapActions(["handleLogin"]),
    initWebSocket() {
      this.socketApi.sendSock("3:", this.getSocketVal);
    },
    getSocketVal(e) {
      // if (typeof e != Object) {
      //   if (e > 0) {
      //     this.$Message.error({
      //       duration: 1,
      //       content: "当前有异常数据！！！共" + e + "条"
      //     });
      //   }
      // }
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type === "all") {
        this.turnToPage(this.$config.homeName);
      } else if (routeEqual(this.$route, route)) {
        if (type !== "others") {
          const nextRoute = getNextRoute(this.tagNavList, route);
          this.$router.push(nextRoute);
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    },
    handleClickWarn() {
      this.showWarnModal = true;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    },
    collapsed(val, newVal) {
      localStorage.setItem("collapseLand", !newVal);
    }
  },
  beforeMount() {
    // this.initWebSocket();
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.addTag({
      route: this.$store.state.app.homeRoute
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      });
    }
  },
  destroyed() {}
};
</script>
