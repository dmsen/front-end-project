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
        />

        <Row style="margin-top: 16px">
            <Col span="3">
                <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
            </Col>
            <Col span = "10" offset = "11">
                <Page :total="dataLength" :current="currentPages" size="small" show-elevator  :page-size ="10" @on-change="changePages" show-total/>
            </Col>
        </Row>
    </Card>
</template>
<script>
    import Tables from "_c/tables";
    import { AlarmCodesHistory } from "@/api/alarm.js";
    import { errMessage } from "@/api/index.js";
    import { stampToDate } from "@/libs/tools.js";
    export default {
        components: {
            Tables
        },
        data() {
            return {
                dataLength:0,
                currentPages:1,
                columns: [
                    { title: "机器名称", key: "machineName" },
                    { title: "异常码编号", key: "alarmCode" },
                    { title: "异常码名称", key: "alarmCodeName" },
                    { title: "解决方案", key: "alarmSolutonName" },
                    { title: "反馈信息", key: "callbackMsg" },
                    { title: "处理时间", key: "processTime" },
                ],
                tableData: []
            };
        },
        methods: {
            changePages(val){
                this.currentPages =  val
                console.log(this.currentPages)
                this.getAlarmHistory();
                // console.log(val)
            },
            async getAlarmHistory() {
                try {
                    const sendPage = this.currentPages
                    const dataLists = await AlarmCodesHistory({sendPage});
                    console.log(dataLists);
                    this.tableData = [];
                    this.dataLength = dataLists.data.allDateLength;
                    for (let i = 0, length = dataLists.data.msg.length; i < length; i++) {
                        this.tableData.push({
                            alarmCode: dataLists.data.msg[i].alarmCode=== null ? '': dataLists.data.msg[i].alarmCode,
                            alarmCodeName: dataLists.data.msg[i].alarmCodeName=== null ? '': dataLists.data.msg[i].alarmCodeName,
                            alarmSolutonName: dataLists.data.msg[i].alarmSolutonId===  "None" ? '': dataLists.data.msg[i].alarmSolutonId,
                            callbackMsg: dataLists.data.msg[i].callbackMsg=== null ? '': dataLists.data.msg[i].callbackMsg,
                            processTime: stampToDate(dataLists.data.msg[i].processTime, "year"),
                            machineName: dataLists.data.msg[i].machineName === null ? '': dataLists.data.msg[i].machineName,
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



            exportExcel() {
                this.$refs.tables.exportCsv({
                    filename: `table-${new Date().valueOf()}.csv`
                });
            }
        },
        beforeMount() {
            this.getAlarmHistory();
        }
    };
</script>

<style lang="less" scoped>

</style>
