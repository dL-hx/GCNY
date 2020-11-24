import { Button } from 'antd';
import * as PropTypes from 'prop-types';
import React from 'react';
import styles from './style/audit.less';

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

