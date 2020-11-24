// src/components/BaseForm/index.js
import React, { Fragment } from 'react';
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker } from 'antd';
import utils from '@/utils/libs';
import AddButton from '@/components/MyButton/AddButton';
import { auditConfig } from '@/utils/constants';

const { Utils } = utils;

const FormItem = Form.Item;

class FilterForm extends React.Component {

  handleFilterSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();// 获取表单的值
    this.props.filterSubmit(fieldsValue); // 将子组件的值传递到父组件(order.js)
  };

  initFormList = () => {
    const { getFieldDecorator } = this.props.form;
    const formList = this.props.formList; // 从父组件Order.js 中获取该对象进行使用
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label || '';
        let field = item.field;

        let initialValue = item.initialValue || ''; //默认给空字符串
        let placeholder = item.placeholder || '';
        let width = item.width;
        /*        if (item.type == '城市') {
                  const city = <FormItem label="城市" key={field}>
                    {
                      getFieldDecorator('city',{
                        initialValue:'0'
                      })(
                        <Select
                          style={{width: 80}}
                          placeholder={placeholder}
                        >
                          {Utils.getOptionList([{id:'0',name:'全部'},{id:'1',name:'北京'},{id:'2',name:'上海'},{id:'3',name:'天津'},{id:'4',name:'杭州'}])}
                        </Select>
                      )
                    }
                  </FormItem>;
                  formItemList.push(city);

                } else if (item.type == '时间查询') {
                  const begin_time = <FormItem label="订单时间" key={field}>
                    {
                      getFieldDecorator('begin_time')(
                        <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                      )
                    }
                  </FormItem>;
                  formItemList.push(begin_time);

                  const end_time = <FormItem label="~" colon={false} key={field}>
                    {
                      getFieldDecorator('end_time')(
                        <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                      )
                    }
                  </FormItem>;
                  formItemList.push(end_time);

                } */

        if (item.type == 'INPUT') {
          // 中括号 [变量]  ,会将其看作变量对待
          const INPUT = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue,
              })(
                <Input
                  style={{ width }}
                  placeholder={placeholder}
                />,
              )
            }
          </FormItem>;
          formItemList.push(INPUT);
        } else if (item.type == 'SELECT') {
          // 中括号 [变量]  ,会将其看作变量对待
          const SELECT = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue,
              })(
                <Select
                  style={{ width: width }}
                  placeholder={placeholder}
                >
                  {Utils.getSelectOptionList(item.list)}
                </Select>,
              )
            }
          </FormItem>;
          formItemList.push(SELECT);
        } else if (item.type == 'CHECKBOX') {
          const CHECKBOX = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                valuePropName: 'checked', // 设置checkbox的属性
                initialValue: initialValue, // true | false
              })(
                <Checkbox>
                  {label}
                </Checkbox>,
              )
            }
          </FormItem>;
          formItemList.push(CHECKBOX);
        } else if (item.type == 'RADIOGROUP') {
          const RADIOGROUP = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                buttonStyle: 'solid', // 设置buttonStyle的属性
                initialValue: initialValue, // true | false
              })(
                <Radio.Group buttonStyle="solid">
                  {Utils.getRadioOptionList(item.list)}
                </Radio.Group>,
              )
            }
          </FormItem>;
          formItemList.push(RADIOGROUP);
        } else if (item.type == 'DATE') {
          const Date = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field])(
                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>,
              )
            }
          </FormItem>;
          formItemList.push(Date);
        }
      });
    }
    return formItemList;
  };

  renderButton = () => {
    const { addButton, auditButton } = this.props;
    const buttonItemList = [];

    if (addButton) {
      const { pathname } = addButton;
      const addButtonItem = <AddButton pathname={pathname} details={{}}>新增</AddButton>;
      buttonItemList.push(addButtonItem)
    }

    if (auditButton) {
      const { auditKeys, auditSubmit } = auditButton;
      const { length } = auditKeys;

      const auditButtonItem = <Fragment>
        <Button
          type="primary"
          onClick={() => {
            auditSubmit(auditKeys, auditConfig.confirm);
          }}
          disabled={!length}
        >
          审核通过
        </Button>

        <Button
          type="primary"
          style={{ margin: '0 16px' }}
          onClick={() => {
            auditSubmit(auditKeys, auditConfig.cancel);
          }}
          disabled={!length}
        >
          审核撤销
        </Button>
        {length > 0 && `已选 ${length} 条`}
      </Fragment>;

      buttonItemList.push(auditButtonItem)
    }

    return buttonItemList;
  };

  render() {
    return (
      <Form layout="inline">
        {this.initFormList()}
        <FormItem>
          <Button type="primary" style={{ margin: '0 16px' }} onClick={this.handleFilterSubmit}>查询</Button>
          {this.renderButton()}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({})(FilterForm);
