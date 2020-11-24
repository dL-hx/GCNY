import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { title } from '@/defaultSettings';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    <Icon type="copyright" /> {new Date().getFullYear() - 1}-{new Date().getFullYear()} 西安微媒软件有限公司 版权所有
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
    } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <img src="/img/logo2.png" /> {title}
          </div>
          <div>
            {children}
          </div>
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
}))(UserLayout);
