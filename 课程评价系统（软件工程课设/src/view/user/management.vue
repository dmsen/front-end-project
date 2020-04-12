<template>
  <Card :dis-hover="true">
    <tables
      border
      :disabled-hover="true"
      ref="tables"
      editable
      searchable
      search-place="top"
      v-model="tableData"
      :columns="columns"
      @on-delete="handleDelete"
    />

    <Row style="margin-top: 16px">
      <Col span="3">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      </Col>
      <!--<Col span="5">-->
        <!--<Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddUser">增加用户</Button>-->
      <!--</Col>-->
      <Col span = "13" offset = "8" style="text-align: right">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>
    <Card v-if="handleUser" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" ref="formItem" :label-width="80" class="form" :rules="rules">
            <FormItem label="用户名" prop="name">
              <Input prefix="ios-person" v-model="formItem.name" style="width: auto"/>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input
                prefix="ios-key"
                v-model="formItem.password"
                type="password"
                style="width: auto"
              />
            </FormItem>
            <FormItem label="确认密码" prop="pwdCheck">
              <Input
                prefix="ios-key"
                v-model="formItem.pwdCheck"
                type="password"
                style="width: auto"
              />
            </FormItem>
            <FormItem label="职位" prop="role">
              <Input prefix="ios-contacts" v-model="formItem.role" style="width: auto"/>
            </FormItem>
            <FormItem label="权限等级" prop="jurisdiction">
              <Select v-model="formItem.jurisdiction" style="width: auto">
                <Option :value="0" :key="0">0</Option>
                <Option :value="1" :key="1">1</Option>
                <Option :value="2" :key="2">2</Option>
                <Option  :value="3" :key="3">3</Option>
              </Select>
            </FormItem>
            <FormItem label="是否离职" prop="status">
              <Select v-model="formItem.status" style="width: auto">
                <Option :value="0">在职</Option>
                <Option :value="1">离职</Option>
              </Select>
            </FormItem>
            <FormItem label="备注" prop="remark">
              <Input prefix="md-remove" v-model="formItem.remark" style="width: auto"/>
            </FormItem>
            <Button style="margin: 10px 0 10px 100px;" type="primary" @click="handleSubmit">确认提交</Button>
            <Button style="margin: 10px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
          </Form>
        </i-col>
      </Row>
    </Card>
    <Modal v-model="showModal" :title="getUserName"   width="600px">
      <Form :model="noticeItem" ref="formItem" :label-width="80">
        <FormItem label="用户名:">
          <span>{{noticeItem.hutUserName}}</span>
        </FormItem>
        <FormItem label="通知内容:">
          <Input type="textarea" placeholder="content" v-model="noticeItem.content"></Input>
        </FormItem>
        <!--<FormItem label="评级">-->
          <!--<Rate show-text allow-half v-model="noticeItem.rate">-->
            <!--<span style="color: #f5a623">{{ noticeItem.rate }}</span>-->
          <!--</Rate>-->
        <!--</FormItem>-->
        <p style="text-align: center"> <Button  type="primary" @click="handleSubmitNotice">提交</Button></p>
      </Form>
      <div slot="footer">
        <span style="margin-right: 12px">若有问题请联系管理员</span>
      </div>
    </Modal>
  </Card>
