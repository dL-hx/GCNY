```
order: 0
title:
  zh-CN: 标准审核按钮

@params: selectedRowKeys<Array>: 表格的选中项 
@params: handleCancel: 取消按钮回调
@params: handleConfirm: 确认按钮回调

  state = {
    selectedRowKeys: [],
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


<AuditButton
        selectedRowKeys={this.state.selectedRowKeys}
        handleConfirm={this.handleAuditing.bind(this, AuditingConfig.confirm)}
        handleCancel={this.handleAuditing.bind(this, AuditingConfig.cancel)}
/>

```
import AuditButton from '@/components/MyButton/AuditButton';

const AuditButton = ({ handleCancel, handleConfirm, selectedRowKeys }) => {

  const { length } = selectedRowKeys;
  const isDisabled = length === 0;

  return <>
    <Button type="primary" disabled={isDisabled} onClick={handleConfirm}>
      审核通过
    </Button>
    {/* eslint-disable-next-line react/jsx-no-bind */}
    <Button type="primary" disabled={isDisabled} onClick={handleCancel}>
      审核撤销
    </Button>
    {!isDisabled && <div className={styles.nums}>已选{length}条</div>}
  </>;
};

export default AuditButton;

AuditButton.propTypes = {
  selectedRowKeys: PropTypes.array.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

ReactDOM.render(<AddButtonDemo />, mountNode);

