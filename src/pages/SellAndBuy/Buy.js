import React, { Component } from 'react';
import SellBuy from './sellBuy';

class Buy extends Component {
  render() {
    return (
      <div>
        <SellBuy parentConfig={{atid: '36',headerTitle:'求购管理'}}/>
      </div>
    );
  }
}

export default Buy;
