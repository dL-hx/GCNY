/*
包括一些通用的配置式方法
*/

const MyStatus = { // 状态对象
  changeStatus: (status) => {// 状态审核改变方法
    const config = {
      0: '未审核',
      1: '已审核',
    };
    return config[status];
  },
};


const CommonMethod = { // 通用方法对象
  ...MyStatus,
};

export default CommonMethod;
