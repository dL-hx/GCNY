import React, { Component } from 'react';
import './editor.less';
import E from 'wangeditor';
import { message } from 'antd';
// eslint-disable-next-line camelcase
import { BASE_IMG_App_Name, BASE_IMG_URL } from '@/utils/constants';

const imgUploadMode = {
  base64: 'base64',
  server: 'server',
  config: 'server',
};

class WangEditor extends Component {

  constructor(props) {
    super(props);
    // 创建用来保存ref标识的标签对象的容器
    this.editorRef = React.createRef(); // 编辑器实例
    // this.editorRef.on('change', this.handleChange);
  }

  componentDidMount() {
    this.initEditor();
  }

  initEditor = () => {
    this.editor = new E(this.editorRef.current);
    this.editor.customConfig.withCredentials = true;

    if (imgUploadMode.config === imgUploadMode.server) {
      this.editor.customConfig.uploadImgServer = BASE_IMG_URL;
      this.editor.customConfig.uploadFileName = 'UploadFile';
      this.editor.customConfig.uploadImgParams = { // 上传图片时可自定义传递一些参数, 参数会被添加到formdata中
        appName: BASE_IMG_App_Name, // 配置AppName
      };


      this.editor.customConfig.debug = true; // 打开debug 模式

      /* 定义上传图片的默认名字 */
      // eslint-disable-next-line camelcase
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          if (result) {
            const { url } = result;
            insertImg(`http://${url}`);
          } else {
            message.info('文件上传失败');
          }
        },
      };

    } else {
      this.editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
    }


    this.editor.customConfig.onchange = (html) => {
      // html 即变化之后的内容
      this.props.onChange(html);
    };
    this.editor.create();
  };

  render() {
    return (
      <div className='wang-editor' ref={this.editorRef}/>
    );
  }
}

export default WangEditor;
