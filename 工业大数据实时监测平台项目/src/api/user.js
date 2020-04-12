import axios from '@/libs/api.request';
/**
 * @description 登陆
 */
export const login = ({
  userName,
  password,
  optionLevel
}) => {
  return axios.request({
    // url: '/user/login',
      url: 'test_login',
    data: {
      userName: userName,
      password: password,
      optionLevel:optionLevel
    },
      // headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Access-Control-Allow-Origin':'*'
      // },
    method: 'post'
  })
}
/**
 * @description 获取所有用户
 */
export const getUsers = ({sendPage}) => {
  return axios.request({
    url: '/user/userInfos',
    method: 'post',
  data:{
          sendPage:sendPage
      }

  })
}
/**
 * @description 增加用户
 */
export const addUser = ({
  jurisdiction,
  name,
  password,
  remark,
  role,
  status
}) => {
  return axios.request({
    url: 'user/add',
    data: {
      userName: name,
      jurisdiction: jurisdiction,
      password: password,
      remarks: remark,
      roles: role,
      status: status
    },
    method: 'post'
  })
}
/**
 * @description 删除用户
 */
export const deleteUser = ({
  id
}) => {
  return axios.request({
    url: 'user/del' ,
      data: {
          id: id,
      },
      method: 'post'
  })
}
/**
 * @description 修改用户
 */
export const changeUser = ({
  id,
  jurisdiction,
  name,
  password,
  remark,
  role,
  status
}) => {
  return axios.request({
    url: 'user/mode',
    data: {
      id: id,
      userName: name,
      jurisdiction: jurisdiction,
      password: password,
      remarks: remark,
      roles: role,
      status: status
    },
    method: 'post'
  })
};

export const updataUser = ({
                               id,
                               name,
                               password,
                               remark,
                               role,
                           }) => {
    return axios.request({
        url: 'user/updata',
        data: {
            id: id,
            userName: name,
            password: password,
            remarks: remark,
            roles: role,
        },
        method: 'post'
    })
};

export const logout = (token) => {
  return axios.request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * @description 修改用户头像
 */
export const changeUserTou = (
    formData
                          ) => {
    return axios.request({
        url: 'user/modeTou',
        data: formData,

        method: 'post'
        // file:file
    })
}

