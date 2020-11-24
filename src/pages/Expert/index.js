import React, { Component } from 'react';
import { connect } from 'dva';
import { Avatar, Button, Card, Divider, Form, Input, Popconfirm, Table,message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { ExpertDefaultImg, PAGE_SIZE } from '@/utils/constants';
import AddButton from '@/components/MyButton/AddButton';
import { getDetailsPath } from '@/utils/utils';

@connect(({ expert, loading}) => ({
  expert,
  loading: loading.effects['expert/fetch'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Expert extends Component {

  detailsPath = getDetailsPath();

  componentDidMount() {
    this.requestList();
  }

  requestList = ({ pageNow = this.props.expert.pageNow, searchValues = {} } = {}) => {
    this.props.dispatch({
      type: 'expert/fetch',
      payload: { pageNow: pageNow, pageSize: PAGE_SIZE, ...searchValues },
    });
  };

  handleSearch = () => {
    this.props.form.validateFields((err, searchValues) => {
      if (!err) {
        this.requestList({ searchValues,pageNow:1 });
      }
    });
  };

  goToEditPage = details => {
    router.push({ pathname: this.detailsPath, state: { details } });
  };

  handleRemove = (id) => {
    let { expert: { tableData, pageNow } } = this.props; // 计算页面删除的时候删到最后一个的时候, 当前PageNow-1
    const tableLen = tableData.length;
    pageNow = tableLen % PAGE_SIZE === 1 ? pageNow - 1 : pageNow;

    this.props.dispatch({
      type: 'expert/remove',
      values: { 'UserId': id },
      successCall: (msg) => {
        message.success(msg);
        this.requestList({ pageNow });
      },
      failedCall: (msg) => {
        message.warn(msg);
      },
    });
  };

  handlePageChange = pageNow => {
    this.requestList({ pageNow });
  };

  //
  // isDisallow = (values) => {
  //   // console.log('record', values);
  //   this.props.dispatch({
  //     type: 'expert/changeStatus',
  //     values,
  //     successCall: () => {
  //       message.success('操作成功');
  //       this.requestList();
  //     },
  //     failedCall: (error) => {
  //       // console.log(error);
  //       message.warn('操作失败');
  //     },
  //   });
  // };


  render() {
    const {
      expert: { tableData, total, pageNow },
      form: { getFieldDecorator },
      loading,
    } = this.props;

    const columns = [
      { title: '头像', dataIndex: 'imgs', render: (text, record) => <Avatar src={text[0]&&text[0].url||ExpertDefaultImg} size='large'/> },
      { title: '姓名', dataIndex: 'username', width: 80 },
      { title: '电话', dataIndex: 'tel', width: 120 },
      { title: '职称', dataIndex: 'job' },
      { title: '工作单位', dataIndex: 'company' },
      { title: '详细分类', dataIndex: 'detailedclass' , render: (text, record) => (text==''?'/':text)},
      { title: '专业特长', dataIndex: 'bgat' },
      { title: '服务领域', dataIndex: 'domain' },
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
                onConfirm={() => this.handleRemove(record.userid)}
              >
                <a>删除</a>
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
            <Form.Item label="专家姓名">
              {getFieldDecorator('likeField', {})(
                <Input placeholder="请输入专家姓名" style={{ width: 300 }} allowClear/>,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <AddButton icon="plus" pathname={this.detailsPath}>
                新 增 专 家
              </AddButton>
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

export default Expert;
