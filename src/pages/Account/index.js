import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Form, Input, message, Popconfirm, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { PAGE_SIZE } from '@/utils/constants';
import AddButton from '@/components/MyButton/AddButton';
import { getDetailsPath } from '@/utils/utils';

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/fetch'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Account extends Component {

  detailsPath = getDetailsPath();

  componentDidMount() {
    this.requestList();
  }

  requestList = ({ pageNow = this.props.account.pageNow, searchValues = {} } = {}) => {
    this.props.dispatch({
      type: 'account/fetch',
      payload: { current: pageNow, pageSize: PAGE_SIZE, ...searchValues },
    });
  };

  handleSearch = () => {
    this.props.form.validateFields((err, searchValues) => {
      if (!err) {
        this.requestList({ searchValues, pageNow: 1 });
      }
    });
  };

  goToEditPage = details => {
    router.push({ pathname: this.detailsPath, state: { details } });
  };

  handleRemove = (id) => {
    let { account: { tableData, pageNow } } = this.props; // 计算页面删除的时候删到最后一个的时候, 当前PageNow-1
    const tableLen = tableData.length;
    pageNow = tableLen % PAGE_SIZE === 1 ? pageNow - 1 : pageNow;

    this.props.dispatch({
      type: 'account/remove',
      values: { 'UserID': id },
      successCall: (msg) => {
        message.success(msg);
        this.requestList({ pageNow });
      },
      failedCall: (msg) => {
        message.warn(msg);
      },
    });
  };


  handleResetPassword = (id) => {
    this.props.dispatch({
      type: 'account/reset',
      values: { 'UserID': id },
      successCall: (msg) => {
        message.success(msg);
        this.requestList();
      },
      failedCall: (msg) => {
        message.warn(msg);
      },
    });
  };


  handlePageChange = pageNow => {
    this.requestList({ pageNow });
  };

  render() {
    const {
      account: { tableData, total, pageNow },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const columns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '电话', dataIndex: 'phone' },
      { title: '邮箱', dataIndex: 'email', render: (text, record) => (text == '' ? '/' : text) },
      {
        title: '操作',
        width: 200,
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.goToEditPage(record)}>编辑</a>
              <Divider type="vertical"/>
              <Popconfirm
                title="确定要删除这条信息吗？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => this.handleRemove(record.userId)}
              >
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical"/>
              <Popconfirm
                title="确定要重置密码吗？"
                okText="重置"
                cancelText="取消"
                onConfirm={() => this.handleResetPassword(record.userId)}
              >
               <a>重置密码</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <Form layout="inline">
            <Form.Item label="账户姓名">
              {getFieldDecorator('searchvalue', {})(
                <Input placeholder="请输入账户姓名" style={{ width: 300 }} allowClear/>,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <AddButton icon="plus" pathname={this.detailsPath}>
                新 增 账 户
              </AddButton>
            </Form.Item>
          </Form>
        </Card>

        <Table
          style={{ backgroundColor: '#fff' }}
          loading={loading}
          dataSource={tableData}
          columns={columns}
          rowKey="userId"
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

export default Account;
