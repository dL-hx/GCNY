import React from 'react';
import './BMap.less';
import { BMap } from '@/components/BaiduMap/BMAP_DATA';
import EnBaiduMapForm from '@/components/BaiduMap/BForm';
import { isString } from './utils/common';


export default class BaiduMap extends React.Component {

  /**
   * 设置默认的props属性
   */
  static get defaultProps() {
    return {
      style: {
        height: '350px',
      },
      /*
      center: {
          lng: 108.94407,
          lat: 34.336614
      },
      zoom: 5
      */
    };
  }

  componentDidMount() {
    this.initialize();
  }

  getPointOverlay = (lng, lat) => {
    this.pointOverlay = new BMap.Marker(new BMap.Point(lng, lat));
    this.map.addOverlay(this.pointOverlay);               // 将标注添加到地图中
    this.pointOverlay.setAnimation(BMAP_ANIMATION_BOUNCE);
  };


  handleHighlight = e => {
    const _value = e.fromitem.value;
    console.log(_value);

    // //鼠标放在下拉列表上的事件
    // var str = [];
    // var _value = e.fromitem.value;
    // var value = '';
    // if (e.fromitem.index > -1) {
    //   value =
    //     _value.province +
    //     _value.city +
    //     _value.district +
    //     _value.street +
    //     _value.business;
    // }
    // str.push(
    //   <div>
    //     FromItem index = {e.fromitem.index} value = {value}
    //   </div>,
    // );
    //
    // value = '';
    // if (e.toitem.index > -1) {
    //   _value = e.toitem.value;
    //   value =
    //     _value.province +
    //     _value.city +
    //     _value.district +
    //     _value.street +
    //     _value.business;
    // }
    // str.push(
    //   <div>
    //     ToItem index = {e.toitem.index} value = {value}
    //   </div>,
    // );
    //
    // console.log('str', str);
  };

  removePointOverlay() { // 清除点覆盖物
    this.map.removeOverlay(this.pointOverlay);    // 移除pointOverlay
  };


  initialize() {  // 渲染地图数据
    // 将initMap函数放入window对象，让百度地图库加载完成后执行callback
    const map = new BMap.Map(this.refs.map);
    this.map = map;

    const { center } = this.props;
    if (isString(center)) { // 可以传入城市名
      map.centerAndZoom(center);
    } else { // 正常传入经纬度坐标
      const { zoom } = this.props;
      const centerPoint = new BMap.Point(center.lng, center.lat);// 创建一个点
      map.centerAndZoom(centerPoint, zoom); // 初始化地图,设置中心点坐标和地图级别
    }
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

    const self = this;


    const ac = new BMap.Autocomplete({ input: 'suggestId', location: self.map }); // 建立一个自动完成的对象

    console.log('ac', ac);
    ac.addEventListener('onhighlight', this.handleHighlight);


    map.addEventListener('click', e => {
      const geocoder = new BMap.Geocoder();
      geocoder.getLocation(e.point, rs => {
        const { lng, lat } = e.point;
        // console.log(lng, lat, rs.address);
        self.removePointOverlay();
        self.getPointOverlay(lng, lat);

        self.bMapForm.props.form.setFieldsValue({
          address: rs.address,
          lng,
          lat,
        });

      });
    });
  };

  render() {
    return (
      <div>
        <EnBaiduMapForm
          wrappedComponentRef={inst => {
            this.bMapForm = inst;
          }}
        />
        <div
          ref='map'
          style={{
            height: '50vh',
            marginTop: 10,
          }}
        />
      </div>
    );
  }
}
