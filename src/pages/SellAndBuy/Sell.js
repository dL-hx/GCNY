import React, { Component } from 'react';
import SellBuy from './sellBuy';

class Sell extends Component {
  render() {
    return (
      <div>
        <SellBuy parentConfig={{atid: '34' ,headerTitle:'供应管理'}} />
      </div>
    );
  }
}

export default Sell;
