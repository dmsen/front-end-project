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
      <Col span="5">
        <Button style="margin: 10px 0 10px 5px;" type="default" @click="showAddCard">添加课程</Button>
      </Col>
      <Col span = "7" offset = "8" style="text-align: right">
        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
      </Col>
    </Row>


    <Card v-if="shouCard" :dis-hover="true">
      <Row>
        <i-col span="7">
          <Form :model="formItem" ref="formItem" :label-width="80" class="form">
            <FormItem label="课程名" prop="name">
              <Input prefix="ios-person" v-model="formItem.hutCourseName" style="width: auto"/>
            </FormItem>
            <FormItem label="课程描述" prop="detail">
              <Input prefix="ios-contacts" v-model="formItem.hutCourseDescribe" style="width: auto"/>
            </FormItem>
            <FormItem label="任课老师" prop="detail">
              <Input prefix="ios-contacts" v-model="formItem.hutCourseTeacher" style="width: auto"/>
            </FormItem>
            <Button style="margin: 10px 0 10px 100px;" type="primary" @click="handleSubmit">确认提交</Button>
            <Button style="margin: 10px 0 10px 5px;" type="default" @click="handleCancel">取消</Button>
          </Form>
        </i-col>
      </Row>
    </Card>

    <Modal v-model="showModal" :title="getUserName"   width="600px">
      <Form :model="evalData" ref="formItem" :label-width="80">
        <FormItem label="课程名:">
          <span>{{evalData.hutCourseName}}</span>
        </FormItem>
        <FormItem label="评价:">
         <Input type="textarea" placeholder="请合理评价" v-model="evalData.content"></Input>
        </FormItem>
        <FormItem label="评级">
          <Rate show-text allow-half v-model="evalData.rate">
            <span style="color: #f5a623">{{ evalData.rate }}</span>
          </Rate>
        </FormItem>
        <p style="text-align: center"> <Button  type="primary" @click="handleSubmitEval">提交</Button></p>
      </Form>
      <div slot="footer">
        <span style="margin-right: 12px">若有问题请联系管理员</span>
      </div>
    </Modal>
  </Card>
</template>
<script>
import Tables from "_c/tables";
import {
    deleteCourse,
    modCourse,
    addCourse,
    hutCourseGet,
    evalateSub
} from "@/api/course.js";
import { errMessage } from "@/api/index.js";
export default {
  components: {
    Tables
  },
  data() {
      let that = this;
    return {
      showModal:false,
      evalData:{
          hutCourseId:"",
          hutCourseName:"",
          content:"",
          rate:5
        },
      dataLength:0,
      currentPages:1,
      shouCard: false,
        getUserName:that.userNameGet(),
      formItem: {
        isAdd: true,
          hutCourseId: "",
          hutCourseName: "",
          hutCourseDescribe: "",
          hutCourseTeacher:""
      },
      columns: [
        { title: "课程名", key: "hutCourseName" },
        { title: "课程描述", key: "hutCourseDescribe" },
        { title: "任课老师", key: "hutCourseTeacher" },
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
                        this.showChangeMacType(params);
                      }
                    }
                  },
                  "修改"
                ),
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
                                      this.shouEvaModel(params);
                                  }
                              }
                          },
                          "评价"
                      ),
              ]
              );
            }
          ]
        }
      ],
      tableData: []
    };
  },
  methods: {
      shouEvaModel(params){
          console.log(params);
          this.showModal= true;
          this.evalData.hutCourseId = this.tableData[params.index].hutCourseId;
          this.evalData.hutCourseName = this.tableData[params.index].hutCourseName;
          this.evalData.content = '';
          this.evalData.rate = 5;
      },
      userNameGet(){
          return ("用户：" + this.$store.state.user.userName)
      },
      changePages(val){
          this.currentPages =  val;
          this.getHutCourse();
      },
    async handleDelete(params) {
      const _this = this;
      const id = this.$store.state.user.userId;
      const hutCourseId = this.tableData[params.index].hutCourseId;
      try {
          const deleteRes = await deleteCourse({ id,hutCourseId });
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
      this.getHutCourse();
    },
    async getHutCourse() {
      try {
        const sendPage = this.currentPages;
        const macTypeList = await hutCourseGet(sendPage);
        this.dataLength = macTypeList.data.allDateLength;
        this.tableData = [];
        for (let i = 0, length = macTypeList.data.msg.length; i < length; i++) {
          this.tableData.push({
              hutCourseId: macTypeList.data.msg[i].hutCourseId,
              hutCourseName: macTypeList.data.msg[i].hutCourseName,
              hutCourseDescribe: macTypeList.data.msg[i].hutCourseDescribe,
              hutCourseTeacher:macTypeList.data.msg[i].hutCourseTeacher
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
      showAddCard() {
      this.shouCard = true;
    },
    showChangeMacType(param) {
      this.formItem.isAdd = false;
      const { hutCourseId, hutCourseName, hutCourseDescribe ,hutCourseTeacher} = this.tableData[param.index];
      this.formItem.hutCourseName = hutCourseName;
      this.formItem.hutCourseDescribe = hutCourseDescribe;
      this.formItem.hutCourseTeacher = hutCourseTeacher;
      this.formItem.hutCourseId = hutCourseId;
      this.shouCard = true
    },
    handleCancel() {
      this.shouCard = false;
      this.formItem = {
          isAdd: true,
          hutCourseId: "",
          hutCourseName: "",
          hutCourseDescribe: "",
          hutCourseTeacher:""
      };
    },
      async handleSubmitEval() {
          const _this = this;
          try {
              const usrId = _this.$store.state.user.userId
              const { hutCourseId, hutCourseName, content ,rate} = this.evalData;
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
                              RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                      }
                  }

                  return fmt;
              };
              const evaDate = new Date().format("yyyy-MM-dd hh:mm:ss");
              const  res = await  evalateSub({
                  hutCourseId,usrId,content,rate,evaDate
              });
              if(res.data.result ===1){
                  _this.$Message.error(res.data.msg)
              }else {
                  _this.$Message.success("感谢您的宝贵评价，可前往首页查看您的评价");
                  _this.showModal = false
              }

          } catch (err) {

              if (err.response !== undefined) {
                  this.$Message.error(err.response.status);
              } else {
                  this.$Message.error(err);
              }
          }
      },
    async handleSubmit() {
      const _this = this;
      const level = this.$store.state.user.token;
      if(level >=2){
          _this.$Message.error("无权添加或修改课程");
      }else {
          const { isAdd, hutCourseName, hutCourseDescribe, hutCourseTeacher ,hutCourseId} = _this.formItem;
          try {
              if (isAdd) {
                  const addRes = await addCourse({
                      hutCourseName, hutCourseDescribe, hutCourseTeacher
                  });
                  if(addRes.data.result === 1)
                  {
                      _this.$Message.error(addRes.data.msg);

                  }else {
                      _this.$Message.success("添加成功");
                  }
              } else {
                  const changeRes = await modCourse({
                      hutCourseId,
                      hutCourseName,
                      hutCourseDescribe,
                      hutCourseTeacher
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
          this.getHutCourse();
          this.handleCancel();

      }
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    }
  },
  beforeMount() {
    this.getHutCourse();
  }
};
</script>

<style lang="less" scoped>
#formImg {
  height: 208px;
  width: 100%;
  border-radius: 8px;
  padding: 0 0 -12px 0;
  opacity: 0.75;
}
.form {
  margin-top: 20px;
}
</style>
