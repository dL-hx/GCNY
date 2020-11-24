import React, { Component } from 'react';
import styles from './index.less';
import TabPane from './TabPane';
import TagTabsContext from './TagTabsContext';

class TagTabs extends Component {

  constructor(props) {
    super(props);
    const { activeKeyValue, activeKey } = props;
    this.state = {
      activeKeyValue: activeKeyValue || '',
      activeKey: activeKey || '',
    };
  }

  handleTagChange = (activeTagId) => {
    this.setState({
      activeKeyValue: activeTagId,
    }, () => {
      this.props.getActiveKeyValue(this.state.activeKeyValue); // 将activeKeyValue 参数 传递给 父级页面
    });
  };

  getContext = () => {
    const { activeKeyValue, activeKey } = this.state;
    return {
      activeKey,
      activeKeyValue,
    };
  };

  render() {

    const { tags } = this.props;
    const { Provider } = TagTabsContext;

    return (
      <Provider value={this.getContext()} className={styles.HotListNav}>
        <div
          className={styles['HotListNav-items']}
        >
          {
            tags.map((i, k) => (
              <TabPane
                {...i}
                key={k}
                onTabsChange={this.handleTagChange}
              />
            ))
          }
        </div>
      </Provider>
    );
  }
}

export default TagTabs;
