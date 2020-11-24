```jsx
    const tags = [
      { id: '0', index: 'a', value: '推荐' },
      { id: '1', index: 'b', value: '数码' },
      { id: '2', index: 'c', value: '运动' },
      { id: '3', index: 'd', value: '时尚' },
      { id: '4', index: 'e', value: '影视' },
    ];



  getActiveKeyValue = (activeKeyValue) => {
    console.log(activeKeyValue);
  };


  <TagTabs
    tags={tags}
    activeKeyValue='0'
    activeKey='id'
    getActiveKeyValue={this.getActiveKeyValue}
  />

```
