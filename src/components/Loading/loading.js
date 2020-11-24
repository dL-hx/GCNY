import React from 'react';
import { Skeleton } from 'antd';

const LoadData = () => <div>
  <Skeleton active />
  <Skeleton active style={{margin:'10px 0'}} />
  <Skeleton active style={{margin:'10px 0'}} />
  <Skeleton active style={{margin:'10px 0'}} />
  <Skeleton active style={{margin:'10px 0'}} />
  <Skeleton active />
</div>;

export default LoadData
