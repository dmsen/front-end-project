<template>
  <Card :dis-hover="true">
    <Tabs value="1">
      <TabPane label="基本设置" name="1">
        <Row>
          <i-col span="6">
            <p class="textTitle">更新我的信息</p>
            <Form :model="userInfo" ref="userInfo" :label-width="80" :rules="rules">
              <FormItem label="用户名" prop="userName">
                <Input v-model="userInfo.userName" style="width: auto"/>
              </FormItem>
              <FormItem label="修改密码" prop="password">
                <Input v-model="userInfo.password" type="password" style="width: auto"/>
              </FormItem>
              <FormItem label="确认密码" prop="pwdCheck">
                <Input v-model="userInfo.pwdCheck" type="password" style="width: auto"/>
              </FormItem>
              <FormItem label="职位" prop="role">
                <Input v-model="userInfo.role" style="width: auto"/>
              </FormItem>
              <FormItem label="备注信息" prop="remark">
                <Input v-model="userInfo.remark" style="width: auto"/>
              </FormItem>
            </Form>
            <Button @click="handleSubmit" type="primary" style="margin: 0 0 0 120px;">更新我的信息</Button>
          </i-col>
          <i-col span="14">
            <p class="textTitle">更新头像</p>
            <Card style="margin: auto;width: 623px;height: 380px;">
              <div class="cropper-example cropper-first">
                <cropper :src="exampleImageSrc" crop-button-text="确认上传" @on-crop="handleCroped"></cropper>
              </div>

            </Card>
          </i-col>
        </Row>
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import { changeUser } from "@/api/user.js";
import { getUserId } from "@/libs/util.js";
import Cropper from "@/components/cropper";
import { uploadImg } from "@/api/data";
import { changeUserTou,updataUser } from "@/api/user.js";
import { mapActions } from "vuex";
export default {
  components: {
    Cropper
  },
  data() {
    let pwdValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    let pwdCheckValidate = (rule, value, callback) => {
      if (this.userInfo.password != "" && value === "") {
        callback(new Error("密码不能为空"));
      } else if (this.userInfo.password != value) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      exampleImageSrc: "http://127.0.0.1:8000/user/modeTou",
      userInfo: {
        userName: "",
        password: "",
        pwdCheck: "",
        role: "",
        remark: ""
      },
      rules: {
        password: [
          { required: false, validator: pwdValidate, trigger: "blur" }
        ],
        pwdCheck: [
          { required: false, validator: pwdCheckValidate, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      ...mapActions(["handleLogOut"]),
    async handleCroped(blob) {
        const  _this = this;
        // console.log(blob)
        console.log(this.$store.state.user.userId,this.$store.state.user.userName);
        const userId = this.$store.state.user.userId;
        const userName = this.$store.state.user.userName;
        const formData = new FormData();
        formData.append('croppedImg', blob);
        formData.append('userId', userId);
        formData.append('userName', userName);
        const res = await changeUserTou(formData);
        if(res.data.result === 1){
            _this.$Message.error(res.data.msg)
        }else {
            _this.$Message.success({
                content:res.data.msg + '请重新登陆',
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
      try {
        const id = await getUserId();
        const name = this.userInfo.userName;
        const password = this.userInfo.password;
        const role = this.userInfo.role;
        const remark = this.userInfo.remark;
        const res = await updataUser({
          id,
          name,
          password,
          remark,
          role
        });
        if(res.data.result ===1){
            _this.$Message.error(res.data.msg);
        }else {
            _this.$Message.success(res.data.msg);
        }
        // console.log(res);
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
    }
  },
  beforeMount() {}
};
</script>
<style lang="less" scoped>
.textTitle {
  margin: 0px 0px 20px 20px;
  font-size: 20px;
}
.cropper-example {
  height: 180px;
}
</style>
