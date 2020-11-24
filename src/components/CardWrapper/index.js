import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { GoBackButton } from '@/components/MyButton';


class CardWrapper extends PureComponent {
  render() {
    const { children, isShowReturn } = this.props;
    return (
      <div>
        <div>
          {isShowReturn && <GoBackButton/>}
        </div>
        <Card>
          {children}
        </Card>
      </div>
    );
  }
}

CardWrapper.propTypes = {
  isShowReturn: PropTypes.bool,
};


CardWrapper.defaultProps = {
  isShowReturn: true,
};

export default CardWrapper;
