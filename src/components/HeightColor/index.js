import React from 'react';

const HeightColor = (() => { // Singleton pattern

  const spanStyles = { // 高亮文本的样式设置
    backgroundColor: 'yellow',
    color: '#a44a44',
  };

  return {
    /**
     * 关键字高亮方法
     * @param data 传入匹配的数据
     * @param keyWords 关键字
     * @returns {*}
     */
    heightText: (data, keyWords) => {
      return keyWords && data.includes(keyWords) ? <span style={spanStyles}>{data}</span> : data;
    },
  };
})();

export default HeightColor;
