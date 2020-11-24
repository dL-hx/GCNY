import { Icon } from 'antd';
import styles from './index.less'
import React from 'react';
import * as PropTypes from 'prop-types';

class IconText extends React.Component {
  render() {
    let { type, text, value, colon } = this.props;
    const str = colon ? ':' : '';

    return (
      <a className={styles.icon}>
        {type && <Icon type={type} style={{ marginRight: 8 }}/>}
        {text}{str}{value}
      </a>);
  }
}

IconText.propTypes = {
  type: PropTypes.any,
  text: PropTypes.any,
  value: PropTypes.any,
  colon: PropTypes.any
}

export default IconText;
