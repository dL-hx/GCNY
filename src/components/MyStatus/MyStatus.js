import React from 'react';
import { DISABLE_COLOR, ENABLE_COLOR } from '@/utils/constants';
import CommonMethod from '@/utils/method';

import { Tag } from 'antd';

function MyStatus(props) {
  const { status } = props;
  const color = status ? ENABLE_COLOR : DISABLE_COLOR;

  return (
    <Tag color={color} key={status}>
      <span style={{ color }}>{CommonMethod.changeStatus(status)}</span>
    </Tag>
  );
}


MyStatus.defaultProps = {
  status: 1,
};

export default MyStatus;
