<template>
    <el-container >
        <el-aside style="margin-top:20px">
       <Input  v-model="searchValue" placeholder="请输入机构名称" style="margin-left: 1px;width:79%" clearable  @on-clear="clearFunction" />
                  <Button type="primary" style="float: right" @click="searchFunction">搜索</Button>


            <el-table :data="buildinglist" @row-click="skiptomap" fit highlight-current-row stripe border>
                <el-table-column prop="name" lable="name" align="left" label="热度排名">
                    <template slot-scope="scope" align=" left">
                        <p style="font-weight: bold">{{ scope.row.name }}
                            <span style="float: right;margin-right: 10px">
                                  <Icon type="md-eye" size="22"/>{{ scope.row.grade }}
                            </span>
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
        <el-container id="newmap" style="margin-top:20px;margin-left:20px; height:1000px;"></el-container>
        <Button @click="uploadPoint()" style="position: absolute;top: 60px;left: 182px;" type="primary">上传机构信息</Button>
        <Button @click="zoomOut()" style="position: absolute;top: 60px;right: 10px">放大</Button>
        <Button @click="zoomIn()" style="position: absolute;top: 95px;right: 10px">缩小</Button>
        <Button @click="resetZoom()" style="position: absolute;top: 130px;right: 10px">重置</Button>
        <!--<button onclick="zoomOut()">放大</button>-->
        <!--<button onclick="zoomIn()">缩小</button>-->
        <Modal v-model="showModal" title="院内详情"   width="900px" >
            <div>
                <Tabs :value="tabPages">
                    <TabPane label="院内实景" name="1">

                        <div v-show="!uploadI">
                        <div v-if="!showImage" style="text-align: center;font-weight: bold">暂无图片，请联系管理员上传图片</div>
                        <Scroll height="480" v-if="showImage">
                            <Card :dis-hover="true" v-for="(item,index) in buildinglist[this.currentMapPoint].mapPointImage" :key="item.imageId" style="margin: 32px 0">
                                <img :src="mapPointImageXian(item.image)"
                                     alt="头像"
                                     width="100%"
                                     height="450px"/>
                            </Card>
                        </Scroll>

                            <!--<el-container  style="height: 480px; border: 1px solid #eee">-->

                                <!--<el-aside width="400px" style="">-->
                                    <!--<img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"-->
                                         <!--alt="头像"-->
                                         <!--width="100%"-->
                                            <!--height="95%">-->
                                <!--</el-aside>-->

                                <!--<el-container>-->
                                    <!--<el-header style=" font-size: 12px;height:240px">-->
                                        <!--<img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"-->
                                             <!--alt="头像"-->
                                             <!--width="100%"-->
                                             <!--height="100%">-->
                                    <!--</el-header>-->
                                    <!--<el-main style="height:240px">-->
                                        <!--<img src="http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg"-->
                                             <!--alt="头像"-->
                                             <!--width="100%"-->
                                             <!--height="97%">-->
                                    <!--</el-main>-->
                                <!--</el-container>-->
                             <!--</el-container>-->

                        <p style="margin-top: 40px">
                            <Button type="primary" @click="uploadImg">上传图片</Button>
                            <a style="float: right;margin-right: 10px" @click="dianZanNone">
                                <img src="http://www.dmsen.cn/static/img/noZan.png"
                                     alt="不满"
                                     title="不满"
                                     width="40px"
                                     height="40px"
                                >
                            </a>
                            <a style="float: right;margin-right: 30px" @click="dianZan">
                                <img src="http://www.dmsen.cn/static/img/zan.png"
                                     alt="点赞"
                                     title="点赞"
                                     width="40px"
                                     height="40px"
                                >
                            </a>
                        </p>
                        </div>
                        <div v-show="uploadI">
                            <Card :dis-hover="true">
                                <Upload
                                    :before-upload="handleUpload"
                                    :on-progress = "handlessss"
                                    :on-success = "handleSUCCC"
                                    action="http://127.0.0.1:8000/mapPoint/add">
                                <Button icon="ios-cloud-upload-outline" >选择上传图片</Button>
                                </Upload>
                                <div v-if="file !== null">图片名: {{ file.name }}
                                    <Button type="primary" @click="upload" :loading="loadingStatus">
                                        {{ loadingStatus ? '上传中' : '确认上传' }}</Button>
                                </div>
                            </Card>
                            <p><Button type="primary" @click="uploadImgNo">取消上传</Button></p>
                        </div>
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
                                <Button type="primary" @click="uploadVedio">上传视频</Button>
                                <a style="float: right;margin-right: 10px" @click="dianZanNone">
                                    <img src="http://www.dmsen.cn/static/img/noZan.png"
                                         alt="不满"
                                         title="不满"
                                         width="40px"
                                         height="40px"
                                    >
                                </a>
                                <a style="float: right;margin-right: 30px" @click="dianZan">
                                    <img src="http://www.dmsen.cn/static/img/zan.png"
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

        <Modal v-model="uploadModal" title="上传机构信息" width="900px">
            <Form :model="formItem" ref="formItem" :label-width="80" class="form" >
                <Row>
                    <Col span="12">
                        <FormItem label="机构名">
                            <Input prefix="ios-person" v-model="formItem.mapPointName" style="width: auto" clearable />
                        </FormItem>
                        <FormItem label="经度">
                            <Input prefix="ios-contacts" v-model="formItem.mapPointJ" style="width: auto" placeholder="例子：113.114149" clearable />
                        </FormItem>
                        <FormItem label="纬度" >
                            <Input prefix="ios-contacts" v-model="formItem.mapPointW" style="width: auto"  placeholder="例子：27.823866" clearable />
                        </FormItem>
                        <FormItem label="地址">
                            <Input prefix="ios-person" v-model="formItem.mapPointAddr" style="width: auto" clearable />
                        </FormItem>
                        <FormItem label="联系电话">
                            <Input prefix="ios-contacts" v-model="formItem.mapPointTel" style="width: auto" clearable />
                        </FormItem>
                        <FormItem label="床位" >
                            <Input prefix="ios-contacts" v-model="formItem.mapPointBedNum" style="width: auto" clearable />
                        </FormItem>
                        <FormItem label="费用" >
                            <Input prefix="ios-contacts" v-model="formItem.mapPointFee" style="width: auto" clearable />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="简介" style="margin-left: -40px">
                            <Input prefix="ios-contacts" v-model="formItem.mapPointJian" style="width:360px" maxlength=150 show-word-limit type="textarea" :rows="6"/>
                        </FormItem>
                        <FormItem label="服务详情" style="margin-left: -40px">
                            <Input prefix="ios-contacts" v-model="formItem.mapPointServer" style="width:360px;"   maxlength=300 show-word-limit type="textarea" :rows="10"/>
                        </FormItem>

                    </Col>
                </Row>
            </Form>

            <div slot="footer">
                <Button type="primary" @click="handleSubmit">确认提交</Button>
                <Button type="default" @click="handleCancel">取消</Button>
            </div>
        </Modal>
    </el-container>
