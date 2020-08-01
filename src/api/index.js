import {postAjax} from "@/plugins/axios";

// 查找用户文章
export const findArticle =(params) => postAjax('/article/findArticle',params)

// 查询用户担保申请信息
export const findReportInfoList = (params) => postAjax('reportinfo/findReportInfoList', params)