import axios from '@/libs/api.request';
/**
 * @description 获取所有课程
 */
export const hutCourseGet = (sendPage) => {
    return axios.request({
        url: '/hutCourse/get',
        method: 'post',
        data:{
            sendPage:sendPage
        }

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
export const handGetEvl = ( ) => {
    return axios.request({
        url: 'hutCourse/evlGet',
        method: 'post',
        data:{
            sendPage:1,
        }

    })
};
