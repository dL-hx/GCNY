import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Video extends PureComponent {

  render() {// 不是管理员展示新增按钮
    const { size, src } = this.props;

    return (
      <video width={size.width} height={size.height} controls>
        <source src={src} type="video/mp4"/>
        您的浏览器不支持Video标签。
      </video>
    );
  }
}

Video.defaultProps = {
  size: {
    width: '100%',
    height: '240',
  },
};

Video.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.object,
};

export default Video;

