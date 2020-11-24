import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import { BASE_IMG_App_Name, BASE_IMG_URL as BASE_File_URL } from '@/utils/constants';
import { getImgUrlList } from '@/utils/utils';

const { Dragger } = Upload;

const props = {
  name: 'UploadFile',
  multiple: true,
  action: BASE_File_URL,
  data: { appName: BASE_IMG_App_Name },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
      let urls= [...info.fileList]

      console.log(1111,getImgUrlList(urls));
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class MyUpload extends Component {

  render() {
    return (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">上传文件</p>
        <p className="ant-upload-hint">
          支持单次或批量上传。
        </p>
      </Dragger>
    );
  }
}

export default MyUpload;
