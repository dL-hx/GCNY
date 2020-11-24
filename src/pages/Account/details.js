import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Radio, Form, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAddOrUpdateText } from '@/utils/utils';
import { formItemLayout, offsetLayout } from '@/utils/constants';
import CardWrapper from '@/components/CardWrapper';
import router from 'umi/router';

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/addOrUpdate'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Details extends Component {

  details = {};

  componentDidMount() {
    const details = this.props.location.state; // 如果是添加空值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!details;
    // 保存(如果没有, 保存是{})
    if (this.isUpdate) {
      const { userId, name, phone, email, isExpert } = details.details;
      this.details = {
        userId,
      };

      this.props.form.setFieldsValue({
        name,
        phone,
        email,
        isExpert,
      });

    }
  }


  handleSubmit = e => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        values.isExpert = !!values.isExpert;
        // 如果是更新, 需要添加userId
        if (this.isUpdate) {
          values.userId = that.details.userId;
        }
        // 2. 调用接口请求函数去添加/更新
        dispatch({
          type: 'account/addOrUpdate',
          values,
          successCall: (msg) => {
            message.success(`${msg}默认密码是: 111111`);
            router.push('/account');
          },
          failedCall: (msg) => {
            message.warn(msg);
          },
        });
      }
    });
  };

  // 校验联系电话
  validCheckedPhone = (rule, value, callback) => {
    if (value && !(/^1[34578]\d{9}$/.test(value))) {
      callback('请输入正确的手机号');
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title={`账户管理-${getAddOrUpdateText(this.isUpdate)}`}>
        <CardWrapper>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label='姓名'>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入姓名' },
                ],
              })(<Input placeholder="请输入姓名" allowClear/>)}
            </Form.Item>
            <Form.Item label='手机号'>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入手机号',
                }, {
                  validator: this.validCheckedPhone,
                }],
              })(<Input placeholder="请输入手机号" allowClear/>)}
            </Form.Item>

            <Form.Item label='邮箱'>
              {getFieldDecorator('email', {})(<Input placeholder="请输入邮箱" allowClear/>)}
            </Form.Item>

            <Form.Item label="是否专家">
              {getFieldDecorator('isExpert', {
                rules: [
                  { required: true, message: '请选择是否专家' },
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>

            <Form.Item {...offsetLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            </Form.Item>
          </Form>
        </CardWrapper>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
