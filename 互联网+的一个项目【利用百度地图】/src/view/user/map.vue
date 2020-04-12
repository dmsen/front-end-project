<template>
    <el-container >
        <el-aside style="margin-top:20px">
            <el-table :data="buildinglist" @row-click="skiptomap" fit highlight-current-row stripe border>
                <el-table-column prop="name" lable="name" align="left" label="热度排名">
                    <template slot-scope="scope" align=" left">
                        <p style="font-weight: bold">{{ scope.row.name }}
                            <span style="float: right">
                                     <Icon type="md-flame"  size="22"/> {{ scope.row.grade }}
                            </span>
                        </p>
                    <!--<el-popover trigger="hover" placement="top">-->
                        <!--<p>姓名: {{ scope.row.name }}</p>-->
                        <!--<div slot="reference" >-->
                            <!--<el-tag size="medium">{</el-tag>-->
                        <!--</div>-->
                    <!--</el-popover>-->
                </template>
                </el-table-column>
            </el-table>
            <p style="text-align: right;margin-top: 20px"> <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="6" @on-change="changePages" show-total/></p>
        </el-aside>
        <el-container id="newmap" style="margin-top:20px;margin-left:20px; height:900px;"></el-container>
        <Modal v-model="showModal" title="院内详情"   width="900px" >
            <div>
                <Tabs :value="tabPages">
                    <TabPane label="院内实景" name="1">

                            <el-container  style="height: 480px; border: 1px solid #eee">
                                <el-aside width="400px" style="">
                                    <img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"
                                         alt="头像"
                                         width="100%"
                                            height="95%">
                                </el-aside>

                                <el-container>
                                    <el-header style=" font-size: 12px;height:240px">
                                        <img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"
                                             alt="头像"
                                             width="100%"
                                             height="100%">
                                    </el-header>
                                    <el-main style="height:240px">
                                        <img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"
                                             alt="头像"
                                             width="100%"
                                             height="97%">
                                    </el-main>
                                </el-container>
                             </el-container>
                        <p style="margin-top: 10px">
                            <a style="float: right;margin-right: 10px" @click="dianZanNone">
                                <img src="http://www.dmsen.cn/static/img/newProject/noZan.png"
                                     alt="不满"
                                     title="不满"
                                     width="40px"
                                     height="40px"
                                >
                            </a>
                            <a style="float: right;margin-right: 30px" @click="dianZan">
                                <img src="http://www.dmsen.cn/static/img/newProject/zan.png"
                                     alt="点赞"
                                     title="点赞"
                                     width="40px"
                                     height="40px"
                                >
                            </a>
                        </p>


                    </TabPane>
                    <TabPane label="院内生活" name="2">
                        <Row >
                            <Col span="24" >
                                <!--<video controls  loop  @@mouseleave="pauseVedio">-->
                                    <!--<source src="http://www.dmsen.cn/static/video/lin0.mp4" type="video/mp4"/>-->
                                <!--</video>-->
                                <Card >
                                    <video
                                            id="player"
                                            class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" poster="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"
                                            data-setup="{}"
                                            @mouseenter="playVedio"
                                            @mouseleave="pauseVedio"

                                    >
                                        <source src="http://www.dmsen.cn/static/video/lin0.mp4" type="video/mp4"/>
                                    </video>
                                </Card>

                            </Col>

                        </Row>

                        <!--<div class="cropper-example cropper-first">-->
                         <!---->
                        <!--</div>-->
                            <p style="margin-top: 10px">
                                <a style="float: right;margin-right: 10px" @click="dianZanNone">
                                    <img src="http://www.dmsen.cn/static/img/newProject/noZan.png"
                                         alt="不满"
                                         title="不满"
                                         width="40px"
                                         height="40px"
                                    >
                                </a>
                                <a style="float: right;margin-right: 30px" @click="dianZan">
                                    <img src="http://www.dmsen.cn/static/img/newProject/zan.png"
                                         alt="点赞"
                                         title="点赞"
                                         width="40px"
                                         height="40px"
                                    >
                                </a>
                            </p>
                    </TabPane>

                </Tabs>


            </div>
            <div slot="footer">
                <span style="margin-right: 12px">有问题请联系管理员</span>
            </div>
        </Modal>
    </el-container>
</template>

<script>
    export default {
        // name: "map",
        data(){
            return{
                tabPages:'1',
                dataLength:7,
                currentPages:1,
                showModal:false,
                userInfo: {
                    userName: '',
                    password: '',
                    jurisdiction:2,
                    status:0,
                    remark:''
                },
                //定义指定地点的名称和经纬度
                buildinglist: [
                    { id:1,name: '湖南工业大学新校区', j: 113.114149, w: 27.823866,addr:'泰山西路88号',tel:'(0731)22183311',grade:3 },
                    { id:2,name: '中心广场', j: 113.159473, w: 27.845592,addr:'地址：湖南省株洲市芦淞区纺织路27号',tel:'' ,grade:2},
                    {id:3, name: '芦淞区市中心王府井', j: 113.160335, w: 27.844724,addr:'王府井A座703号',tel:'17770922184',grade:1 },
                    {id:4, name: '株洲神农城', j: 113.125712, w: 27.825716,addr:'珠江南路和泰山西路交叉口',tel:'',grade:1 },
                    {id:5, name: '石峰公园(建设北路)', j: 113.120294, w: 27.863948,addr:'株洲市石峰区建设北路651号',tel:'(0731)28332131',grade:1 },
                    {id:6, name: '老山城火锅(美的城店)', j: 113.088898, w: 27.837694,addr:'珠江北路1283号',tel:'(0731)22332077',grade:1 },
                    {id:7, name: '中国动力谷自主创新园', j: 113.040198, w: 27.810048,addr:'株洲市天元区万丰路2号',tel:'',grade:1 },

                    ],
                jd: 113.114149,  //初始地图中心点的经纬度
                wd: 27.823866,
                map: {},
                point: {},
                recentItem:null
            }
        },
        methods: {
            playVedio(){
                this.$video("player").play();
            },
            pauseVedio(){
                this.$video("player").pause();
                // videojs("player").src("//vjs.zencdn.net/v/oceans.mp4")
                // Document.querySelector('video').pause();
            },
            changePages(val){
                this.currentPages =  val;
                // this.getUsers();
            },
            dianZan(){
                alert("点赞+1")
            },
            dianZanNone(){
                alert("不满+1")
            },
            loadmap(jd, wd) {
                var _this = this;   //保存此时的this值！！！
                this.map = new BMap.Map("newmap");          // 创建地图实例
                this.point = new BMap.Point(jd, wd);  // 创建点坐标
                this.map.centerAndZoom(this.point, 15);                 // 初始化地图，设置中心点坐标和地图级别
                // this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                this.buildinglist.forEach(function (item) {    //创建多标注
                    var point2 = new BMap.Point(item.j, item.w);
                    var marker = new BMap.Marker(point2);        // 创建标注
                    _this.map.addOverlay(marker);                    // 将标注添加到地图中
                    marker.addEventListener("click", function (e) {
                        alert("点击了标注");
                        _this.point = e.point;
                        _this.openInfoView(item);
                        console.log(e.point)
                    });
                })

            },
            skiptomap(row, event, column) {
                // console.log(row,column);
                this.point = new BMap.Point(row.j, row.w);
                this.map.centerAndZoom(this.point, 15);
                this.openInfoView(row)
            },
            openInfoView(item){
                var that = this;
                var dataItem ={
                    name:item.name,
                    addr:item.addr,
                    tel:item.tel
                }
                var htmlInfo = "<div class='infoBoxContent '><h3>"+dataItem.name+
                    "</h3> <hr /><div><p>院长：xxxx</p>" +
                    "<p>详细地址："+ dataItem.addr + "</p><p>联系电话："+ dataItem.tel +"</p><div style='text-align: right;margin-top: 10px'><input style='margin-right: 10px;margin-top: 20px' type='button' id='btn' value='查看院内实景'/>" +
                        "<input style='position:relative;margin-top: 20px' type='button' id='btnLife' value='查看院内生活' />"+
                    "</div></div></div>";

                var opts ={
                    width:150,
                    height:150
                };
                var infoWindow = new BMap.InfoWindow(htmlInfo,opts);  // 创建信息窗口对象
                console.log(this.point,infoWindow);
                this.map.openInfoWindow(infoWindow, this.point); //开启信息窗口

                if(!infoWindow.isOpen()){
                    console.log("开启了");
                    infoWindow.addEventListener("open",function (e) {
                        document.getElementById('btn').onclick = function () {
                            that.viewImage();
                        };
                        document.getElementById('btnLife').onclick = function () {
                            that.viewFunction();
                        }
                    })
                }
                else {

                        document.getElementById('btn').onclick = function () {
                            that.viewImage();
                        };
                        document.getElementById('btnLife').onclick = function () {
                        that.viewFunction();
                    }

                }

            },
            viewFunction(){
                this.tabPages = '2';
                this.showModal = true
                // console.log("___________________________________________________________");
                // alert("hello")
            },
            viewImage(){
                this.tabPages = '1';
                this.showModal = true
            }
        },
        mounted() {
            this.loadmap(this.jd,this.wd);
        }
    }
</script>

<style scoped>

</style>