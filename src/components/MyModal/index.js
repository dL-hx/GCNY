import React, { Component } from 'react';
import { Modal } from 'antd';

import styles from './index.less';

class MyModal extends Component {
  static defaultProps = {
    title: '标题',
    width: 700,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  setContentText = (param) => {
    this.setState({
      contentText: param,
    });
  };


  handleOk = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { title, width, children } = this.props;
    const { visible, contentText } = this.state;

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        width={width}
        destroyOnClose
      >
        {title ? '' : <div style={{ fontSize: 10, marginBottom: 10, color: '#9E9E9E' }}>刚刚</div>}
        <div
          dangerouslySetInnerHTML={{ __html: contentText }}
          className={styles.content}
        />

        {children}
      </Modal>
    );
  }
}

export default MyModal;
