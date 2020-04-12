import axios from '@/libs/api.request';

export const getHistory = ({
  req,
}) => {
  return axios.request({
    method: "post",
    data: req,
    url: "data/historyDatas"
  })
}
/**
 * @description 根据设备id和监控点id获取历史数据信息限制条数
 */
export const getHistoryDate = ({
  sendJson,
}) => {
  return axios.request({
    url: '/data/historyDatasLimitCount',
    data: sendJson,
    method: "post",
  })
};

export const getHistoryDate2 = ({
                                   sendJson,
                               }) => {
    return axios.request({
        url: '/data/historyDatasLimitCount2',
        data: sendJson,
        method: "post",
    })
};

export const getHistoryDate3 = ({
                                   sendJson,
                               }) => {
    return axios.request({
        url: '/data/historyDatasLimitCount3',
        data: sendJson,
        method: "post",
    })
};

export const getHistoryContrast = ({
                               req,
                           }) => {
    return axios.request({
        method: "post",
        data: req,
        url: "data/Contrast"
    })
}