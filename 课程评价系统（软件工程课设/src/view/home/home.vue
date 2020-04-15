<template>
    <div>
        <Row >
            <Col span="18" >
                <Row style="margin-top: 16px">

                    <Col span="5">
                        <!--<Button style="margin: 10px 0 10px 5px;" type="default" >添加课程</Button>-->
                    </Col>
                    <Col span = "13" offset = "10" style="text-align: right">
                        <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
                    </Col>
                </Row>

                <Card v-for="(item,i) in evalItem" :key="i">
                    <p slot="title" style="height: 20px">
                        <Icon type="ios-film-outline"></Icon>
                        <span style="font-size: 20px">{{item.courseNmae}}</span>
                    </p>
                    <Rate show-text allow-half v-model="item.grade" disabled slot="extra">
                        评分：<span style="color: #f5a623">{{ item.grade }}</span>
                    </Rate>
                    <Row :gutter="16">
                        <Col span="2" >
                            <figure >
                                <img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"
                                     alt="头像"
                                     width="100%">
                                <figcaption style="text-align: center">{{item.userName}}</figcaption>
                            </figure>
                                <!--<Img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg" style="width: 20%" title="用户头像"/>-->
                                <!--<span style="display: block;margin-top:50px;position: absolute;margin-left: -20px;">用户名</span>-->
                        </Col>
                        <Col span="18">
                            {{item.courseEvaluateMsg}}
                        </Col>
                    </Row>

                    <Row style="margin-top: 10px">
                        <Divider style="margin: 5px 0"/>
                        <Col span="6">
                            {{formateDate(item.courseEvaluateDate)}}
                            <!--<Img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg" style="width: 20%" title="用户头像"/>-->
                            <!--<span style="display: block;margin-top:50px;position: absolute;margin-left: -20px;">用户名</span>-->
                        </Col>
                        <Col span="6" :offset="12">
                            暂定
                        </Col>
                    </Row>
                </Card>


            </Col>
            <Col span="6" >
                <Card style="">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        最新公告
                    </p>
                    <a href="http://www.dmsen.cn" slot="extra">
                        <Icon type="ios-loop-strong"></Icon>
                        前往 作者 主页
                    </a>
                    <p style="color: red">因此项目为软件工程课设，此系统暂停更新【除非另有需求】</p>

                    <!--<a-player :music="songList" :showlrc="3" :narrow="false" theme="#b7daff" mode="circulation" v-if="flag" listmaxheight='96px' ref="player"></a-player>-->
                    <a-player   id="playv"
                                controls
                                repeat="repeat-all"
                                :music="{
    title: 'lin',
    artist: 'lin',
  src: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/music/0.mp3',
    pic: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/img/1.jpg'
  }"
                               :list="[{
    title: 'hope',
    artist: 'Alan Walker',
  src: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/music/1.mp3',
    pic: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/img/1.jpg'
  },
   {
    title: 'Since You’ve Been Gone',
    artist: 'Joseph Vincent/Novaspace',
    src: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/music/2.mp3',
    pic: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/img/2.jpg'
  },
  {
    title: 'Lin',
    artist: '阿森',
    src: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/music/3.mp3',
    pic: 'http://www.dmsen.cn/static/lin/hutProject/ruanJianGongCheng/img/3.jpg'
  }
  ]"
                    />
                </Card>
                <Card style="height: 255px;">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        技术概要
                    </p>
                    <a href="https://github.com/dmsen" slot="extra">
                        <Icon type="ios-loop-strong"></Icon>
                        前往 作者 github
                    </a>
                    <p><span class="spanStyle">前端涉及到的知识：</span>【vue相关（router、vuex）、组件库（iview，element-ui）、框架（iview-admin）】</p>
                    <p><span class="spanStyle">涉及后端相关知识：</span>【语言（python）、框架（django）】</p>
                    <p><span class="spanStyle">web服务器：</span>【nginx】</p>
                    <p><span class="spanStyle">web框架：</span>【django（利用gunicorn来启动wsgi）】</p>
                </Card>
                <Card style="height: 205px;">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        相关功能
                    </p>
                    <a href="#" slot="extra" @click.prevent="changeLimit">
                        <Icon type="ios-loop-strong"></Icon>
                        查看本系统开发前的需求文档
                    </a>
                    <p>
                        <span class="spanStyle">用户：</span>【登陆、注册、权限验证、修改头像、更新个人信息、删除】
                    </p>
                    <p>
                        <span class="spanStyle">课程管理：</span>【增删改查】
                    </p>
                    <p><span class="spanStyle">课程评价：</span>【增、查】</p>
                    <p><span class="spanStyle">用户通知：</span>【增、查】</p>
                    <p><span class="spanStyle">数据库:</span>【六表】</p>
                </Card>
            </Col>
        </Row>
        <!--<Row align="top">-->
            <!--<Col offset="16" span="8" style="margin-top: 0;float: right">-->
                <!--<Card>-->
                    <!--<p slot="title">-->
                        <!--<Icon type="ios-film-outline"></Icon>-->
                        <!--Classic film-->
                    <!--</p>-->
                    <!--<a href="#" slot="extra" @click.prevent="changeLimit">-->
                        <!--<Icon type="ios-loop-strong"></Icon>-->
                        <!--Change-->
                    <!--</a>-->
                <!--</Card>-->
            <!--</Col>-->
        <!--</Row>-->
    </div>

</template>

<script>
    import {
        handGetEvl
    } from "@/api/course.js";
    // import Aplayer from 'vue-aplayer'
    import VueAplayer from 'vue-aplayer'

    export default {
        name: "home",
        components: {
            //别忘了引入组件
            'a-player': VueAplayer
        },
        // components: {
        //     Aplayer
        // },
        data(){
            return{
                flag:false,
                musicList:'',
                songList:[],

                dataLength:0,
                currentPages:1,
                evalItem:null,
                valueText: 3.9,
            }
        },
        methods: {
            changePages(val){
                this.currentPages =  val;
                this.getEva()
            },
            formateDate(datetime) {
                // let  = "2019-11-06T16:00:00.000Z"
                function addDateZero(num) {
                    return (num < 10 ? "0" + num : num);
                }
                // let d = new Date(datetime);
                let d =  new Date(Date.parse(datetime)-8*60*60*1000);
                let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
                return formatdatetime;
            },
            async getEva(){
                const _this = this;
                const sendPage = this.currentPages;
                _this.evalItem = {};
                try {
                    const Res = await handGetEvl(sendPage);
                    if(Res.result === 1)
                    {
                        _this.$Message.error("错误")
                    }else {
                        _this.evalItem = Res.data.msg;
                        _this.dataLength = Res.data.allDateLength;
                        // _this.$Message.success("成功")
                    }
                } catch (err) {
                    _this.$Message.error("未知错误"+err)
                }
            },
        },
        beforeMount() {

        },
        mounted(){
            //The play() request was interrupted by a new load request
            // let a= document.getElementById("playv")
            // console.log(a)
            this.getEva();
            let audio = document.querySelector("audio");
            setTimeout(() => {
                audio.play()
            }, 3000);
        }
    }
</script>

<style scoped>
.spanStyle{
    font-weight: bold;color: #348EED;
}
</style>