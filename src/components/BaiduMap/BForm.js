import React, { Component } from 'react';
import { Form, Input, Typography, AutoComplete, Button, Icon } from 'antd';
import { BMap } from '@/components/BaiduMap/BMAP_DATA';
import './BMap.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;

const { Option } = AutoComplete;

class BForm extends Component {
  state = {
    dataSource: [],
  };

  handleSearch = value => {
    let result;
    if (!value) {
      result = [];
    } else {
      result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    this.setState({ dataSource: result });


    // var map = new BMap.Map("map");
    // map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。
    //
    // var ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象


  };

  renderOption = item => (
    <Option key={item} text={item}>
      {item}
    </Option>
  );

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const mapInfo = getFieldsValue();
    const { dataSource } = this.state;

    return (
      <Form layout="inline">
        <FormItem>
          {getFieldDecorator('address')(
            <AutoComplete
              style={{ width: 300 }}
              dataSource={dataSource.map(this.renderOption)}
              onSearch={this.handleSearch}
              placeholder="请输入关键字"
            >
              <Input
                id='suggestId'
                suffix={
                  <Button
                    onClick={() => {
                      console.log(mapInfo);
                    }}
                    type="primary"
                  >
                    <Icon type="search" />
                  </Button>
                }
              />
            </AutoComplete>,
          )}
        </FormItem>
        <FormItem label="经度">
          {getFieldDecorator('lng')(
            <Paragraph>{mapInfo?mapInfo.lng:'获取中...'}</Paragraph>,
          )}
        </FormItem>
        <FormItem label="纬度">
          {getFieldDecorator('lat')(
            <Paragraph>{mapInfo?mapInfo.lat:'获取中...'}</Paragraph>,
          )}
        </FormItem>
      </Form>
    );
  }
}

const EnBaiduMapForm = Form.create()(BForm);

export default Form.create({})(EnBaiduMapForm);
