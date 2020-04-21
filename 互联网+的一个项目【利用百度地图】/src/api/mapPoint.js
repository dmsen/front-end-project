import axios from '@/libs/api.request';
/**
 * @description 获取所有标记点
 */
export const mapPointGet = (sendPage) => {
    return axios.request({
        url: 'mapPoint/get',
        method: 'post',
        data:{
            sendPage:sendPage
        }

    })
};


/**
 * @description 搜索所有标记点
 */
export const mapPointSearch = ({sendPage,searchValue}) => {
    return axios.request({
        url: 'mapPoint/search',
        method: 'post',
        data:{
            sendPage:sendPage,
            searchValue:searchValue
        }

    })
};

/**
 * @description 增加课程
 */
export const addPoint = ({
                             mapPointName,
                             mapPointJ,
                             mapPointW,
                             mapPointAddr,
                             mapPointTel,
                             mapPointBedNum,
                             mapPointFee,
                             mapPointJian,
                             mapPointServer
                          }) => {
    return axios.request({
        url: 'mapPoint/add',
        data: {
            mapPointName: mapPointName,
            mapPointJ: mapPointJ,
            mapPointW: mapPointW,
            mapPointAddr:mapPointAddr,
            mapPointTel:mapPointTel,
            mapPointBedNum:Number(mapPointBedNum),
            mapPointFee:Number(mapPointFee),
            mapPointJian:mapPointJian,
            mapPointServer:mapPointServer
        },
        method: 'post'
    })
};


/**
 * @description 上传图片
 */
export const addMapImage = (
    formData
) => {
    return axios.request({
        url: 'mapPoint/add',
        data: formData,

        method: 'post'
        // file:file
    })
};












/**
 * @description 删除课程
 */
export const deleteCourse = ({
                               id ,hutCourseId
                           }) => {
    return axios.request({
        url: 'hutCourse/del' ,
        data: {
            id: id,
            hutCourseId:Number(hutCourseId)
        },
        method: 'post'
    })
};

/**
 * @description 增加课程
 */
export const addCourse = ({
                              hutCourseName, hutCourseDescribe, hutCourseTeacher
                          }) => {
    return axios.request({
        url: 'hutCourse/add',
        data: {
            hutCourseName: hutCourseName.toString(),
            hutCourseDescribe: hutCourseDescribe.toString(),
            hutCourseTeacher: hutCourseTeacher.toString(),
        },
        method: 'post'
    })
};

/**
 * @description 修改课程
 */
export const modCourse = ({
                              hutCourseId,
                              hutCourseName,
                              hutCourseDescribe,
                              hutCourseTeacher
                          }) => {
    return axios.request({
        url: 'hutCourse/mode',
        data: {
            hutCourseId:hutCourseId,
            hutCourseName: hutCourseName.toString(),
            hutCourseDescribe: hutCourseDescribe.toString(),
            hutCourseTeacher: hutCourseTeacher.toString(),
        },
        method: 'post'
    })
};


/**
 * @description 课程评价
 */
export const evalateSub = ({
                               hutCourseId,usrId,content,rate,evaDate
                          }) => {
    return axios.request({
        url: 'hutCourse/evl',
        data: {
            userid :usrId,
            hutCourseId: hutCourseId.toString(),
            courseEvaluateMsg:content,
            grade: rate,
            courseEvaluateDate: evaDate,
        },
        method: 'post'
    })
};

/**
 * @description 获取最新的课程评价
 */
export const handGetEvl = (sendPage) => {
    return axios.request({
        url: 'hutCourse/evlGet',
        method: 'post',
        data:{
            sendPage:sendPage,
        }

    })
};
