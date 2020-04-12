<style lang="less" scoped>
@import "./login.less";
</style>

<template>
  <div id="particleBackground">
    <vue-particles
      style="height: 100%;"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <Row class="loginForm">
      <i-col span="18" offset="4">
        <Row style="min-width: 640px; max-width: 640px;">
          <i-col span="5">
            <div id="three"></div>
          </i-col>
          <i-col span="19">
            <div class="formContext" id="login">
              <h3 style="font-size: 30px;color: #515151;margin-top: 11px;">霖</h3>
              <Poptip trigger="focus" content="请输入账号">
                <Input class="inputStyle" v-model="userName"/>
              </Poptip>
              <Poptip trigger="focus" content="请输入密码">
                <Input
                  class="inputStyle"
                  type="password"
                  v-model="password"
                  search
                  enter-button="登录"
                  @on-search="handleClickLogin"
                />
              </Poptip>
              <!--<Poptip trigger="hover" content="请输入登陆方式">-->
              <!--<Select v-model="optionLevel" style="width:200px" placeholder="请输入登陆方式">-->
                <!--<Option value="0">lin</Option>-->
                <!--<Option value="1" >访客登陆</Option>-->
                <!--<Option value="2">已存库用户登陆</Option>-->
              <!--</Select>-->
              <!--</Poptip>-->
              <!--<Rate :value="1" :count = "1" character="直接登陆即可"/>-->
            </div>
          </i-col>
        </Row>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { magicCube } from "./magicCube.js";
export default {
  data() {
    return {
      userName: "lin",
      password: "lin",
      optionLevel:0
    };
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    async handleClickLogin() {
      const { userName, password,optionLevel } = this;
      const loginRes = await this.handleLogin({ userName, password,optionLevel });
      console.log("++++")
      console.log(loginRes)
      if (loginRes === "success") {
        const _this = this;
        try {
          await _this.getUserInfo();
          _this.$router.push({
            name: this.$config.homeName
          });
          _this.$Message.success("登陆成功");
        } catch (err) {
            console.log(err)
          _this.$Message.error("登陆失败，请刷新重试");
        }
      } else {
        // 判断登陆次数锁定用户
      }
    },
    pageInit() {
      const id = "three";
      magicCube(id);
    }
  },
  mounted() {
    this.pageInit();
  }
};
</script>
