import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Input, message } from 'antd';
import Login from '@/components/Login';
import md5 from 'md5';
import styles from './Login.less';
import config from '@/utils/config';

const { reqhost } = config;

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['login/login'], // pro 框架特有的加载loading方式
}))

class LoginPage extends Component {

  captcha = reqhost + '/api/Account/vaildateLoginVcode?r='; // 验证码图片地址

  doLogin = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const captchaEl = document.getElementById('Code');
      values.Code = captchaEl.value;
      values.Password = md5(values.Password);
      dispatch({
        type: 'login/login',
        payload: {
          values,
          failedCall: (msg) => {
            message.warning(msg);
            if (msg.indexOf('验证码') > -1) {
              this.handleGetCaptcha();
            }
          },
          successCall: (msg) => {
            message.success(msg);
          },
        },
      });
    }
  };

  handleGetCaptcha = () => {
    const imgCodeEl = document.getElementById('imgCode');
    imgCodeEl.src = this.captcha + Math.random();
  };

  render() {
    const { loading } = this.props;
    return (
      <div className={styles.main}>
        <div style={{margin: '10px'}}>
          <img src="/img/pic.png" alt="" />
        </div>

        <Login
          style={{width: '100%'}}
          defaultActiveKey='account'
          onSubmit={this.doLogin}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <p>用户登陆</p>

          <UserName
            name="Account"
            placeholder='请输入用户名'
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          />
          <Password
            name="Password"
            placeholder='请输入密码'
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.doLogin);
            }}
          />
          <div>
            <Input
              type="text"
              name="Code"
              id="Code"
              style={{ width: '79%', height: 40, verticalAlign: 'middle' }}
              placeholder="请输入验证码"
              prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            />
            <img
              id='imgCode'
              src={this.captcha}
              style={{ marginLeft: 7 }}
              onClick={this.handleGetCaptcha}
              alt='captcha'
            />
          </div>
          <Submit loading={loading}>
            登录
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
