<template>
    <div>
        <Row >
            <Col span="18" >
                <Card v-for="(item,i) in evalItem">
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
                <Card style="height: 300px;">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        最新公告
                    </p>
                    <a href="http://www.dmsen.cn" slot="extra">
                        <Icon type="ios-loop-strong"></Icon>
                        前往 主页
                    </a>
                    哈哈哈哈哈哈哈哈哈
                </Card>
                <Card style="height: 300px;">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        Classic film
                    </p>
                    <a href="#" slot="extra" @click.prevent="changeLimit">
                        <Icon type="ios-loop-strong"></Icon>
                        Change
                    </a>
                    哈哈哈哈哈哈哈哈哈
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
    export default {
        name: "home",
        data(){
            return{
                evalItem:{

                },
                valueText: 3.9,
            }
        },
        methods: {
            formateDate(datetime) {
                // let  = "2019-11-06T16:00:00.000Z"
                function addDateZero(num) {
                    return (num < 10 ? "0" + num : num);
                }
                let d = new Date(datetime);
                let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
                return formatdatetime;
            },
            async getEva(){
                const _this = this;
                try {
                    const Res = await handGetEvl();
                    console.log(Res);
                    if(Res.result === 1)
                    {
                        _this.$Message.error("错误")
                    }else {
                        _this.evalItem = Res.data.msg;
                        _this.$Message.success("成功")
                    }
                } catch (err) {
                    _this.$Message.error("未知错误"+err)
                }
            },
        },
        beforeMount() {
            this.getEva()
        }
    }
</script>

<style scoped>

</style>