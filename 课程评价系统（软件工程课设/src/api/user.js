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
        url: 'test_hutLogin',
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
};


/**
 * @description 获取所有用户
 */
export const getUsers = ({sendPage}) => {
    return axios.request({
        url: '/hutUser/get',
        method: 'post',
        data:{
            sendPage:sendPage
        }

    })
};

/**
 * @description 增加用户
 */
export const addHutUser = ({
                            jurisdiction,
                            name,
                            password,
                            remark,
                            status
                        }) => {
    return axios.request({
        url: 'hutUser/add',
        data: {
            userName: name,
            jurisdiction: Number(jurisdiction),
            password: password,
            remarks: remark,
            status: Number(status)
        },
        method: 'post'
    })
};

/**
 * @description 删除用户
 */
export const deleteUser = ({
                               id ,userId
                           }) => {
    return axios.request({
        url: 'hutUser/del' ,
        data: {
            id: id,
            userId:Number(userId)
        },
        method: 'post'
    })
};


/**
 * @description 修改个人信息
 */
export const updataPersonUser = ({
                                     id,
                                     name,
                                     password,
                                     remark,
                                     status
                           }) => {
    return axios.request({
        url: 'hutUser/updata',
        data: {
            id: id,
            userName: name,
            password: password,
            remarks: remark,
            status: status,
        },
        method: 'post'
    })
};


/**
 * @description 修改用户头像
 */
export const changeHutUserTou = (
    formData
) => {
    return axios.request({
        url: 'hutUser/modeTou',
        data: formData,

        method: 'post'
        // file:file
    })
};



/**
 * @description 课程评价
 */
export const noticeSub = ({
                              hutUserId,userName,content,evaDate
                           }) => {
    return axios.request({
        url: 'hutUser/notice',
        data: {
            userName :userName,
            hutUserId: hutUserId.toString(),
            courseEvaluateMsg:content,
            courseEvaluateDate: evaDate,
        },
        method: 'post'
    })
};



/**
 * @description 获取用户对应的通知
 */
export const getNotice = (  {userId}) => {
    return axios.request({
        url: 'hutUser/getNotice',
        method: 'post',
        data:{
            userId:userId
        }

    })
};












/**
 * @description 登陆
 */
// export const login = ({
//   userName,
//   password,
//   optionLevel
// }) => {
//   return axios.request({
//     // url: '/user/login',
//       url: 'test_login',
//     data: {
//       userName: userName,
//       password: password,
//       optionLevel:optionLevel
//     },
//       // headers: {
//       //     'Content-Type': 'application/x-www-form-urlencoded',
//       //     'Access-Control-Allow-Origin':'*'
//       // },
//     method: 'post'
//   })
// }

/**
 * @description 增加用户
 */
export const addUser = ({
  jurisdiction,
  name,
  password,
  remark,
  status
}) => {
  return axios.request({
    url: 'user/add',
    data: {
      userName: name,
      jurisdiction: jurisdiction,
      password: password,
      remarks: remark,
      status: status
    },
    method: 'post'
  })
};

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

