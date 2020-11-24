import React, { Fragment } from 'react';
import { Alert, Button, Card, Divider, Form, message, Popconfirm, Table } from 'antd';
import PropTypes from 'prop-types';
import EditableContext from './TableContext';
import EditableCell from './EditableCell';
import { getConfigWidth, getImgUrlList, isArray, isMoment } from '@/utils/utils';
import { OPTION_WEIGHT } from '@/utils/constants';

const dateformat = 'YYYY-MM-DD';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const { data, columns } = props;
    this.state = {
      data,
      editingKey: '',
    };

    this.columns = columns.length > 0 && columns.concat({
      title: '操作',
      dataIndex: 'operation',
      width: getConfigWidth(OPTION_WEIGHT),
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <a
                  onClick={() => this.save(form, record.RowId)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableContext.Consumer>
          </span>
        ) : (
          <span>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.RowId)}>
                  编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除当前项?"
              onConfirm={() => this.delete(record.RowId)}
            >
              <a disabled={editingKey !== ''}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    });
  }

  delete = (key) => {
    const { data } = this.state;
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.RowId);
    const { handleDel } = this.props;
    handleDel(newData[index]); // 将子组件的值传递到上层组件

    // newData.splice(index, 1);
    // this.setState({ data: newData, editingKey: '' });
  };

  handleAdd = () => {
    const { data, editingKey } = this.state;
    if (editingKey !== '') {
      message.warn('请先保存');
      return;
    }
    const newKey = Math.random().toString();  // Generate a unique key
    // or const newKey = Math.random().toString() or new Date()
    // or data.reduce((a, b) => {
    //       if (b.key > a) {
    //         return b.key + 1;
    //       }
    //       return a;
    //     }, 0)
    this.setState({
        data: [
          ...data,
          {
            RowId: newKey,
          },
        ],
        editingKey: newKey,
      },
    );
  };

  isEditing = record => {
    const { editingKey } = this.state;
    return record.RowId === editingKey;
  };


  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { data } = this.state;
      const newData = [...data];
      const index = newData.findIndex(item => key === item.RowId); // rowKey

      if (index > -1) {
        Object.keys(row).forEach(idx => {//
          const item = newData[index];
          const rowItem = row[idx];
          const temp = {};
          if (isArray(rowItem)) {
            temp[idx] = getImgUrlList(rowItem);
          } else if (isMoment(rowItem)) {
            temp[idx] = rowItem.format(dateformat);
          } else {
            temp[idx] = rowItem;
          }

          newData.splice(index, 1, {
            ...item,
            ...temp,
          });
        });
      }

      const { filterSubmit, columns, restTable } = this.props;
      // 将子组件的值传递到上层组件
      filterSubmit(newData[index], columns, restTable); // 将子组件的值传递到上层组件
      this.setState({ data: newData, editingKey: '' });
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns && this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dateformat,
          inputType: col.controlType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const { form, count } = this.props;
    const { data } = this.state;
    return (
      <Card>
        <EditableContext.Provider value={form}>
          {
            count > 0 && <Alert
              message={
                <Fragment>
                  总计 <a style={{ fontWeight: 600 }}>{count}</a> 项
                </Fragment>
              }
              type="info"
              showIcon
            />
          }
          <Table
            style={{ marginTop: 10 }}
            components={components}
            bordered
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false}
            rowKey='RowId'
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.handleAdd}
            icon="plus"
          >
            新增
          </Button>
        </EditableContext.Provider>
      </Card>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

EditableFormTable.propTypes = {
  filterSubmit: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  // columns: PropTypes.array.isRequired,
};

export default EditableFormTable;
