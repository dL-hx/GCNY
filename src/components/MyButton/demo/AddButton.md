```
order: 0
title:
  zh-CN: 标准添加按钮

@params: pathname: 跳转项目的路径
@params: type: 指定Button 的样式, 默认 'primary'

// 隐式参数
如果想要改变button 的默认的文本 , 在内部添加文本即可, 默认显示 '新增-'
<AddButton pathname='./details'>增加</AddButton>

```
import AddButton from '@/components/MyButton/AddButton';

class AddButtonDemo extends React.Component {
  render() {
    return (
      <div>
          <AddButton pathname='./details'>新增</AddButton>
          <AddButton pathname='./details'/>
      </div>
    );
  }
}

ReactDOM.render(<AddButtonDemo />, mountNode);

