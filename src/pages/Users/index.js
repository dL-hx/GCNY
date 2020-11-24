import React, { Component } from 'react';
import { connect } from 'dva';
import { Avatar, Button, Card, Form, Input, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { ExpertDefaultImg, PAGE_SIZE } from '@/utils/constants';
import { formatTime } from '@/utils/utils';

@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/fetch'], // pro 框架特有的加载loading方式
}))
@Form.create()
class User extends Component {

  componentDidMount() {
    this.requestList();
  }

  requestList = ({ pageNow = this.props.users.pageNow, searchValues = {} } = {}) => {
    this.props.dispatch({
      type: 'users/fetch',
      payload: { pageNow: pageNow, pageSize: PAGE_SIZE, ...searchValues },
    });
  };

  handleSearch = () => {
    this.props.form.validateFields((err, searchValues) => {
      if (!err) {
        this.requestList({ searchValues, pageNow: 1 });
      }
    });
  };

  handlePageChange = pageNow => {
    this.requestList({ pageNow });
  };

  render() {
    const {
      users: { tableData, total, pageNow },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const columns = [
      {
        title: '头像',
        dataIndex: 'headimgurl',
        render: (text, record) => <Avatar src={text} size='large'/>,
      },
      { title: '姓名', dataIndex: 'nickname' },
      { title: '电话', dataIndex: 'tel' },
      { title: '地址', dataIndex: 'address', render: (text, record) => (text == '' ? '/' : text) },
      {
        title: '创建时间',
        dataIndex: 'createtime',
        render: text => formatTime(text),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <Form layout="inline">
            <Form.Item label="用户姓名">
              {getFieldDecorator('likeinfo', {})(
                <Input placeholder="请输入用户姓名" style={{ width: 300 }} allowClear/>,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Table
          style={{ backgroundColor: '#fff' }}
          loading={loading}
          dataSource={tableData}
          columns={columns}
          rowKey="userid"
          pagination={{
            total,
            current: pageNow,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.handlePageChange,
            showTotal: () => {
              return `共${total}条`;
            },
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default User;
