import React from 'react';
import { Form, Input, InputNumber, DatePicker } from 'antd';
import EditableContext  from '@/components/EditableTable/TableContext';
import moment from 'moment';
import PicturesWall from '@/components/PicturesWall';
import { setImgUrlList } from '@/utils/utils';

class EditableCell extends React.Component {

  getInput = (setFieldsValue) => {
    const { inputType, dateformat, dataIndex } = this.props;

    if (inputType === 'NUMBER') {
      return <InputNumber />;
    }

    if (inputType === 'DATE') {
      return <DatePicker
        showTime
        format={dateformat}
      />;
    }

    if (inputType === 'IMAGE_UPLOAD') {
      return <PicturesWall
        smallSize
        numberOfLimit={3}
        handleFileChange={(fileList) => {
          setFieldsValue({
            [dataIndex]: fileList,
          });
        }}
      />;
    }

    return <Input />;
  };

  getInitialValue = () => {
    const { record, dataIndex, dateformat, inputType } = this.props;
    const text = record[dataIndex];

    if (inputType === 'DATE') {
      return text && moment(text, dateformat);
    }

    if (inputType === 'IMAGE_UPLOAD') {
      return text&&setImgUrlList(text);
    }
    return text;
  };

  renderCell = ({ getFieldDecorator,setFieldsValue }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入${title}!`,
                },
              ],
              initialValue: this.getInitialValue(),
            })(this.getInput(setFieldsValue))}
          </Form.Item>
        ) : (
          React.Children.map(children, child => {
            if (child && child.length !== 0&&inputType === 'IMAGE_UPLOAD') {
              const initList= setImgUrlList(child);
              return  <PicturesWall
                disabled
                smallSize
                initList={initList}
              />
            }
            return child;
          })
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

export default EditableCell;
