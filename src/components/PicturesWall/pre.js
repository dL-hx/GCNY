import React from 'react';

import { Modal, Upload } from 'antd';
import PropTypes from 'prop-types';

class PicturesPreWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { disabled, initialValue } = this.props;

    return (<div>
        <Upload
          name='UploadFile'
          listType="picture-card"
          fileList={initialValue}
          onPreview={this.handlePreview}
          disabled={disabled}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}

PicturesPreWall.defaultProps = {
  disabled: true,
  maxLength: 1,
  initialValue: [],
};

PicturesPreWall.propTypes = {
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  initialValue: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  })),
};

export default PicturesPreWall;
