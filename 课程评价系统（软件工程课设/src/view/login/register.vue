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
    <Row class="registerForm">
      <i-col span="18" offset="4">
        <Row style="min-width: 640px; max-width: 640px;">
          <i-col span="5">
            <div id="three"></div>
          </i-col>
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
                <FormItem  prop="role" class="formItemStyle">
                  <Input prefix="ios-contacts" v-model="formItem.role" class="formItemInputStyle" placeholder="职位"/>
                </FormItem>
                <FormItem  prop="jurisdiction" class="formItemStyle">
                  <Select v-model="formItem.jurisdiction" class="formItemInputStyle" placeholder="hahah">
                    <Option :value="-1" :key="-1" disabled>权限等级</Option>
                    <Option :value="0" :key="0">0</Option>
                    <Option :value="1" :key="1">1</Option>
                    <Option :value="2" :key="2">2</Option>
                    <Option  :value="3" :key="3">3</Option>
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
                <Button style="margin: -5px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
              </Form>

          </i-col>
        </Row>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { magicCube,clearDON } from "./magicCube.js";
export default {
  data() {
    return {
      handleUser: false,
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
      userName: "lin",
      password: "lin",
      optionLevel:'0'
    };
  },
  methods: {
      async handleSubmit() {
          const _this = this;
          const {
              isAdd,
              id,
              jurisdiction,
              name,
              password,
              remark,
              role,
              status
          } = this.formItem;
          try {
              if (isAdd) {
                  const addRes = await addUser({
                      jurisdiction,
                      name,
                      password,
                      remark,
                      role,
                      status
                  });
                  console.log(addRes)
                  if(addRes.data.result === 1)
                  {
                      _this.$Message.error(addRes.data.msg);

                  }else {
                      _this.$Message.success("添加成功");
                  }
              } else {
                  const changeRes = await changeUser({
                      id,
                      jurisdiction,
                      name,
                      password,
                      remark,
                      role,
                      status
                  });
                  if(changeRes.data.result === 1)
                  {
                      _this.$Message.error(changeRes.data.msg);

                  }else {
                      _this.$Message.success("修改成功");
                  }
              }
          } catch (err) {
              if (err.response !== undefined) {
                  errMessage(err.response.status);
              } else {
                  errMessage(1);
              }
          }
          this.getUsers();
          this.handleCancel();
      },
      handleCancel() {
          this.handleUser = false;
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

<style scoped>
  .formItemStyle >>> .ivu-form-item-label{
    color: #2931ff;
    font-weight: bold;
    font-size:16px
  }
</style>