</template>

<script>
    import { mapPointGet,mapPointSearch,addPoint,addMapImage} from "@/api/mapPoint.js";
    export default {
        // name: "map",
        data(){
            let that = this;
            return{
                file: null,
                loadingStatus: false,
                uploadI:false,
                formItem: {
                    mapPointName:"",
                    mapPointJ:"",
                    mapPointW:"",
                    mapPointAddr:"",
                    mapPointTel:"",
                    mapPointBedNum:"",
                    mapPointFee:"",
                    mapPointJian:"",
                    mapPointServer:"",
                },
                searchValue:"",
                tabPages:'1',
                dataLength:0,
                currentPages:1,
                showModal:false,
                uploadModal:false,
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
                recentItem:null,
                fclickMarker:null,
                lclickMarker:null,
                currentSize:15,
                step:1,
                maxSize:30,
                minSize:0,
                points:new BMap.Point(113.114149,27.823866),
                currentMapPoint:1,
                currentMapPointId:null,
                currentMapPointName:null,
            //    控制model中的图片显示
                showImage:true
            }
        },
        methods: {
            zoomOut()
            {
                this.currentSize = this.currentSize+this.step > this.maxSize? this.currentSize:this.currentSize+ this.step;
                console.log(this.point);
                if(this.point !=={}){
                    let poi = new BMap.Point(this.point.lng,this.point.lat);
                    this.map.centerAndZoom(poi,this.currentSize);
                }else {
                    this.map.centerAndZoom(this.points,this.currentSize);
                }

            },
            zoomIn()
            {
                this.currentSize = this.currentSize-this.step < this.minSize? this.currentSize:this.currentSize - this.step;
                console.log(this.point);
                if(this.point !=={}){
                    let poi = new BMap.Point(this.point.lng,this.point.lat);
                    this.map.centerAndZoom(poi,this.currentSize);
                }else {
                    this.map.centerAndZoom(this.points,this.currentSize);
                }
            },
            resetZoom(){
                if(this.point !=={}){
                    let poi = new BMap.Point(this.point.lng,this.point.lat);
                    this.map.centerAndZoom(poi,15);
                }else {
                    this.map.centerAndZoom(this.points,15);
                }
            },
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
                this.getMapPoint();
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


                var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT ,type:BMAP_NAVIGATION_CONTROL_LARGE});
                this.map.addControl(ctrl_nav);
                // let ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
                // this.map.addControl(ctrl_ove);
                this.map.addControl(new BMap.ScaleControl());     //比例尺控件，默认位于地图左下方，显示地图的比例关系。
                this.map.addControl(new BMap.MapTypeControl());   //地图类型控件，默认位于地图右上方。
                this.map.addControl(new BMap.CopyrightControl());     //版权控件，默认位于地图左下方。


                //自己地图标点上传信息
                this.map.addEventListener("rightclick", function(e){
                    // console.log(e);
                    //
                    // console.log( e.point.lng,e.point.lat);
                    if(_this.fclickMarker !== null){
                        // alert("a");
                        _this.map.removeOverlay(_this.fclickMarker);
                        let clickPonit = new BMap.Point(e.point.lng, e.point.lat);
                        _this.fclickMarker = new BMap.Marker(clickPonit);
                        _this.map.addOverlay(_this.fclickMarker);   // 将点击点标注添加到地图中
                        // 点击打开上传信息的model
                        _this.fclickMarker.addEventListener("click", function (e) {
                            // alert("您是想自己上传信息吗？");
                            _this.point = e.point;
                            _this.formItem.mapPointJ = e.point.lng;
                            _this.formItem.mapPointW= e.point.lat;
                            _this.uploadModal = true;

                            // console.log( _this.point)
                        });
                    }else{
                        console.log(_this.fclickMarker);
                        let clickPonit = new BMap.Point(e.point.lng, e.point.lat);
                        _this.fclickMarker = new BMap.Marker(clickPonit);
                        _this.map.addOverlay(_this.fclickMarker);   // 将点击点标注添加到地图中
                        // 点击打开上传信息的model
                        _this.fclickMarker.addEventListener("click", function (e) {
                            // alert("您是想自己上传信息吗？");
                            _this.point = e.point;
                            _this.formItem.mapPointJ = e.point.lng;
                            _this.formItem.mapPointW= e.point.lat;
                            _this.uploadModal = true;

                            // console.log("点")
                            // console.log( _this.point)
                        });
                        console.log(_this.fclickMarker)
                    }
                });


                //初始化地图的相关操作
                this.point = new BMap.Point(jd, wd);  // 创建点坐标
                this.map.centerAndZoom(this.point, 15);                 // 初始化地图，设置中心点坐标和地图级别
                // this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                this.buildinglist.forEach(function (item) {    //创建多标注
                    var point2 = new BMap.Point(item.j, item.w);
                    var marker = new BMap.Marker(point2);        // 创建标注
                    _this.map.addOverlay(marker);                    // 将标注添加到地图中
                    marker.addEventListener("click", function (e) {
                        _this.point = e.point;
                        _this.openInfoView(item);
                        console.log(e.point)
                    });
                })

            },
    //          removeClick(){
    //              this.map.removeEventListener("click");
    // },

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
                    tel:item.tel,
                    mapPointBedNum:item.mapPointBedNum,
                    mapPointFee:item.mapPointFee,
                    mapPointJian:item.mapPointJian,
                    mapPointServer:item.mapPointServer,
                    current:item.current,
                    showMapPointImage:item.showMapPointImage,
                    mapPointId:item.id
                };
                var htmlInfo = "<div  style='word-wrap:break-word; '><h3>"+dataItem.name+
                    "</h3> <hr /><div><p></p>" +
                    "<p>详细地址："+ dataItem.addr + "</p><p>联系电话："+ dataItem.tel +"</p>" +
                    "<p>床位：" +dataItem.mapPointBedNum +"<span style='font-weight: bold;margin-left: 5px'>张</span></p>"+"<p>服务费用："+dataItem.mapPointFee+"<span style='font-weight: bold;margin-left: 5px'>起</span></p></p>" +
                        "<p >简历："+dataItem.mapPointJian+"</p>"+  "<p>服务："+dataItem.mapPointServer+"</p>"+
                    "<div style='text-align: right;margin-top: 10px'><input style='margin-right: 10px;margin-top: 20px' type='button' id='btn' value='查看院内实景'/>" +
                        "<input style='position:relative;margin-top: 20px' type='button' id='btnLife' value='查看院内生活' />"+
                    "</div></div></div>";

                var opts ={
                    width:400,

                };
                var infoWindow = new BMap.InfoWindow(htmlInfo,opts);  // 创建信息窗口对象
                console.log(this.point,infoWindow);
                this.map.openInfoWindow(infoWindow, this.point); //开启信息窗口

                if(!infoWindow.isOpen()){
                    console.log("开启了");
                    infoWindow.addEventListener("open",function (e) {
                        document.getElementById('btn').onclick = function () {
                            // console.log("hahaha");
                            // console.log(dataItem.id, dataItem.showMapPointImage);
                            that.viewImage(dataItem.current,dataItem.showMapPointImage,dataItem.mapPointId,dataItem.name);
                        };
                        document.getElementById('btnLife').onclick = function () {
                            // console.log(dataItem.id);
                            that.viewFunction(dataItem.current,dataItem.showMapPointImage,dataItem.mapPointId,dataItem.name);
                        }
                    })
                }
                else {

                        document.getElementById('btn').onclick = function () {
                            // console.log("hahaha");
                            // console.log(dataItem.id);
                            that.viewImage(dataItem.current,dataItem.showMapPointImage,dataItem.mapPointId,dataItem.name);
                        };
                        document.getElementById('btnLife').onclick = function () {
                            // console.log(dataItem.id);
                            that.viewFunction(dataItem.current,dataItem.showMapPointImage,dataItem.mapPointId,dataItem.name);
                    }

                }

            },
            viewFunction(current,showPic,mapPointId,mapPointName){
                this.tabPages = '2';
                this.showModal = true;
                this.currentMapPoint =current;
                this.currentMapPointId = mapPointId;
                this.currentMapPointName= mapPointName;
                this.showImage = showPic;

                // console.log("___________________________________________________________");
                // alert("hello")
            },
            viewImage(current,showPic,mapPointId,mapPointName){
                this.tabPages = '1';
                this.showModal = true;
                this.currentMapPoint =current;
                this.currentMapPointId = mapPointId;
                this.currentMapPointName= mapPointName;
                this.showImage = showPic;
            },
            async getMapPoint() {
                let that = this;
                try {
                    const sendPage = that.currentPages;
                    const mapPointList = await mapPointGet(sendPage);
                    console.log("获取");
                    // console.log(mapPointList);
                    that.buildinglist = [];
                    that.dataLength = mapPointList.data.allDateLength;
                    for (let i = 0, length = mapPointList.data.msg.length; i < length; i++) {
                        that.buildinglist.push({
                            current:i,
                            id: mapPointList.data.msg[i].mapPointId,
                            name: mapPointList.data.msg[i].mapPointName,
                            j: mapPointList.data.msg[i].mapPointJ,
                            w: mapPointList.data.msg[i].mapPointW,
                            addr: mapPointList.data.msg[i].mapPointAddr ,
                            tel: mapPointList.data.msg[i].mapPointTel ===null?'':mapPointList.data.msg[i].mapPointTel,
                            mapPointBedNum: mapPointList.data.msg[i].mapPointBedNum,
                            mapPointFee: mapPointList.data.msg[i].mapPointFee,
                            mapPointJian: mapPointList.data.msg[i].mapPointJian,
                            mapPointServer: mapPointList.data.msg[i].mapPointServer ,
                            mapPointImage:mapPointList.data.msg[i].mapPointImage,
                            showMapPointImage:mapPointList.data.msg[i].mapPointImage.length !==0 ?true:false
                        });
                    }
                    console.log(that.buildinglist);
                    that.loadmap(that.buildinglist[0].j,that.buildinglist[0].w);
                } catch (err) {
                    that.$Message.error("出现错误，请联系管理员");

                }
            },
            async searchFunction(){
                // console.log(this.searchValue);
                let that = this;
                try {
                    const sendPage = that.currentPages;
                    const searchValue = that.searchValue;
                    const mapPointList = await mapPointSearch({sendPage,searchValue});
                    console.log("搜索");
                    // console.log(mapPointList);
                    that.buildinglist = [];
                    that.dataLength = mapPointList.data.allDateLength;
                    for (let i = 0, length = mapPointList.data.msg.length; i < length; i++) {
                        that.buildinglist.push({
                            current:i,
                            id: mapPointList.data.msg[i].mapPointId,
                            name: mapPointList.data.msg[i].mapPointName,
                            j: mapPointList.data.msg[i].mapPointJ,
                            w: mapPointList.data.msg[i].mapPointW,
                            addr: mapPointList.data.msg[i].mapPointAddr ,
                            tel: mapPointList.data.msg[i].mapPointTel ===null?'':mapPointList.data.msg[i].mapPointTel,
                            mapPointBedNum: mapPointList.data.msg[i].mapPointBedNum,
                            mapPointFee: mapPointList.data.msg[i].mapPointFee,
                            mapPointJian: mapPointList.data.msg[i].mapPointJian,
                            mapPointServer: mapPointList.data.msg[i].mapPointServer ,
                        });
                    }
                    console.log(that.buildinglist);
                    that.loadmap(that.buildinglist[0].j,that.buildinglist[0].w);
                } catch (err) {
                    that.$Message.error("出现错误，请联系管理员");

                }

            },
            clearFunction(){
                this.getMapPoint();
            },
            uploadPoint(){
                this.uploadModal = true;

            },

            async handleSubmit(){
                const _this = this;
                const {
                    mapPointName,
                    mapPointJ,
                    mapPointW,
                    mapPointAddr,
                    mapPointTel,
                    mapPointBedNum,
                    mapPointFee,
                    mapPointJian,
                    mapPointServer
                } = this.formItem;
                try {

                        const addRes = await addPoint({
                            mapPointName,
                            mapPointJ,
                            mapPointW,
                            mapPointAddr,
                            mapPointTel,
                            mapPointBedNum,
                            mapPointFee,
                            mapPointJian,
                            mapPointServer
                        });
                        if(addRes.data.result === 1)
                        {
                            _this.$Message.error(addRes.data.msg);

                        }else {
                            _this.$Message.success("添加成功");
                        }
                } catch (err) {
                 _this.$Message.error("未知错误"+err)
                }
                this.getMapPoint();
                this.handleCancel();
            },
            handleCancel(){
                this.uploadModal = false;
                this.formItem = {
                    mapPointName:"",
                    mapPointJ:"",
                    mapPointW:"",
                    mapPointAddr:"",
                    mapPointTel:"",
                    mapPointBedNum:"",
                    mapPointFee:"",
                    mapPointJian:"",
                    mapPointServer:"",
                };
            },
            mapPointImageXian(i){
                return 'http://127.0.0.1:8000/media/'+i
            },
            async uploadImg(){
                // alert("功能开发中");
                // console.log("上传图片")
                this.uploadI = true
            },
            async uploadImgNo(){
                // alert("功能开发中");
                // console.log("上传图片")
                this.uploadI = false
            },
            async uploadVedio(){
                alert("功能开发中");
                console.log("上传视频")
            },
            handleSUCCC(response, file, fileList){
                console.log("_+++++=")
                console.log(response, file, fileList)
            },
            handlessss(file){
                console.log("____")
                console.log(file)
            },
            handleUpload (file) {
                this.file = file;
                console.log(file);
                return false;
            },
            async upload () {
                let that = this;
                console.log("上传--------")
                this.loadingStatus = true;
                const file = this.file;

                // console.log(file[0]);
                console.log("haha");
                console.log(file);
                console.log("haha");
                console.log(file[0]);
                const formData = new FormData();
                formData.append('MapPointImg', file);
                formData.append('id', that.currentMapPointId);
                formData.append('name',that.currentMapPointName);
                const res = await  addMapImage(formData);
                console.log(res);
                setTimeout(() => {
                    this.file = null;
                    this.loadingStatus = false;
                    this.$Message.success('Success')
                }, 1500);
            }

        },
        mounted() {
            this.getMapPoint();


        }
    }
</script>

<style scoped>

</style>