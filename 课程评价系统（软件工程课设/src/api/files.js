import axios from '@/libs/api.request';
/**
 * @description 增加客户
 */
export const addCustomer = ({
  name,
  type,
  level,
  person,
  phone,
  address,
  count,
  remark
}) => {
  return axios.request({
    url: 'customer/add',
    data: {
      customerName: name,
      customerType: type,
      customerLevel: level,
      sponsor: person,
      phone: phone,
      address: address,
      machCount: count,
      remark: remark
    },
    method: 'post'
  })
}
/**
 * @description 修改客户
 */
export const changeCustomer = ({
  id,
  name,
  type,
  level,
  person,
  phone,
  address,
  count,
  remark
}) => {
  return axios.request({
    url: '/customer/mode' ,
    data: {
      customerId: id,
      customerName: name,
      customerType: type,
      customerLevel: level,
      sponsor: person,
      phone: phone,
      address: address,
      machCount: count,
      remark: remark
    },
    method: 'post'
  })
}
/**
 * @description 删除客户
 */
export const deleteCustomer = ({
  id,
}) => {
  return axios.request({
    url: '/customer/del',
      data: {
          customerId: id,
      },
      method: 'post'
  })
}
/**
 * @description 获取所有客户列表
 */
export const getCustomers = (sendPage) => {
  return axios.request({
    url: '/customer/customers',
    method: 'post',
      data:{
          sendPage:sendPage
      }
  })
}