</template>
<script>
import Tables from "_c/tables";
import { getUsers, addUser, deleteUser, changeUser,noticeSub } from "@/api/user.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
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
      if (this.formItem.password != "" && value === "") {
        callback(new Error("密码不能为空"));
      } else if (this.formItem.password != value) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    let that = this;
    return {
        showModal:false,
        noticeItem: {
            hutUserId:"",
            hutUserName:"",
            content:"",
        },
        getUserName:that.userNameGet(),
        dataLength:0,
        currentPages:1,
      handleUser: false,
      formItem: {
        isAdd: true,
        id: "",
        name: "",
        password: "",
        pwdCheck: "",
        jurisdiction: 1,
        status: "",
        remark: "",
        role: ""
      },
      rules: {
        password: [
          { required: false, validator: pwdValidate, trigger: "blur" }
        ],
        pwdCheck: [
          { required: false, validator: pwdCheckValidate, trigger: "blur" }
        ]
      },
      columns: [
        { title: "用户名称", key: "name" },
        // { title: "职位", key: "role" },
        { title: "权限", key: "level" },
        { title: "是否离职/在校", key: "status" },
        { title: "未读通知数", key: "wNotice" },
        { title: "备注", key: "remark" },
        {
          title: "操作",
          key: "handle",
          searchable: false,
          button: [
            (h, params, vm) => {
              return h("div", [
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       size: "small"
                //     },
                //     style: {
                //       marginRight: "10px"
                //     },
                //     on: {
                //       click: () => {
                //         this.showChangeUser(params);
                //       }
                //     }
                //   },
                //   "修改"
                // ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "你确定要删除吗?"
                    },
                    style: {
                      marginLeft: "-5px"
                    },
                    on: {
                      "on-ok": () => {
                        vm.$emit("on-delete", params);
                        vm.$emit(
                          "input",
                          params.tableData.filter(
                            (item, index) => index !== params.row.initRowIndex
                          )
                        );
                      }
                    }
                  },
                  [
                    h(
                      "Button",
                      {
                        props: {
                          type: "error",
                          size: "small"
                        }
                      },
                      "删除"
                    )
                  ]
                ),
                  h(
                      "Button",
                      {
                          props: {
                              type: "primary",
                              size: "small"
                          },
                          style: {
                              marginLeft: "5px",
                              background:"orange"
                          },
                          on: {
                              click: () => {
                                  this.showNotice(params);
                              }
                          }
                      },
                      "通知"
                  ),
              ]);
            }
          ]
        }
      ],
      tableData: []
    };
  },
  watch: {
    passwordCleck(newVal, oldVal) {
      if (newVal == this.addForm.password) {
        this.addForm.passwordLand = false;
        console.log(this.addForm.passwordLand);
      } else {
        this.addForm.passwordLand = true;
      }
    }
  },
  methods: {
      showNotice(param) {
          this.showModal = true;
          this.noticeItem.hutUserId = this.tableData[param.index].id;
          this.noticeItem.hutUserName = this.tableData[param.index].name;
          console.log(this.noticeItem)
          // this.formItem.isAdd = false;
          // const { hutCourseId, hutCourseName, hutCourseDescribe ,hutCourseTeacher} = this.tableData[param.index];
          // console.log(this.tableData[param.index]);
          // this.formItem.hutCourseName = hutCourseName;
          // this.formItem.hutCourseDescribe = hutCourseDescribe;
          // this.formItem.hutCourseTeacher = hutCourseTeacher;
          // this.formItem.hutCourseId = hutCourseId;
          // this.shouCard = true
      },
      async handleSubmitNotice() {
          const _this = this;
          try {
              const userName = _this.$store.state.user.userName;
              const { hutUserId, content,hutUserName } = this.noticeItem;
              Date.prototype.format = function(fmt){
                  var o = {
                      "M+" : this.getMonth()+1,                 //月份
                      "d+" : this.getDate(),                    //日
                      "h+" : this.getHours(),                   //小时
                      "m+" : this.getMinutes(),                 //分
                      "s+" : this.getSeconds(),                 //秒
                      "q+" : Math.floor((this.getMonth()+3)/3), //季度
                      "S"  : this.getMilliseconds()             //毫秒
                  };

                  if(/(y+)/.test(fmt)){
                      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                  }

                  for(var k in o){
                      if(new RegExp("("+ k +")").test(fmt)){
                          fmt = fmt.replace(
                              RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                      }
                  }

                  return fmt;
              };
              const evaDate = new Date().format("yyyy-MM-dd hh:mm:ss");
              console.log("提交评价");
              console.log(evaDate,this.noticeItem);
              const  res = await  noticeSub({
                  hutUserId,userName,content,evaDate
              });
              if(res.data.result ===1){
                  _this.$Message.error(res.data.msg)
              }else {
                  _this.$Message.success("感谢您的宝贵评价，可前往首页查看您的评价")
              }
              console.log(res)


          } catch (err) {
              console.log(err);
              if (err.response !== undefined) {
                  this.$Message.error(err.response.status);
              } else {
                  this.$Message.error(err);
              }
          }
      },
      userNameGet(){
          return ("用户：" + this.$store.state.user.userName)
      },
      changePages(val){
          this.currentPages =  val
          console.log(this.currentPages)
          this.getUsers();
          // console.log(val)
      },
    async handleDelete(params) {
      const _this = this;
      const id = this.tableData[params.index].id;
      const userId = this.$store.state.user.userId;

      // console.log(id,userId);
      try {
        const deleteRes = await deleteUser({ id ,userId });
        console.log("删除");
          console.log(deleteRes);
        console.log(deleteRes.data.result);
          if(deleteRes.data.result ===1){
              _this.$Message.error(deleteRes.data.msg);
          }else {
              _this.$Message.success("删除成功");
          }
      } catch (err) {
        if (err.response !== undefined) {
          errMessage(err.response.status);
        } else {
          errMessage(1);
        }
      }
      this.getUsers();
    },
    async getUsers() {
      try {
          const sendPage = this.currentPages
        const userList = await getUsers({sendPage});
          // console.log(this.$store.state.user.token);
          console.log("获取");
        console.log(userList,userList.data.allDateLength,this.currentPages);
        this.tableData = [];
        this.dataLength = userList.data.allDateLength;
        for (let i = 0, length = userList.data.msg.length; i < length; i++) {
          this.tableData.push({
            id: userList.data.msg[i].id,
            name: userList.data.msg[i].userName,
              level: userList.data.msg[i].level === 0 ? "超级管理员" : userList.data.msg[i].level === 1 ? "管理员" : userList.data.msg[i].level === 2 ? "用户":"游客" ,
            remark: userList.data.msg[i].remarks,
            status: userList.data.msg[i].status ===1 ? "在校" : "离校"
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
    // showAddUser() {
    //   this.handleUser = true;
    // },
    // showChangeUser(param) {
    //   this.formItem.isAdd = false;
    //   const { id, jurisdiction, name, remark, role, status } = this.tableData[
    //     param.index
    //   ];
    //   this.formItem.name = name;
    //   this.formItem.id = id;
    //   this.formItem.jurisdiction = jurisdiction;
    //   this.formItem.role = role;
    //   this.formItem.remark = remark;
    //   this.formItem.status = status === "离职" ? 1 : 0;
    //   this.handleUser = true;
    // },
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
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getUsers();
  }
};
</script>

<style lang="less" scoped>
#formImg {
  height: 408px;
  width: 100%;
  border-radius: 8px;
  padding: 0 0 -12px 0;
  opacity: 0.75;
}
</style>
