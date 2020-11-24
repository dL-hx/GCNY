/*
包含一些常量值的模块
 */
const PAGE_SIZE = 10; // 每页显示的记录数
const BASE_IMG_URL = 'http://v02.upload.wiimedia.top/api/upload'; // 上传图片的基础路径
const BASE_IMG_App_Name = 'GCHT'; // 上传图片的AppName , 可以任意指定

const ENABLE_COLOR = 'green';
const DISABLE_COLOR = 'volcano';

const ExpertDefaultImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552295041342&di=367ec1c2884ff944e98fc7182a879edc&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F761e226fa727a6f986699afd8795deb41511e00b4d5e-dEBN7j_fw658';

const AuditingConfig = { // 审核的配置
  confirm: '已审核',
  cancel: '未审核',
};

const tableOptionConfig = {// 表格配置项
  add: '新增',
  edit: '编辑',
};

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};

const offsetLayout = {
  wrapperCol: {
    xs: 4,
    sm: {
      span: 8,
      offset: 8,
    },
  },
};


const wangEditorLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
};

export {
  PAGE_SIZE,
  BASE_IMG_URL,
  BASE_IMG_App_Name,

  ENABLE_COLOR,
  DISABLE_COLOR,

  formItemLayout,
  offsetLayout,
  wangEditorLayout,

  /*--专家默认头像--*/
  ExpertDefaultImg,

  /*--审核--*/
  AuditingConfig,

  /*--表格配置--*/
  tableOptionConfig,
};
