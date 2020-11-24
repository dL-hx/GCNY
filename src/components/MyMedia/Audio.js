import React from 'react';

export default class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioUrl: props.audioUrl||null,//接口返回的音频地址
    };
  }

  render() {
    return (<div>
      {
        this.state.audioUrl &&
        <audio
          controls
          src={ this.state.audioUrl}
          controlsList="nodownload"
        >
          <track kind="captions"/>
          您的浏览器不支持 audio 元素。
        </audio>
      }
    </div>);
  }
}

