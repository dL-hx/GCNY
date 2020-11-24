import React, { Component, createRef } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAddOrUpdateText } from '@/utils/utils';
import { formItemLayout, offsetLayout, wangEditorLayout } from '@/utils/constants';
import CardWrapper from '@/components/CardWrapper';
import router from 'umi/router';
import WangEditor from '@/components/MyWangeditor';

@connect(({ info, loading }) => ({
  info,
  loading: loading.effects['info/addOrUpdate'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Details extends Component {

  details = {};

  constructor(props) {
    super(props);
    this.contentRef = createRef(); // 描述
  }

  componentDidMount() {
    const details = this.props.location.state; // 如果是添加空值, 否则有值
    this.isUpdate = !!details; // 保存是否是更新的标识

    // 保存(如果没有, 保存是{})
    if (this.isUpdate) {
      const { articleid, channelid, title, content, author, articleabstract, source } = details.details;

      this.details = {
        articleid,
        channelid,
      };

      this.props.form.setFieldsValue({
        title, // 标题
        author, // 作者
        source, // 来源
        articleabstract, // 描述
        content, // 内容
      });

      this.contentRef.current.editor.txt.html(content);// 因为是Dom的操作, 使用 .txt.html 提供的方法设置值
    }
  }


  handleSubmit = e => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('提交时候的Details', values);
        const { dispatch } = this.props;
        // 如果是更新, 需要添加userid
        if (this.isUpdate) {
          values.articleid = that.details.articleid;
        }

        // 2. 调用接口请求函数去添加/更新
        dispatch({
          type: 'info/addOrUpdate',
          values: {
            channelid: that.details.channelid,
            ...values,
          },
          successCall: (msg) => {
            message.success(msg);
            router.push('/info');
          },
          failedCall: (msg) => {
            message.warn(msg);
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      loading,
    } = this.props;

    const { isUpdate } = this;

    return (
      <PageHeaderWrapper title={`信息资讯-${getAddOrUpdateText(isUpdate)}`}>
        <CardWrapper>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label='标题'>
              {getFieldDecorator('title', {
                rules: [
                  { required: true, message: '请输入标题' },
                ],
              })(<Input placeholder="请输入标题" allowClear/>)}
            </Form.Item>
            <Form.Item label='作者'>
              {getFieldDecorator('author', {
                rules: [{
                  required: true,
                  message: '请输入作者',
                }],
              })(<Input placeholder="请输入作者" allowClear/>)}
            </Form.Item>

            <Form.Item label="来源">
              {getFieldDecorator('source', {
                rules: [{ required: true, message: '请输入来源' }],
              })
              (
                <Input placeholder="请输入来源" allowClear/>,
              )}
            </Form.Item>

            <Form.Item label='描述'>
              {getFieldDecorator('articleabstract', {
                rules: [{
                  required: true,
                  message: '请输入描述',
                }],
              })(<Input placeholder="请输入描述" allowClear/>)}
            </Form.Item>

            <Form.Item label="内容" {...wangEditorLayout}>
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入内容' }],
              })(
                <WangEditor
                  ref={this.contentRef}
                  onChange={(name, html) => {
                    setFieldsValue({ // 通过 this.props.form.setFieldsValue 为第三方组件设置值
                      'content': html,
                    });
                  }}
                />,
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
