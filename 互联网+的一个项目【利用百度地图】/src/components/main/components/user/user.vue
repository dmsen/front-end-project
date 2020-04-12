<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" >
      <Avatar :src="userAvator" size="large"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list"  style="font-weight: bold">
         <Dropdown placement="right-start"  >
          <DropdownItem name="changeTheme" >更换系统主题</DropdownItem>
          <DropdownMenu slot="list" >
            <DropdownItem @click.native="handleChangeTheme('dark')">
                <Icon type="md-snow" style="color: #666;margin-right: 10px" :size="18"/>dark
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('blue')">
                <Icon type="md-snow" style="color: #001529;margin-right: 10px" :size="18"/>blue
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('light')">
                <Icon type="md-snow" style="color: #19be6b;margin-right: 10px" :size="18"/>light
            </DropdownItem>
            <DropdownItem @click.native="handleChangeTheme('pink')">
                <Icon type="md-snow" style="color: #ffa3d5;margin-right: 10px" :size="18"/>pink
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <DropdownItem name="changeInfo" style="margin-top: -20px !important">更改个人信息</DropdownItem>

        <DropdownItem name="logout" style="text-align: center">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

      <Modal v-model="showModal" title="更改个人信息"   width="600px">
          <div>
              <Tabs value="1">
                  <TabPane label="基本设置" name="1">
                      <div>
                          <Form>
                              <FormItem label="用户名">
                                  <Input v-model="userInfo.userName" />
                              </FormItem>
                              <FormItem label="密码">
                                  <Input v-model="userInfo.password" type="password" />
                              </FormItem>
                              <!--<FormItem label="权限">-->
                                  <!--<Select v-model="userInfo.jurisdiction">-->
                                      <!--&lt;!&ndash;<Option :value="0" :key="0">最高管理员</Option>&ndash;&gt;-->
                                      <!--<Option :value="1" :key="1">管理员</Option>-->
                                      <!--<Option :value="2" :key="2">用户</Option>-->
                                      <!--<Option  :value="3" :key="3">游客</Option>-->
                                  <!--</Select>-->
                              <!--</FormItem>-->
                              <FormItem prop="status" label="状态">
                                  <Select v-model="userInfo.status" class="formItemInputStyle">
                                      <Option :value="0">在校</Option>
                                      <Option :value="1">离校</Option>
                                  </Select>
                              </FormItem>
                              <!--<FormItem label="权限等级">-->
                                  <!--<Select v-model="userInfo.role">-->
                                      <!--<Option value="游客"></Option>-->
                                      <!--<Option value="子管理员"></Option>-->
                                      <!--<Option value="职工"></Option>-->
                                  <!--</Select>-->
                              <!--</FormItem>-->
                              <FormItem label="备注">
                                  <Input prefix="md-remove" v-model="userInfo.remark" placeholder="备注"/>
                              </FormItem>
                          </Form>
                          <p style="text-align: center"> <Button  type="primary" @click="handleSubmit">提交更改</Button></p>
                      </div>

                  </TabPane>
                  <TabPane label="头像" name="2">
                      <div class="cropper-example cropper-first">
                          <cropper :src="exampleImageSrc" crop-button-text="确认上传" @on-crop="handleCroped"></cropper>
                      </div>

                  </TabPane>

              </Tabs>


          </div>
          <div slot="footer">
              <span style="margin-right: 12px">请确认账号密码填写完整</span>
          </div>
      </Modal>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
import Cropper from "@/components/cropper";
// import { changeUserTou,updataUser } from "@/api/user.js";
// import changeUserTou from  "@/api/user.js";
// import { getUserId } from "../../../../libs/util";
// import { updataUser } from "../../../../api/user.js";
export default {
  name: "User",
    components: {
        Cropper
    },
    data(){
      return{
          exampleImageSrc: "http://127.0.0.1:8000/user/modeTou",
          showModal:false,
          // userInfo: {
          //     userName: "",
          //     password: "",
          //     pwdCheck: "",
          //     role: "",
          //     remark: ""
          // },
          userInfo: {
              userName: '',
              password: '',
              jurisdiction:2,
              status:0,
              remark:''
          },
      }
    },
  props: {
    userAvator: {
      type: String,
      default: ""
    }
  },
  methods: {
    ...mapActions(["handleLogOut","handPersonchange","UserTouChange"]),
      async handleCroped(blob) {
          const  _this = this;
          // console.log(blob)
          console.log("修改头像")
          console.log(this.$store.state.user.userId,this.$store.state.user.userName);
          const userId = this.$store.state.user.userId;
          const userName = this.$store.state.user.userName;
          const formData = new FormData();
          formData.append('croppedImg', blob);
          formData.append('userId', userId);
          formData.append('userName', userName);
          const res = await _this.UserTouChange(formData);
          console.log(res)
          if(res.result === 1){
              _this.$Message.error(res.msg)
          }else {
              _this.$Message.success({
                  content: res.msg + '头像修改成功',
                  duration: 3
              });
              this.handleLogOut().then(() => {
                  this.$router.push({
                      name: "login"
                  });
              });
              window.location.reload()
          }
          // uploadImg(formData).then(() => {
          //   this.$Message.success('Upload success~')
          // })
          // console.log(value);

          // console.log(this.exampleImageSrc);
          // const exampleImageSrc = this.exampleImageSrc;
          // const res = await changeUserTou({
          // id,
          // name,
          // password,
          // remark,
          // role,
          //     exampleImageSrc:exampleImageSrc
          // });

          // this.$Message.warning("头像上传暂未开放");
          // const formData = new FormData();
          // formData.append("croppedImg", blob);
          // uploadImg(formData).then(res => {
          //   // this.imgUrl = "http://47.97.117.142:18080" + res.data.data;
          //   // this.$Message.success("图片上传成功");
          // });
      },
      async handleSubmit() {
          const _this = this;
          const id = _this.$store.state.user.userId;
          try {
              // const id = await getUserId();
              const name = this.userInfo.userName;
              const password = this.userInfo.password;
              const status = this.userInfo.status;
              const remark = this.userInfo.remark;
              const res = await _this.handPersonchange({
                  id,
                  name,
                  password,
                  remark,
                  status
              });
              console.log(res);
              if(res.result ===1){
                  _this.$Message.error(res.msg);
              }else {
                  _this.$Message.success(res.msg);
              }
          } catch (err) {
              console.log(err)
              if (err.response !== undefined) {
                  this.$Message.error(err.response.status);
              } else {
                  this.$Message.error(err);
              }
          }
          this.handleLogOut().then(() => {
              this.$router.push({
                  name: "login"
              });
          });
          window.location.reload()
      },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
            });
          });
          break;
        case "changeInfo":
            this.showModal = true;
          break;
        case "changeTheme":
          break;
      }
    },
    handleChangeTheme(theme) {
        localStorage.themeStyle = theme;
        window.location.reload()
        // this.$router.replace({
        //     name: this.$config.homeName
        // });
      // this.$store.commit("handleChangeTheme", theme);
    }
  }
};
</script>
