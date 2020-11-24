import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Divider, Form, Input, message, Popconfirm, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MyStatus from '@/components/MyStatus/MyStatus';
import TagTabs from '@/components/TagTabs';
import { formatTime, getDetailsPath } from '@/utils/utils';
import { AuditingConfig, PAGE_SIZE, tableOptionConfig as tc } from '@/utils/constants';

import styles from './index.less';
import MyModal from '@/components/MyModal';
import router from 'umi/router';
import { AddButton, AuditButton } from '@/components/MyButton';

const tags = [
  { appchannel: '64', channelid: '64', value: '文章管理' },
  // { appchannel: '130', channelid: '130', value: '美丽乡村' , options: [tc.add, tc.edit] },
];

@connect(({ article, loading }) => ({
  article,
  loading: loading.effects['article/fetch'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Article extends Component {

  state = {
    title: '',
    activeKeyValue: '64',
    selectedRowKeys: [],
    hasOption: {
      add: false,
      edit: false,
    },
  };

  activeKey = 'appchannel';

  detailsPath = getDetailsPath();

  componentDidMount() {
    this.requestList();
  }

  cleanSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  findOptions = activeKeyValue => {
    const { activeKey } = this;
    const findTag = tags.find((tag) => (tag[activeKey] === activeKeyValue));
    return findTag.options ? findTag.options : [];
  };

  setHasOption = () => {
    const { activeKeyValue } = this.state;
    const options = this.findOptions(activeKeyValue);
    this.setState({
      hasOption: {
        edit: options.includes(tc.edit),
        add: options.includes(tc.add),
      },
    });
  };

  requestList = ({ pageNow = this.props.article.pageNow, searchValues = {} } = {}) => {
    const { activeKeyValue } = this.state;

    this.setHasOption(); // 计算 option 属性

    this.props.dispatch({
      type: 'article/fetch',
      payload: { pageNow: pageNow, pageSize: PAGE_SIZE, atid: activeKeyValue, ...searchValues },
    });

    this.cleanSelectedRowKeys();
  };

  handleSearch = () => {
    this.props.form.validateFields((err, searchValues) => {
      if (!err) {
        this.requestList({ searchValues, pageNow: 1 });
      }
    });
  };

  handleRemove = (id) => {
    let { article: { tableData, pageNow } } = this.props; // 计算页面删除的时候删到最后一个的时候, 当前PageNow-1
    const tableLen = tableData.length;
    pageNow = tableLen % PAGE_SIZE === 1 ? pageNow - 1 : pageNow;

    this.props.dispatch({
      type: 'article/remove',
      values: { 'aId': id },
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

  getActiveKeyValue = (activeKeyValue) => {
    this.setState({
      activeKeyValue,
    }, () => {
      this.requestList({ pageNow: 1 });
    });
  };

  handleAuditing = (type) => {
    const { selectedRowKeys } = this.state;
    this.props.dispatch({
      type: 'article/changeStatus',
      values: {
        aId: selectedRowKeys.join(','),
        status: type === AuditingConfig.confirm ? 1 : 0,
      },
      successCall: (msg) => {
        message.success(msg);
        this.requestList();
      },
      failedCall: (msg) => {
        // console.log(error);
        message.warn(msg);
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  showModal = (record) => {
    const { title, content } = record; // 内容

    this.setState({
      title,
    });

    this.myModal.setContentText(content); // 设置子组件内容
    this.myModal.handleOk(); // 触发Ok 方法
  };

  goToEditPage = details => {
    router.push({ pathname: this.detailsPath, state: { details } });
  };

  render() {
    const { article: { tableData, total, pageNow }, form: { getFieldDecorator }, loading } = this.props;

    const { activeKeyValue, title, selectedRowKeys, hasOption } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
    };

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        width: 300,
        render: (text, record) => (<a onClick={() => this.showModal(record)}>{text}</a>),
      },
      {
        title: '来源',
        dataIndex: 'source',
        render: (text, record) => (text.length > 8 ? text.substring(0, 8) + '...' : text || '/'),
      },
      {
        title: '作者',
        dataIndex: 'author',
        render: (text, record) => (text.length > 8 ? text.substring(0, 8) + '...' : text || '/'),
      },
      {
        title: '创建时间',
        width: 120,
        dataIndex: 'addTime',
        render: text => formatTime(text),
      },
      {
        title: '审核时间',
        width: 120,
        dataIndex: 'checkTime',
        render: text => (text && formatTime(text)) || '/',
      },
      {
        title: '审核',
        dataIndex: 'status',
        render: status => (<MyStatus status={status}/>),
      },

      /*      {
              title: '操作',
              width: 120,
              render: (text, record) => {
                return (
                  <span>
                    {hasOption.edit && <span>
                      <a onClick={() => this.goToEditPage(record)}>编辑</a>
                      <Divider type="vertical"/>
                    </span>}

                    <Popconfirm
                      title="确定要删除这条信息吗？"
                      okText="删除"
                      cancelText="取消"
                      onConfirm={() => this.handleRemove(record.aId)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>);
              },
            },*/
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles['btn-option-section']}>
          <Form layout="inline">
            <Form.Item>
              {getFieldDecorator('title', {})(<Input placeholder="请输入标题" allowClear/>)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>

              {
                hasOption.add && <AddButton pathname={this.detailsPath}>
                  新增
                </AddButton>
              }
            </Form.Item>
          </Form>

          <AuditButton
            selectedRowKeys={selectedRowKeys}
            handleConfirm={this.handleAuditing.bind(this, AuditingConfig.confirm)}
            handleCancel={this.handleAuditing.bind(this, AuditingConfig.cancel)}
          />
        </div>


        {/*        <div className={styles.header}>
          <TagTabs
            tags={tags}
            activeKeyValue={activeKeyValue}
            activeKey={this.activeKey}
            getActiveKeyValue={this.getActiveKeyValue}
          />
        </div>*/}

        <div className={styles.container}>
          <div className={styles.nums}>为您找到相关结果约{total}个</div>

          <Table
            style={{ backgroundColor: '#fff' }}
            loading={loading}
            dataSource={tableData}
            columns={columns}
            rowKey="aId"
            rowSelection={rowSelection}
            pagination={{
              total,
              current: pageNow,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              onChange: this.handlePageChange,
            }}
          />

          <MyModal
            title={title}
            ref={(child) => {
              this.myModal = child;
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Article;
