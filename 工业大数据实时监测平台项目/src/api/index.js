import {
  Message
} from 'iview'
/**
 * @description 参数转换
 */
export const paramsTransfor = (params, vals) => {
  let _params = new URLSearchParams();
  for (let _i = 0, length = vals.length; _i < length; _i++) {
    _params.append(params[_i], vals[_i]);
  }
  return _params;
}
/**
 * @description 错误提示message
 */
export const errMessage = (status) => {
  switch (status) {
    case 1:
      Message.error("未知错误");
      break;
    case 400:
      Message.error("参数错误");
      break;
    case 401:
      Message.error("登陆状态已过期");
      break;
    case 405:
      Message.error("请求方法错误");
      break;
    case 409:
      Message.error("添加对象已存在");
      break;
    case 408:
      Message.error("请求超时");
      break;
    case 500:
      Message.error("网络错误");
      break;
      case 2:
          Message.error("用户名/密码不能为空");
          break;
    default:
      Message.error("未知错误");
  }
}
