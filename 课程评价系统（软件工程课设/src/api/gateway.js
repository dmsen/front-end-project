import axios from '@/libs/api.request';
/**
 * @description 增加监测点配置
 */
export const addGwIopConfig = ({
  macId,
  gwId,
  iop,
  name,
  minRange,
  maxRange,
  aline,
  computedWay
}) => {
  return axios.request({
    url: 'gwIopMappingConfig/add',
    data: {
      machineId: macId,
      gwId: gwId,
      // iop: iop,
      physicalName: name,
      minLC: minRange,
      maxLC: maxRange,
      aline: aline,
      method: computedWay
    },
    method: 'post'
  })
}
/**
 * @description 修改监测点配置
 */
export const changeGwIopConfig = ({
  id,
  gwId,
  macId,
  // iop,
  name,
  minRange,
  maxRange,
  aline,
  computedWay
}) => {
  return axios.request({
    url: 'gwIopMappingConfig/mod',
    data: {
      configId: id,
      machineId: macId,
      gwId: gwId,
      // iop: iop,
      minLC: minRange,
      maxLC: maxRange,
      aline: aline,
      method: computedWay
    },
    method: 'put'
  })
}
/**
 * @description 删除监测点配置
 */
export const deleteGwIopConfig = ({
  id,
}) => {
  return axios.request({
    url: 'gwIopMappingConfig/del' ,
    method: 'delete',
      data:{
          configId:id
      }
  })
}
/**
 * @description 获取所有配置的监测点
 */
export const getGwIopConfigs = (sendPage) => {
  return axios.request({
    url: '/gwIopMappingConfig/gwIopMappingConfigs',
    method: 'post',
      data:{
          sendPage:sendPage
      }
  })
}
/**
 * @description 获取所有网关和iop信息
 */
export const getGwIops = () => {
  return axios.request({
    url: '/gwIop/gwIops',
    method: 'get'
  })
}
/**
 * @description 获取所有的未配置的网关
 */
export const getUnUseGws = () => {
  return axios.request({
    url: '/gwIop/gateways/notUsed',
    method: 'get'
  })
}
/**
 * @description 获取所有的未配置iop
 */
export const getUnUseIops = ({
  gw
}) => {
  return axios.request({
    url: '/gwIop/iops/notUsed/' + gw,
    method: 'get'
  })
}
/**
 * @description 获取所有iop组信息
 */
export const getIopGroups = () => {
  return axios.request({
    url: '/iopGroup/iopGroups',
    method: 'get'
  })
}
/**
 * @description 根据监测点组id获取所有监测点
 */
export const getIopsByGroup = ({
  id
}) => {
  return axios.request({
    url: '/iopGroup/iops/' + id,
    method: 'get'
  })
}
/**
 * @description 删除监测点配置
 */
export const deleteIopGroup = ({
  id,
}) => {
  return axios.request({
    url: '/iopGroup/' + id,
    method: 'delete'
  })
}
/**
 * @description 获取所有已配置的设备
 */
export const getMacConfigs = () => {
  return axios.request({
    url: '/gwIopMappingConfig/configed',
    method: 'get'
  })
}
/**
 * @description 根据选择机器获取配置好的监测点
 */
export const getIopConfigs = ({
  id
}) => {
  return axios.request({
    url: 'machineIdIOP/get',
    method: 'post',
      data:{
          machineId:id
      }
  })
}
/**
 * @description 增加监测点组
 */
export const addIopGroup = ({
  req
}) => {
  return axios.request({
    url: '/iopGroup',
    data: req,
    method: 'post'
  })
}
