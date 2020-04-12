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
    <Row class="loginForm" >
      <i-col span="18" offset="4">
        <Row style="min-width: 640px; max-width: 640px;">
          <i-col span="5">
            <div id="three"></div>
          </i-col>
          <i-col span="19" v-show="showLogin">
            <div class="formContext" id="login">
              <h3 style="font-size: 30px;color: #515151;margin-top: 11px;">霖</h3>
              <Poptip trigger="hover" content="请输入账号">
                <Input class="inputStyle" v-model="userName"/>
              </Poptip>
              <Row >
                <i-col span="14" style="display: inline">
                  <!--<Input placeholder="default size"  v-model="password" style="margin: 10px 10px 10px 40px;width: 220px">-->
                  <!--</Input>-->
                  <Input
                          style="margin: 10px 10px 10px 40px;width: 282px"
                          type="password"
                          v-model="password"
                          search
                          enter-button="登录"
                          @on-search="handleClickLogin"
                  />
                </i-col>
                <i-col span="8" style="float: right">
                  <Button style="margin: 11px 0 10px 0;"  type="success" @click="registerVue">注册</Button>
                </i-col>
              </Row>
              <Poptip trigger="hover" content="请输入登陆方式">
              <Select v-model="optionLevel" style="width:200px;" placeholder="请输入登陆方式">
                <Option :value="0" :key="0">lin</Option>
                <Option :value="1"   :key="1">访客登陆</Option>
                <Option :value="2"  :key="2">已存库用户登陆</Option>
              </Select>
              </Poptip>
              <!--<Rate :value="1" :count = "1" character="直接登陆即可"/>-->
            </div>
          </i-col>
        </Row>
      </i-col>
    </Row>
    <Row class="registerForm" v-show="showRegister">
      <i-col span="18" offset="6">
        <Row style="min-width: 640px; max-width: 640px;">
          <!--<i-col span="5">-->
            <!--<div id="three1"></div>-->
          <!--</i-col>-->
          <i-col span="19" style="margin-top: 20%;position: absolute">
            <Form :model="formItem" ref="formItem" :label-width="80" :rules="rules" style=" position: absolute;top: 14%;left: 20%;">
              <FormItem  prop="name" class="formItemStyle" >
                <Input prefix="ios-person" v-model="formItem.name" class="formItemInputStyle"    placeholder="用户名"/>
              </FormItem>
              <FormItem  prop="password" class="formItemStyle">
                <Input
                        prefix="ios-key"
                        v-model="formItem.password"
                        type="password"
                        class="formItemInputStyle"
                        placeholder="密码"
                />
              </FormItem>
              <FormItem  prop="pwdCheck" class="formItemStyle">

                <Input
                        prefix="ios-key"
                        v-model="formItem.pwdCheck"
                        type="password"
                        class="formItemInputStyle"
                        placeholder="确认密码"
                />
              </FormItem>
              <!--<FormItem  prop="role" class="formItemStyle">-->
                <!--<Input prefix="ios-contacts" v-model="formItem.role" class="formItemInputStyle" placeholder="职位"/>-->
              <!--</FormItem>-->
              <FormItem  prop="jurisdiction" class="formItemStyle">
                <Select v-model="formItem.jurisdiction" class="formItemInputStyle" placeholder="hahah">
                  <Option :value="-1" :key="-1" disabled>职位</Option>
                  <!--<Option :value="0" :key="0">最高管理员</Option>-->
                  <Option :value="1" :key="1">管理员</Option>
                  <Option :value="2" :key="2">用户</Option>
                  <Option  :value="3" :key="3">游客</Option>
                </Select>
              </FormItem>
              <FormItem prop="status" class="formItemStyle">
                <Select v-model="formItem.status" class="formItemInputStyle">
                  <Option :value="-1" disabled>是否离职</Option>
                  <Option :value="0">在职</Option>
                  <Option :value="1">离职</Option>
                </Select>
              </FormItem>
              <FormItem  prop="remark" class="formItemStyle">
                <Input prefix="md-remove" v-model="formItem.remark" class="formItemInputStyle" placeholder="备注"/>
              </FormItem>
              <Button style="margin: -5px 0 10px 100px;" type="primary" @click="handleSubmit">注册</Button>
              <Button style="margin: -5px 0 10px 5px;" type="default" @click="loginVue">取消</Button>
            </Form>

          </i-col>
        </Row>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { addHutUser } from "@/api/user.js";
import { magicCube,clearDON } from "./magicCube.js";
export default {
  data() {
      let pwdValidate = (rule, value, callback) => {
          if (value === "") {
              callback(new Error("密码不能为空"));
          } else {
              callback();
          }
      };
      let pwdCheckValidate = (rule, value, callback) => {
          if (this.formItem.password !== "" && value === "") {
              callback(new Error("密码不能为空"));
          } else if (this.formItem.password !== value) {
              this.$Message.error("两次密码不一致");
              callback(new Error("两次密码不一致"));
          } else {
              callback();
          }
      };
    return {
        handleUser: false,
        rules: {
            password: [
                { required: false, validator: pwdValidate, trigger: "blur" }
            ],
            pwdCheck: [
                { required: false, validator: pwdCheckValidate, trigger: "blur" }
            ]
        },
        formItem: {
            isAdd: true,
            id: "",
            name: "",
            password: "",
            pwdCheck: "",
            jurisdiction: -1,
            status: -1,
            remark: "",
            role: ""
        },
        showLogin:true,
        showRegister:false,
      userName: "lin",
      password: "lin",
      optionLevel:0
    };
  },
  methods: {
      async handleSubmit() {
          const _this = this;
          const {
              jurisdiction,
              name,
              password,
              remark,
              status
          } = this.formItem;
          console.log(  jurisdiction,
              name,
              password,
              remark,
              status);
          try {
              if(jurisdiction === -1 || status === -1){
                  _this.$Message.error("职位或状态必填")
              }
              else {
                      const addRes = await addHutUser({
                          jurisdiction,
                          name,
                          password,
                          remark,
                          status
                      });
                      // console.log(addRes);
                      if(addRes.data.result === 1)
                      {
                          _this.$Message.error(addRes.data.msg);

                      }else {
                          _this.$Message.success("添加成功");
                          _this.showLogin = true;
                          _this.showRegister = false;
                          _this.userName = name;
                          _this.password = password;
                          _this.optionLevel = 2;
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
            console.log(err);
          _this.$Message.error("登陆失败，请刷新重试");
        }
      } else {
        // 判断登陆次数锁定用户
      }
    },
      registerVue(){
        this.showLogin = false;
        this.showRegister = true;
          // clearDON();
        // magicCube( "three1");
      },
      loginVue(){
          this.showLogin = true;
          this.showRegister = false;
          this.formItem = {
              isAdd: true,
              id: "",
              name: "",
              password: "",
              pwdCheck: "",
              jurisdiction: 1,
              status: "",
              remark: "",
              role: ""
          };
          this.userName = 'lin';
          this.password = 'lin';
          this.optionLevel = 0;
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
