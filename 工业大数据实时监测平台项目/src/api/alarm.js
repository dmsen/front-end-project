import axios from '@/libs/api.request';
/**
 * @description 获取全部异常记录
 */
export const getAlarmMsg = () => {
  return axios.request({
    url: "alarmInfo/alarmInfoCounts",
    method: "get"
  })
}
/**
 * @description 根据设备id获取异常记录
 */
export const getRecord = ({
  id,sendPage
}) => {
  return axios.request({
    url: "singleAlarmCodes/get",
    method: "post",
      data:{
      machineId:id,
      sendPage:sendPage
      }
  })
}
/**
 * @description 获取组合码异常记录
 */
export const getGroupRecord = () => {
  return axios.request({
    url: "/alarmGroup/alarmGroupInfoRecord",
    method: "get"
  })
}
/**
 * @description 查找所有异常码
 */
export const getCodes = (sendPage) => {
  return axios.request({
    url: "/alarmCode/alarmCodes",
    method: "post",
      data:{
          sendPage:sendPage
      }
  })
}
/**
 * @description 查找所有组合码
 */
export const getCodeGroups = () => {
  return axios.request({
    url: "/alarmGroup/alarmGroups",
    method: "get"
  })
}
/**
 * @description 删除异常码
 */
export const deleteCode = ({
  id
}) => {
  return axios.request({
    url: "alarmCode/delCodes" ,
    method: "delete",
      data:{
          alarmCodeId:id
      }
  })
}
/**
 * @description 删除组合码
 */
export const deleteCodeGroup = ({
  id
}) => {
  return axios.request({
    url: "/alarmGroup/" + id,
    method: "delete"
  })
}
/**
 * @description 新增异常码
 */
export const addCode = ({
  code,
  name,
  macId,
  iopId,
  min,
  max,
  msg,
  level,
  timeLimit
}) => {
  return axios.request({
    url: '/alarmCode/addCodes',
    data: {
      alarmCode: code,
      alarmname: name,
      machineId: macId,
      configId: iopId,
      valueMin: min,
      valueMax: max,
      alarmMsg: msg,
      level: level,
      timeLimit: timeLimit
    },
    method: "post"
  })
}
/**
 * @description 新增组合码
 */
export const addCodeGroup = ({
  name,
  id,
  iops,
  msg,
  level,
  timeLimit
}) => {
  console.log({
    name,
    id,
    iops,
    msg,
    level,
    timeLimit
  })
  return axios.request({
    url: "/alarmGroup",
    data: {
      alarmGroupName: name,
      iopGroupId: id,
      alarmIdList: iops,
      alarmMsg: msg,
      level: level,
      timeLimit: timeLimit
    },
    method: "post"
  })
}
/**
 * @description 修改异常码
 */
export const changeCode = ({
  id,
  name,
  macId,
  iopId,
  min,
  max,
  msg,
  level,
  timeLimit
}) => {
  return axios.request({
    url: 'alarmCode/modCodes' ,
    data: {
      alarmCodeId:id,
      alarmname: name,
      machineId: macId,
      configId: iopId,
      valueMin: min,
      valueMax: max,
      alarmMsg: msg,
      level: level,
      timeLimit: timeLimit
    },
    method: "put"
  })
}
/**
 * @description 根据监测点id获得该监测点下所有异常码
 */
export const getCodeByIop = ({
  id
}) => {
  return axios.request({
    url: '/alarmCode/' + id,
    method: 'get'
  })
}
/**
 * @description 新增解决方案
 */
export const addScheme = ({
  name,
  detail,
  codes
}) => {
  return axios.request({
    url: 'solution/add',
    data: {
        alarmSolutonName: name,
        alarmSolutonDetail: detail,
        alarmCodeList: codes.toString(),
    },
    method: 'post'
  })
}
/**
 * @description 修改解决方案
 */
export const changeScheme = ({
  id,
  name,
  detail,
  remark,
  codes
}) => {
  return axios.request({
    url: 'solution/mod',
    data: {
        alarmSolutonId: id,
        alarmSolutonName: name,
        alarmSolutonDetail: detail,
        alarmCodeList: codes.toString()
    },
    method: 'put'
  })
}
/**
 * @description 删除解决方案
 */
export const deleteScheme = ({
  id,
}) => {
  return axios.request({
    url: 'solution/del',
    method: 'delete',
      data:{
          alarmSolutonId:id
      }
  })
}
/**
 * @description 查找解决方案
 */
export const getScheme = (sendPage) => {
  return axios.request({
    url: 'solution/get',
    method: 'post',
    data:{
          sendPage:sendPage
      }
  })
}
/**
 * @description 获取所有异常诊断
 */
export const getDiagnosis = () => {
  return axios.request({
    url: '/diagnosisRecord/diagnosisRecords',
    method: 'get'
  })
}
/**
 * @description 增加单个异常诊断
 */
export const addDiagnosisSingle = ({
  solution,
  record,
  code,
  sDate,
  msg,
  status,
  macName
}) => {
  return axios.request({
    url: 'alarmProcess',
    data: {
        singleAlarmCodeId: record,
      solveId: solution,
      alarmCode: code,
      startTime: sDate,
      feedback: msg,
      status: status,
      macName:macName
    },
    method: 'post'
  })
}
/**
 * @description 增加组合异常诊断
 */
export const addDiagnosisGroup = ({
  solution,
  record,
  code,
  sDate,
  msg,
  status,
}) => {
  return axios.request({
    url: '/diagnosisRecord/group',
    data: {
      alarmId: record,
      solveId: solution,
      alarmCode: code,
      startTime: sDate,
      feedback: msg,
      status: status,

    },
    method: 'post'
  })
}
/**
 * @description 初始化单个异常码
 */
export const singleAlarmCodesInit = () => {
    return axios.request({
        url: 'singleAlarmCodes/init',
        method: 'post'
    })
};
/**
 * @description 故障处理历史
 */
export const AlarmCodesHistory = ({sendPage}) => {
    return axios.request({
        url: 'alarmProcess/history',
        method: 'post',
        data:{
            sendPage:sendPage
        }
    })
}