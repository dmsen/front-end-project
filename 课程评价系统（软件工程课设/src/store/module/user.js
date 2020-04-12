import {
  login,
  logout, updataUser,updataPersonUser,changeHutUserTou,getNotice
} from '@/api/user'
import {
  setToken,
  getToken,
  setUserId,
  setUserName,
  getUserId,
  getUserName,
  setUserImage,
    getUserImage
} from '@/libs/util'
import {
  Message
} from 'iview'
import {
  errMessage
} from '@/api/index'
export default {
  state: {
    userName: getUserName(),
    userId: getUserId(),
    avatorImgPath:getUserImage(),
    token: getToken(),
    access: '',
    hasGetInfo: false,
    userInfo: null
  },
  mutations: {
    setAvator(state, img) {
      state.avatorImgPath = img;
      setUserImage(img)
    },
    setUserId(state, id) {
      state.userId = id;
      setUserId(id)
    },
    setUserName(state, name) {
      state.userName = name;
      setUserName(name)
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token;
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setUserInfo(state, info) {
      state.userInfo = info
    }
  },
  actions: {
    /**
     * @description 登陆
     * @param  {[methods]} options.commit   [操作mutations]
     * @param  {[String]} options.userName [账号]
     * @param  {[String]} options.password [密码]
     * @return {[promise]}                  [返回结果]
     */
    handleLogin({
      commit
    }, {
      userName,
      password,
      optionLevel
    }) {
      const _this = this;
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          optionLevel
        }).then(res => {
          console.log(res);
            if(res.data.result === 2){
                errMessage(res.data.result)
            }
            else if (res.data.result === 3)
            {
                Message.error("用户名账号或密码错误，请检查登录方式或直接使用最高管理员的账号密码登录");
            }
            else if (res.data.result === 4)
            {
                Message.error("请检查登录方式或直接使用最高管理员的账号密码登录");
            }
            else if (res.data.result === 5)
            {
                Message.error("用户不存在");
            }
            else if (res.data.result === 6)
            {
                Message.error("密码错误");
            }
            else {
                if (res.data.msg.id) {
                    const {
                        jurisdiction,
                        id,
                        userName,
                        userTou
                    } = res.data.msg;
                    commit('setUserInfo', res.data.msg)
                    commit('setToken', jurisdiction)
                    commit('setUserId', id)
                    commit('setUserName', userName)
                    // console.log(sessionStorage.getItem('avatorImgPath'))
                    commit('setAvator', userTou)
                    resolve("success");
                } else {
                    // console.log("登陆失败")
                    Message.error("登陆失败");
                }
            }

        }).catch(err => {
          if (err.response !== undefined) {
            errMessage(err.response)
          } else {
            Message.error("登陆失败")
          }
          reject(err)
        })
      })
    },
    /**
     * @description 退出登陆
     * @param  {[data]} options.state  [调用state]
     * @param  {[methods]} options.commit [操作mutations]
     * @return {[promise]}                [返回结果]
     */
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
      handchange({commit},
                 {
                     id,
                     name,
                     password,
                     remark,
                     role,
                 }
      ) {
          return new Promise((resolve, reject) => {
              updataUser(
                  {
                      id,
                      name,
                      password,
                      remark,
                      role,
                  }
              ).then(res => {
                  const data = res.data;
                  if (data.status === 1) {} else {
                      // commit('setToken', data.data.jurisdiction)
                  }
                  resolve(data);
              }).catch(err => {
                  reject(err)
              })
          })
      },
      handPersonchange({commit},
                 {
                     id,
                     name,
                     password,
                     remark,
                     status
                 }
      ) {
          return new Promise((resolve, reject) => {
              updataPersonUser(
                  {
                      id,
                      name,
                      password,
                      remark,
                      status
                  }
              ).then(res => {
                  const data = res.data;
                  if (data.status === 1) {} else {
                      // commit('setToken', data.data.jurisdiction)
                  }
                  resolve(data);
              }).catch(err => {
                  reject(err)
              })
          })
      },
      UserTouChange({commit},
                    formData
      ) {
          return new Promise((resolve, reject) => {
              changeHutUserTou(
                  formData
              ).then(res => {
                  const data = res.data;
                  if (data.status === 1) {} else {
                      // commit('setToken', data.data.jurisdiction)
                  }
                  resolve(data);
              }).catch(err => {
                  reject(err)
              })
          })
      },
      handGetNotice({commit},
                    {userId}
      ) {
          return new Promise((resolve, reject) => {
              getNotice(
                  {userId}
              ).then(res => {
                  const data = res.data;
                  if (data.status === 1) {} else {
                      // commit('setToken', data.data.jurisdiction)
                  }
                  resolve(data);
              }).catch(err => {
                  reject(err)
              })
          })
      },
      //失败例子
      // handchangedsc({
      //                id,
      //                name,
      //                password,
      //                remark,
      //                role,
      //              }) {
      //     return new Promise((resolve, reject) => {
      //         resolve( updataUser({
      //             id,
      //             name,
      //             password,
      //             remark,
      //             role,
      //         }))
      //     })
      // },

    /**
     * @description 获取登陆信息
     * @param  {[data]} options.state  [调用state]
     * @param  {[methods]} options.commit [操作mutations]
     * @return {[promise]}                [返回结果]
     */
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        // commit('setAvator', 'http://www.dmsen.cn/static/ali_index_files/img/pictou.jpg')
        // commit('setAvator', 'http://www.dmsen.cn/static/ali_index_files/img/pic2.jpg')
        commit('setAvator',   state.avatorImgPath);
        commit('setAccess', [state.token].map(Number));
        commit('setHasGetInfo', true);
        commit('setUserId', state.userId);
        commit('setUserName', state.userName);
        resolve()
      })
    }
  }
}
