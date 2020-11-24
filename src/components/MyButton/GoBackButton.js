import React from 'react';
import router from 'umi/router';
import styles from './style/goback.less';
import IconFont from '@/components/IconFont';

function GoBackButton() {
  return (
    <div
      className={styles.back}
      onClick={() => {
        router.goBack();
      }}
    >
      <IconFont type='icon-return'/>
      返回
    </div>
  );
}

export default GoBackButton;
