import React, { Component } from 'react';
import { Layout, message, Modal, Form, Input } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import md5 from 'md5';
import styles from './Header.less';

const FormItem = Form.Item;
const { Header } = Layout;
const shortItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class HeaderView extends Component {
  state = {
    visible: false,
  };

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({ type: 'login/logout' });
    }
    if (key === 'amend') {
      this.setState({ visible: true });
    }
  };

  // 再输入一次密码校验
  check = (rule, value, callback) => {
    const pwd = this.props.form.getFieldValue('NewPassword');
    if (value !== pwd) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  // 修改密码确认提交
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/updatePwd', payload: {
            values: {
              OldPassword: md5(values.OldPassword),
              NewPassword: md5(values.NewPassword),
            },
            callback: (status, msg) => {
              if (status) {
                message.success('修改成功');
                this.onCancel();
                this.props.dispatch({ type: 'login/logout', payload: {} });
              } else {
                message.info(msg);
              }
            },
          },
        });
      }
    });
  };

  // 关闭弹窗
  onCancel = () => {
    this.props.form.resetFields(); // 重置一组输入控件的值
    this.setState({ visible: false });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();

    return (
      <Animate component="" transitionName="fade">
        <Header
          style={{ padding: 0, width, zIndex: 2 }}
          className={fixedHeader ? styles.fixedHeader : ''}
        >
          {isTop && !isMobile ? (
            <TopNavHeader
              theme={navTheme}
              mode="horizontal"
              onCollapse={handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              {...this.props}
            />
          ) : (
            <GlobalHeader
              onCollapse={handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              {...this.props}
            />
          )}
          <Modal
            title='修改密码'
            visible={visible}
            okText='确定'
            cancelText='取消'
            onOk={this.onOk}
            onCancel={this.onCancel}
            width={600}
          >
            <Form style={{ maxHeight: '620px', overflow: 'auto' }}>
              <FormItem label="旧密码" {...shortItemLayout}>
                {getFieldDecorator('OldPassword', {
                  rules: [{ required: true, message: '请输入旧密码' }],
                })(
                  <Input.Password placeholder="请输入旧密码"/>,
                )}
              </FormItem>
              <FormItem label="新密码" {...shortItemLayout}>
                {getFieldDecorator('NewPassword', {
                  rules: [{ required: true, message: '请输入新密码' }],
                })(
                  <Input.Password placeholder="请输入新密码"/>,
                )}
              </FormItem>
              <FormItem label="确认密码" {...shortItemLayout}>
                {getFieldDecorator('again', {
                  rules: [{ required: true, validator: this.check }],
                })(
                  <Input.Password placeholder="请确认密码"/>,
                )}
              </FormItem>
            </Form>
          </Modal>
        </Header>
      </Animate>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  setting,
}))(HeaderView);
