import { Icon } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './nodata.less';

const NoData = () => <div className={classNames(styles.center)}>
  <div className={classNames(styles.container)}>
    <Icon type="search" />
    <p>没有发现数据</p>
  </div>
</div>;

export default NoData;
