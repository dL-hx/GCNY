import React from 'react';
import { Icon, Modal, Upload } from 'antd';
// eslint-disable-next-line camelcase
import { BASE_IMG_App_Name, BASE_IMG_URL } from '@/utils/constants';
import PropTypes from 'prop-types';
import styles from './index.less';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  renderChildren = () => {
    const { initList = [], numberOfLimit, disabled, value = [] } = this.props;
    if (!disabled) {
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      );

      return (initList.length || value.length) >= numberOfLimit ? null : uploadButton;
    }
    return '';
  };

  handleChange = ({ fileList }) => {
    // console.log(fileList);
    this.props.handleFileChange(fileList);
  };


  render() {
    const { previewVisible, previewImage } = this.state;

    const { initList = [], value, smallSize, disabled } = this.props;

    const props = {
      name: 'UploadFile',
      accept: 'image/*',
      action: BASE_IMG_URL,
      data: { appName: BASE_IMG_App_Name },
      listType: 'picture-card',
      multiple: true,
      showUploadList: true,
    };

    return (
      <div className={smallSize ? styles['img-upload'] : ''}>
        <Upload
          {...props}
          disabled={disabled}
          fileList={value || initList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {this.renderChildren()}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

PicturesWall.defaultProps = {
  numberOfLimit: 1,
  disabled: false,
  smallSize: false,
  initList: [],

  handleFileChange: () => {
  },
};

PicturesWall.propTypes = {
  disabled: PropTypes.bool,
  smallSize: PropTypes.bool,                                             // 图片框/ 上传按钮的小尺寸
  numberOfLimit: PropTypes.number,                                       // 允许上传的图片张数
  handleFileChange: PropTypes.func,
};


export default PicturesWall;
