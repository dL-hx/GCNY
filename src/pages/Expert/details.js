import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Cascader, Form, Input, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '@/components/PicturesWall';
import { getAddOrUpdateText, getImgUrlList } from '@/utils/utils';
import { formItemLayout, offsetLayout } from '@/utils/constants';
import CardWrapper from '@/components/CardWrapper';
import router from 'umi/router';
import IframeComm from 'react-iframe-comm';

import expertDetailsCategory from '../../../localData/expert';

const { TextArea } = Input;

@connect(({ expert, loading }) => ({
  expert,
  loading: loading.effects['expert/addOrUpdate'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Details extends Component {

  details = {};


    attributes = {
      src: '../../map/map.html',
      width: '100%',
      height: '550',
      frameBorder: 0,
    };

    state = {
      lng: '',
      lat: '',
      visible: false,
    };

  componentDidMount() {
    const details = this.props.location.state; // 如果是添加空值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!details;
    // 保存(如果没有, 保存是{})
    if (this.isUpdate) {
      const { key1, ...rest } = details.details;
      const { positivebrief, jobbrief } = details.details.key1 && JSON.parse(details.details.key1) || {};
      this.details = {
        positivebrief,
        jobbrief,
        ...rest,
      };

      this.props.form.setFieldsValue({
        imgs: details.details.imgs,
      });
    }
  }


  handleSubmit = e => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const obj = JSON.stringify({
          jobbrief: values.jobbrief,
          positivebrief: values.positivebrief,
          detailedclass: values.detailedclass,
        });

        values.key1 = obj;

        values.company = `${values.company}`;

        values.imgs = getImgUrlList(values.imgs);
        const {lat, lng} = this.state

        values.lat = lat
        values.lng = lng

        const { dispatch } = this.props;

        // 如果是更新, 需要添加userid
        if (this.isUpdate) {
          values.userid = that.details.userid;
        }
        // 2. 调用接口请求函数去添加/更新
        dispatch({
          type: 'expert/addOrUpdate',
          values,
          successCall: (msg) => {
            message.success(msg);
            router.push('/expert');
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

  onOk = () => {
    const { lat, lng } = this.state;
    if (lat === '') {
      message.error('请选择所在位置');
    } else {
      this.props.form.setFieldsValue({
        longitudeAndLatitude: `${lng},${lat}`,
      });

      this.hideModal();
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

 hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  onReceiveMessage = (msg) => {
    if (msg && typeof msg.data === 'string') {
      const [lng, lat] = msg.data.split(',');
      this.setState({ lng: lng, lat: lat });
    }
  };


  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      loading,
    } = this.props;

    const { details } = this;
    return (
      <PageHeaderWrapper title={`专家管理-${getAddOrUpdateText(this.isUpdate)}`}>
        <CardWrapper>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label='姓名'>
              {getFieldDecorator('username', {
                initialValue: details.username,
                rules: [
                  { required: true, message: '请输入姓名' },
                  { max: 4, min: 2, message: '长度不在范围内' },
                ],
              })(<Input placeholder="请输入姓名" allowClear/>)}
            </Form.Item>
            <Form.Item label='手机号'>
              {getFieldDecorator('tel', {
                initialValue: details.tel,
                rules: [{
                  required: true,
                  message: '请输入手机号',
                }, {
                  validator: this.validCheckedPhone,
                }],
              })(<Input placeholder="请输入手机号" allowClear/>)}
            </Form.Item>

            <Form.Item label='职称'>
              {getFieldDecorator('job', {
                initialValue: details.job,
                rules: [
                  { required: true, message: '请输入职称' },
                  { max: 8, message: '长度不在范围内' },
                ],
              })(<Input placeholder="请输入职称" allowClear/>)}
            </Form.Item>

            <Form.Item label='工作单位'>
              {getFieldDecorator('company', {
                initialValue: details.company,
                rules: [
                  { required: true, message: '请输入工作单位' },
                  { max: 15, message: '长度不在范围内' },
                ],
              })(<Input placeholder="请输入工作单位" allowClear/>)}
            </Form.Item>

           <Form.Item label="地理坐标">
              {getFieldDecorator('longitudeAndLatitude', {
                initialValue: [details.lng,details.lat],
                rules: [{ required: true, message: '请选择所在位置' }],
              })(<Input
                placeholder="请选择所在位置"
                onClick={this.showModal}
              />)}
            </Form.Item>

            <Form.Item label="头像">
              {getFieldDecorator('imgs', {
                initialValue: details.imgs,
                rules: [{ required: true, message: '请上传头像' }],
              })(
                <PicturesWall
                  numberOfLimit={1}
                  handleFileChange={(fileList) => {
                    setFieldsValue({ // 通过 this.props.form.setFieldsValue 为第三方组件设置值
                      imgs: fileList,
                    });
                  }}
                />)}
            </Form.Item>


            <Form.Item label='专家类型'>
              {getFieldDecorator('expertchannel', {
                initialValue: details.expertchannel,
                rules: [{ required: true, message: '请输入专家类型' }],
              })(<Input placeholder="请输入专家类型" allowClear/>)}
            </Form.Item>

            {/*
            <Form.Item label='专家类型'>
              {getFieldDecorator('expertchannel', {
                initialValue: details.expertchannel,
                rules: [{ required: true, message: '请选择专家类型' }],
              })(
                <Radio.Group>
                  <Radio value="1">畜牧业</Radio>
                  <Radio value="2">种植业</Radio>
                  <Radio value="3">农业政策</Radio>
                  <Radio value="4">市场监管</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
*/}

            <Form.Item label='详细分类'>
              {
                getFieldDecorator('detailedclass', {
                  initialValue: details.detailedclass,
                })(
                  <Cascader showSearch options={expertDetailsCategory} placeholder="请选择详细分类"/>,
                )
              }
            </Form.Item>

            <Form.Item label='专业特长'>
              {getFieldDecorator('bgat', {
                initialValue: details.bgat,
                rules: [{ required: true, message: '请输入专业特长' }],
              })(<Input placeholder="请输入专业特长" allowClear/>)}
            </Form.Item>

            <Form.Item label='服务领域'>
              {getFieldDecorator('domain', {
                initialValue: details.domain,
                rules: [{ required: true, message: '请输入服务领域' }],
              })(<Input placeholder="请输入服务领域" allowClear/>)}
            </Form.Item>

            <Form.Item label="专家工作简介">
              {getFieldDecorator('jobbrief', {
                initialValue: details.jobbrief,
                rules: [{ required: false, message: '请输入工作简介' }],
              })(<TextArea rows={4}/>)}
            </Form.Item>
            <Form.Item label="专家成果简介">
              {getFieldDecorator('positivebrief', {
                initialValue: details.positivebrief,
                rules: [{ required: false, message: '请输入成果简介' }],
              })(<TextArea rows={4}/>)}
            </Form.Item>
            <Form.Item {...offsetLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            </Form.Item>
          </Form>

         <Modal
            title='地理坐标'
            visible={this.state.visible}
            okText='确定'
            cancelText='取消'
            onOk={this.onOk}
            onCancel={this.hideModal}
            width={1000}
          >
            <IframeComm
              attributes={this.attributes}
              handleReceiveMessage={this.onReceiveMessage}
            />
          </Modal>
        </CardWrapper>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
