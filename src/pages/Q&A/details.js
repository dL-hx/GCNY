import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CardWrapper from '@/components/CardWrapper';
import { AuditButton } from '@/components/MyButton';
import { AuditingConfig, ExpertDefaultImg, PAGE_SIZE } from '@/utils/constants';
import { Avatar, Checkbox, Icon, List, message, Popconfirm, Typography } from 'antd';
import styles from './index.less';
import MyStatus from '@/components/MyStatus/MyStatus';
import { formatTime } from '@/utils/utils';
import { Audio } from '@/components/MyMedia';

const { Paragraph } = Typography;

@connect(({ comment, loading }) => ({
  comment,
  loading: loading.effects['comment/fetch'], // pro 框架特有的加载loading方式
}))


class Details extends Component {

  state = {
    selectedRowKeys: [],
    checkAll: false,
  };

  details = {};

  rowKey = 'commentid';

  componentDidMount() {
    const { details } = this.props.location.state; // 如果是添加空值, 否则有值
    this.details = details;
    this.requestList();
  }


  resetState = () => {
    this.setState({
      selectedRowKeys: [],
      checkAll: false,
    });
  };

  requestList = ({ pageNow = this.props.comment.pageNow } = {}) => {
    const { CommentId } = this.details;

    const payload = { pageNow, pageSize: PAGE_SIZE, TopicId: CommentId };

    this.props.dispatch({
      type: 'comment/fetch',
      payload,
    });

    this.resetState();
  };

  handleAuditing = (type) => {
    this.props.dispatch({
      type: 'comment/changeStatus',
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

  handleRemove = (id) => {
    let { comment: { listData, pageNow } } = this.props; // 计算页面删除的时候删到最后一个的时候, 当前PageNow-1
    const tableLen = listData.length;
    pageNow = tableLen % PAGE_SIZE === 1 ? pageNow - 1 : pageNow;

    this.props.dispatch({
      type: 'comment/remove',
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
    this.requestList({ pageNow });
  };

  onSelectChange = (selectedRowKeys) => {
    const { comment: { selectedAllKeys } } = this.props;

    this.setState({
      selectedRowKeys,
      checkAll: selectedRowKeys.length === selectedAllKeys.length,
    });
  };

  onCheckAllChange = e => { // 多选 全选
    const { comment: { selectedAllKeys } } = this.props;
    this.setState({
      selectedRowKeys: e.target.checked ? selectedAllKeys : [],
      checkAll: e.target.checked,
    });
  };

  render() {
    const { comment: { listData, total, pageNow }, loading } = this.props;

    const { rowKey } = this;

    const { selectedRowKeys } = this.state;

    const qInfo = this.details;// 问题信息

    return (
      <PageHeaderWrapper title='评论管理'>
        <CardWrapper>
          <div className={styles.ask}>
            <div className={styles.askHeader}>
              <Avatar size={64} src={qInfo.headimgurl && `http://${qInfo.headimgurl}` || ExpertDefaultImg}/>
              <div style={{ marginLeft: 10 }}>
                {qInfo.nickname}
                <p>{formatTime(qInfo.createtime)}</p>
              </div>
            </div>

            <div className={styles.askContent}>
              <Paragraph>
                {qInfo.content}
              </Paragraph>

              {qInfo.SourceUrl && <Audio audioUrl={qInfo.SourceUrl}></Audio>}
              {qInfo.img && <img src={qInfo.img} alt="askImg"/>}
            </div>
          </div>
        </CardWrapper>

        <div className={styles['btn-option-section']}>
          <AuditButton
            selectedRowKeys={selectedRowKeys}
            handleConfirm={this.handleAuditing.bind(this, AuditingConfig.confirm)}
            handleCancel={this.handleAuditing.bind(this, AuditingConfig.cancel)}
          />
        </div>

        <div style={{ borderBottom: '1px solid #E9E9E9', marginBottom: 8, height: 30 }}>
          <Checkbox
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
        </div>

        <div className={styles.container}>
          <div className={styles.nums}>相关结果约{total}个</div>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onSelectChange} value={selectedRowKeys}>
            <List
              itemLayout="horizontal"
              loading={loading}
              dataSource={listData}
              pagination={{
                total,
                current: pageNow,
                defaultPageSize: PAGE_SIZE,
                showQuickJumper: true,
                onChange: this.handlePageChange,
              }}
              renderItem={item => (
                <div>
                  <Checkbox
                    className={styles['check-box-item']}
                    value={item[rowKey]}
                  />
                  <List.Item
                    actions={[
                      <Popconfirm
                        title="确定要删除这条信息吗？"
                        okText="删除"
                        cancelText="取消"
                        onConfirm={() => this.handleRemove(item[rowKey])}
                      >
                        <span className={styles.icon}>
                          <Icon type='delete' style={{ marginRight: 8 }}/>
                      删除
                        </span>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className={styles.listImg}>
                          <Avatar src={item.headimgurl}/>
                          <MyStatus status={item.ispublish}/>
                        </div>
                      }
                      title={<div style={{ height: 50, width: 150, borderBottom: '1px solid #ccc' }}>
                        <p style={{ marginBottom: 0 }}>
                          {item.nickname}
                          <span
                            style={{ marginLeft: 10, display: `${item.content.isReply ? 'inline-block' : 'none'}` }}>
                            回复:{item.content.toUsername}
                          </span>
                        </p>

                        <p style={{ margin: '5px 0' }}>
                          {formatTime(item.createtime)}
                        </p>
                      </div>}
                      description={item.content.content}
                    />
                  </List.Item>
                </div>
              )}
            />
          </Checkbox.Group>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
