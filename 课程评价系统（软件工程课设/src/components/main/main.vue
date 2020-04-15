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
        <Modal v-model="badgeModal" title="通知"   width="600px">
          <div style="width: 600px;margin-left: 250px;font-weight: bold;font-size: 15px" v-show="noticeNone">
            暂无通知
          </div>
          <div v-show="noticeHave">
            <!--<Card v-for="(item,i) in noticeItem" :key=i>-->
              <!--用户名{{item.byPerson}}: 内容{{item.content}}:时间{{formateDate(item.time)}}-->
              <!---->
            <!--</Card>-->
            <Collapse accordion >
              <Panel  v-for="(item,i) in noticeItem" :key=i :hide-arrow="true">
                <span style="font-weight: bold">用户名：{{item.byPerson}} </span><span style="float: right">{{formateDate(item.time)}}</span>
                <!--<p slot="content">{{item.content}}</p>-->
                <div  slot="content" style="margin-bottom: 5px" >
                  <p style="word-break: break-all">
                    {{item.content}}
                    <Button style="float: right;margin-right: -15px;"  @click="readNotice(item.hutNoticeId)">标记已读</Button>
                  </p>

                </div>
              </Panel>

            </Collapse>
            <Row style="margin-top: 16px">
              <Col span="24">
                <Button type="primary" @click="readEdNotice"> 查看已读消息</Button>
                <Button type="primary" @click="getNoticeFuntion" style="margin-left: 10px"> 查看未读消息</Button>
                <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="3" @on-change="changePages" show-total style="float: right;margin-top: 10px"/>
              </Col>
              <!--<Col span = "10" offset = "3"   >-->
              <!--<Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="3" @on-change="changePages" show-total/>-->
              <!--</Col>-->
            </Row>
          </div>

          <div slot="footer">
            <span style="margin-right: 12px">若有问题请联系管理员</span>
          </div>
        </Modal>
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <Badge  :offset=bOffset overflow-count="99" :count=badgeCount>
           <a href="#" @click="showBadgeModal"> <Icon type="ios-notifications-outline" size="26"></Icon></a>
          </Badge>
          <user :user-avator="userAvator" />
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
            <!--<tags-nav-->
              <!--:value="$route"-->
              <!--@input="handleClick"-->
              <!--:list="tagNavList"-->
              <!--@on-close="handleCloseTag"-->
            <!--/>-->
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
        dataLength:0,
        currentPages:1,
        noticeItem:null,
        noticeNone:false,
        noticeHave:false,
        badgeModal:false,
        badgeCount:0,
        bOffset:[15,-5],
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
      return  'http://127.0.0.1:8000/media/' + this.$store.state.user.avatorImgPath;
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
      changePages(val){
          this.currentPages =  val;
          this.getNoticeFuntion()
      },
      /**
       * 时间格式化，将时间格式转成字符串
       */
      formateDate(datetime) {
          // let  = "2019-11-06T16:00:00.000Z"
          function addDateZero(num) {
              return (num < 10 ? "0" + num : num);
          }
          let d = new Date(datetime);
          let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
          return formatdatetime;
      },
      ...mapActions(["handGetNotice","handReadNotice","handReadEdNotice"]),
      async readEdNotice(){
          const _this = this;
          const sendPage = this.currentPages;
          _this.noticeItem = null;
          try {
              const userId = _this.$store.state.user.userId;
              const Res = await _this.handReadEdNotice(
                  {userId,sendPage}
              );
              console.log(Res);
              if(Res.result === 1)
              {
                  _this.badgeCount = 0

              }else {
                  _this.noticeItem = Res.msg;
                  _this.badgeCount = Res.allDateLength;
                  _this.dataLength = Res.allDateLength;
              }

          } catch (err) {
              _this.$Message.error("未知错误"+err)
          }
      },
      async readNotice(id){
          const _this = this;
          try {
              const Res = await _this.handReadNotice(
                  {id}
              );
              console.log(Res);
              if(Res.result === 1)
              {
               _this.$Message.error("发生错误，请稍后再试")
              }else {
                  _this.$Message.success("操作成功");
                  _this.getNoticeFuntion()
              }

          } catch (err) {
              _this.$Message.error("未知错误"+err)
          }
      },
     showBadgeModal(){
          let that =this;
         if(that.noticeItem === null){
             that.noticeNone = true;
             that.badgeModal = true;
             that.noticeHave = false;
         }else {
             that.badgeModal = true;
             that.noticeNone = false;
             that.noticeHave = true;
             that.getNoticeFuntion()
         }
      },
      async getNoticeFuntion(){
          const _this = this;
          const sendPage = this.currentPages;
          _this.noticeItem = null;
          try {
              const userId = _this.$store.state.user.userId;
              const Res = await _this.handGetNotice(
                  {userId,sendPage}
              );
              console.log(Res);
              if(Res.result === 1)
              {
                  _this.badgeCount = 0

              }else {
                  _this.noticeItem = Res.msg;
                  _this.badgeCount = Res.allDateLength;
                  _this.dataLength = Res.allDateLength;
              }

          } catch (err) {
              _this.$Message.error("未知错误"+err)
          }
      },
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    ...mapActions(["handleLogin"]),
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

  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.getNoticeFuntion();
    // this.showModal = this.$store.state.showModal;
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
