import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, DatePicker, Form, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAddOrUpdateText, getIndexPath, getImgUrlList } from '@/utils/utils';
import { formItemLayout, offsetLayout } from '@/utils/constants';
import CardWrapper from '@/components/CardWrapper';
import router from 'umi/router';
import PicturesWall from '@/components/PicturesWall';
import moment from 'moment';

const { TextArea } = Input;

@connect(({ sellBuy, loading }) => ({
  sellBuy,
  loading: loading.effects['sellBuy/addOrUpdate'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Details extends Component {
  details = {};

  componentDidMount() {
    const { details } = this.props.location.state; // 如果是添加空值, 否则有值
    this.isUpdate = !!details; // 保存是否是更新的标识

    // 保存(如果没有, 保存是{})
    if (this.isUpdate) {
      const {
        aId,
        title,
        content,
        author,
        source,
        seoKeyword,
        imgUrl,
        startTime,
        endTime,
      } = details;
      this.details = {
        aId,
      };

      this.props.form.setFieldsValue({
        title, // 标题
        author, // 作者
        source, // 来源
        content, // 内容
        seoKeyword,
        imgUrl,
        startTime: startTime && moment(startTime, 'YYYY-MM-DD HH:mm:ss'),
        endTime: endTime && moment(endTime, 'YYYY-MM-DD HH:mm:ss'),
      });
    }
  }
  /* 
  getImgStr = (values) => { // 计算ImgUrlStr
    const imgUrlElement = values.imgUrl[0];
    if (this.isUpdate) {
      return imgUrlElement.url;
    }
    return (imgUrlElement.response.url.indexOf('http://') === -1 ? 'http://' : '') + imgUrlElement.response.url;
  };
*/

  // 校验联系电话
  validCheckphone = (rule, value, callback) => {
    if (value && !/^1[34578]\d{9}$/.test(value)) {
      callback('请输入正确的手机号');
    } else {
      callback();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const that = this;
    that.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        values.imgUrl = getImgUrlList(values.imgUrl);
        values.startTime = values.startTime.format('YYYY-MM-DD HH:mm:ss');
        values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss');

        // warning: 此处使用 seoKeyword 参数 充当 phone 参数， 不要修改
        values.phone  = values.seoKeyword 

        // 如果是更新, 需要添加userid
        if (that.isUpdate) {
          values.aId = that.details.aId;
        }
        const {
          parentConfig: { headerTitle, ...rest },
        } = that.props.location.state;

        // 2. 调用接口请求函数去添加/更新
        dispatch({
          type: 'sellBuy/addOrUpdate',
          values: {
            ...rest,
            ...values,
          },
          successCall: msg => {
            message.success(msg);
            router.push(getIndexPath()); // 返回上一级页面
          },
          failedCall: msg => {
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
    const { parentConfig } = this.props.location.state;
    return (
      <PageHeaderWrapper title={`${parentConfig.headerTitle}-${getAddOrUpdateText(isUpdate)}`}>
        <CardWrapper>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="标题">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入标题' }],
              })(<Input placeholder="请输入标题" allowClear />)}
            </Form.Item>

            <Form.Item label="联系人">
              {getFieldDecorator('author', {
                rules: [{ required: true, message: '请输入联系人' }],
              })(<Input placeholder="请输入联系人" allowClear />)}
            </Form.Item>

            <Form.Item label="电话">
              {getFieldDecorator('seoKeyword', {
                rules: [
                  {
                    required: true,
                    message: '请输入电话',
                  },
                  {
                    validator: this.validCheckphone,
                  },
                ],
              })(<Input placeholder="请输入电话" allowClear />)}
            </Form.Item>

            <Form.Item label="地址">
              {getFieldDecorator('source', {
                rules: [{ required: true, message: '请输入地址' }],
              })(<Input placeholder="请输入地址" allowClear />)}
            </Form.Item>

            <Form.Item label="图片">
              {getFieldDecorator('imgUrl',{

              })(
                <PicturesWall
                  numberOfLimit={4}
                  handleFileChange={fileList => {
                    setFieldsValue({
                      // 通过 this.props.form.setFieldsValue 为第三方组件设置值
                      imgUrl: fileList,
                    });
                  }}
                />
              )}
            </Form.Item>

            <Form.Item label="有效期开始">
              {getFieldDecorator('startTime', {
                rules: [{ required: true, message: '请输入有效期开始' }],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择开始时间"
                />
              )}
            </Form.Item>

            <Form.Item label="有效期结束">
              {getFieldDecorator('endTime', {
                rules: [{ required: true, message: '请输入有效期结束' }],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择结束时间"
                />
              )}
            </Form.Item>

            <Form.Item label="内容">
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入内容' }],
              })(<TextArea rows={4} />)}
            </Form.Item>

            <Form.Item {...offsetLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </CardWrapper>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
