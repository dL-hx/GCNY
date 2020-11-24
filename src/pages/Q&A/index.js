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
import { QA_ASK_SERVER_CONFIG } from '@/services/Q&A/q_a';
import { AddButton, AuditButton } from '@/components/MyButton';
import { Audio } from '@/components/MyMedia';
import noMatchPic from '@/assets/noMatchPic.jpg';

const tags = [
  {
    id: '501',
    value: '小麦',
  },
  {
    id: '502',
    value: '玉米',
  },
  {
    id: '503',
    value: '土豆',
  },
  {
    id: '504',
    value: '大豆',
  },
  {
    id: '505',
    value: '荞麦',
  },
  {
    id: '506',
    value: '花生',
  },
  {
    id: '507',
    value: '油菜',
  },
];

@connect(({ qa, loading }) => ({
  qa,
  loading: loading.effects['qa/fetch'], // pro 框架特有的加载loading方式
}))
@Form.create()
class Problem extends Component {

  state = {
    title: '',
    SourceUrl: '',
    img: '',
    Content: '',

    activeKeyValue: '501',
    selectedRowKeys: [],
    hasOption: {
      add: false,
      edit: false,
    },
  };

  activeKey = 'id';

  rowKey = 'CommentId';

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

  requestList = ({ pageNow = this.props.qa.pageNow, searchValues = {}, type = QA_ASK_SERVER_CONFIG.fetch } = {}) => {
    const { activeKeyValue } = this.state;

    this.setHasOption(); // 计算 option 属性

    this.props.dispatch({
      type: 'qa/fetch',
      payload: { pageNow: pageNow, pageSize: PAGE_SIZE, id: activeKeyValue, ...searchValues, type },
    });

    this.cleanSelectedRowKeys();
  };

  handleSearch = () => {
    this.props.form.validateFields((err, searchValues) => {
      if (!err) {
        this.requestList({ searchValues, pageNow: 1, type: QA_ASK_SERVER_CONFIG.search });
      }
    });
  };

  handleRemove = (id) => {
    let { qa: { tableData, pageNow } } = this.props; // 计算页面删除的时候删到最后一个的时候, 当前PageNow-1
    const tableLen = tableData.length;
    pageNow = tableLen % PAGE_SIZE === 1 ? pageNow - 1 : pageNow;

    this.props.dispatch({
      type: 'qa/remove',
      values: { CommentId: id },
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
    const { qa: { type, searchValues } } = this.props;

    this.requestList({ pageNow, type, searchValues });
  };

  getActiveKeyValue = (activeKeyValue) => {
    this.setState({
      activeKeyValue,
    }, () => {
      this.requestList({ pageNow: 1 });
    });
  };

  handleAuditing = (type) => {
    this.props.dispatch({
      type: 'qa/changeStatus',
      values: {
        CommentIds: this.state.selectedRowKeys.join(','),
        IsPublish: Number(type === AuditingConfig.confirm),
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
    const { label, Content, SourceUrl, img } = record; // 内容

    this.setState({
      title: label,
      img: img === noMatchPic ? null : img,
      SourceUrl,
      Content,
    });

    // this.myModal.setContentText(Content); // 设置子组件内容
    this.myModal.handleOk(); // 触发Ok 方法
  };

  goToDetailsPage = details => {
    router.push({ pathname: this.detailsPath, state: { details } });
  };

  render() {

    const { qa: { tableData, total, pageNow }, form: { getFieldDecorator }, loading } = this.props;

    const { activeKeyValue, selectedRowKeys, hasOption, title, SourceUrl, img, Content } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
    };

    const that = this;

    const columns = [
      {
        title: '标题',
        dataIndex: 'label',
        render: (text, record) => (<a onClick={() => this.showModal(record)}>{text}</a>),
      },
      {
        title: '内容',
        dataIndex: 'Content',
        render: (text, record) => (text.length > 10 ? `${text.substring(0, 10)}...` : text || '/'),
      },
      {
        title: '资源图片',
        width: 120,
        dataIndex: 'img',
        render: (text, record) => <img src={text} alt="" width={120} height={80}/>,
      },

      {
        title: '评论数',
        dataIndex: 'CommentNum',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'CreateTime',
        render: text => formatTime(text),
      },

      {
        title: '审核',
        dataIndex: 'IsPublish',
        render: status => (<MyStatus status={parseInt(status, 10)}/>),
      },

      {
        title: '操作',
        width: 120,
        render: (text, record) => {
          return (
            <span>
              <span>
                <a onClick={() => this.goToDetailsPage(record)}>查看</a>
                <Divider type="vertical"/>
              </span>

              <Popconfirm
                title="确定要删除这条信息吗？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => this.handleRemove(record[that.rowKey])}
              >
                <a>删除</a>
              </Popconfirm>
            </span>);
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles['btn-option-section']}>
          <Form layout="inline">
            <Form.Item>
              {getFieldDecorator('likeinfo', {})(<Input placeholder="请输入内容" allowClear/>)}
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


        <div className={styles.header}>
          <TagTabs
            tags={tags}
            activeKeyValue={activeKeyValue}
            activeKey={this.activeKey}
            getActiveKeyValue={this.getActiveKeyValue}
          />
        </div>

        <div className={styles.container}>
          <div className={styles.nums}>为您找到相关结果约{total}个</div>

          <Table
            style={{ backgroundColor: '#fff' }}
            loading={loading}
            dataSource={tableData}
            columns={columns}
            rowKey={this.rowKey}
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
          >
            <Audio audioUrl={SourceUrl}></Audio>
            {img && <img src={img} alt="" style={{ width: '100%' }}/>}
            {Content}
          </MyModal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Problem;
