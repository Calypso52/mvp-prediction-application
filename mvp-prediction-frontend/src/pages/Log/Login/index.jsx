import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'
// 导入集中管理的url路径
import URL from '@/request/url'
// 导入axios请求，重命名为：$axios
import $axios from '@/request'

export default class Login extends Component {
    componentDidMount() {
        const logedInAccount = JSON.parse(localStorage.getItem('Account'));
        const curTime = new Date().getTime();
        // 有账号信息并且没有过期
        if(logedInAccount && curTime < logedInAccount.expire) {
            this.setState({ accountNumber: logedInAccount.account, passWord: logedInAccount.password });
        }
    }

    state = {
        // 帐号
        accountNumber: '',
        // 密码
        passWord: '',
        // account input下边框颜色
        accountBorderButtomColor: '#fff',
        // account 下方字
        accountErrorOpacity: 0,
        // password input框边框颜色
        passwordBorderButtomColor : '#fff',
        // pasword 下方字
        passwordErrorOpacity: 0,
        // 搜索时鼠标样式
        cursor: 'default'
    }

    // 数据绑定
    changeAccountNumber = (e) => {
        this.setState({ accountNumber: e.target.value });
    }

    // 数据绑定
    changePassWord = (e) => {
        this.setState({ passWord: e.target.value });
    }

    // 登录验证
    handleLogin = () => {
        const { accountNumber, passWord } = this.state;
        // 帐号没填
        if(!accountNumber || accountNumber.length === 0) {
            this.accountHint.innerHTML = 'Please enter your username!';
            this.setState({ accountBorderButtomColor: 'red', accountErrorOpacity: 1 });
        }
        // 密码没填
        if(!passWord || passWord.length === 0) {
            this.passwordHint.innerHTML = 'Please enter your password!';
            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
        }
        if(accountNumber.length && passWord.length) {
            const requestParams = {
                accountNumber,
                passWord
            }
            this.setState({ cursor: 'wait' });
            let loginVerification = $axios.postRequest(URL.LOG_IN_VERIFICATION, requestParams);
            // 处理结果
            loginVerification
                .then(responseData => {
                    this.setState({ cursor: 'default' });
                    // 1表示账号错误，2表示密码错误，3表示成功
                    switch(responseData) {
                        case 1:
                            this.accountHint.innerHTML = 'Username not found. Please signup first!';
                            this.setState({ accountBorderButtomColor: 'red', accountErrorOpacity: 1 });
                            break;
                        case 2:
                            this.passwordHint.innerHTML = 'Password entered incorrectly!'
                            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
                            break;
                        case 3:
                            let accountLocalStorage = {
                                account: accountNumber,
                                password: passWord,
                                // 账号保持登录一小时
                                expire: new Date().getTime() + 1000 * 60 * 60
                            };
                            localStorage.setItem('Account', JSON.stringify(accountLocalStorage));
                            // 此处遍历删掉过期的localStorage键值对
                            this.clearExpired();
                            this.props.history.push("/mainpage");
                            break;
                        default:
                            break;
                    }
                })
                .catch(error => {
                    this.setState({ cursor: 'default' });
                    alert('ERROR:', error.message);
                })
        }
    }

    // account input框颜色恢复
    accountRestoreInitial = () => {
        this.setState({ accountBorderButtomColor: '#fff', accountErrorOpacity: 0 })
    }

    // password input框颜色恢复
    passwordRestoreInitial = () => {
        this.setState({ passwordBorderButtomColor: '#fff', passwordErrorOpacity: 0 })
    }

    // 每次登陆时，都删掉存在localstorage中过期的球员数据缓存
    clearExpired = () => {
        const len = localStorage.length;
        const curTime = new Date().getTime();
        for(let i = 0; i < len; i++) {
            let key = localStorage.key(i);
            let value = JSON.parse(localStorage.getItem(key));
            if(value.expire && value.expire <= curTime) localStorage.removeItem(key);
        }
    }

    render() {
        const { accountNumber, passWord } = this.state;
        return (
            <div className="loginUI">
                <div className="login" style={{ cursor: this.state.cursor }}>
                    <h2>User Login</h2>
                    <div className="login_box">
                        {/* required就是不能为空 必须在css效果中有很大的作用 */}
                        {/* 可以简写为required */}
                        <input
                            type="text"
                            className="login_input"
                            required
                            value={ accountNumber }
                            style={{ borderBottomColor: this.state.accountBorderButtomColor }}
                            onChange={ e => this.changeAccountNumber(e) }
                            onFocus={ this.accountRestoreInitial }
                        />
                        <label>Username</label>
                        <div ref={ c => this.accountHint = c } style={{ marginTop: '-25px', color: 'red', opacity: this.state.accountErrorOpacity }}>Please input your username!</div>
                    </div>
                    <div className="login_box">
                        <input
                            type="password"
                            className="login_input"
                            required="required"
                            value={ passWord }
                            style={{ borderBottomColor: this.state.passwordBorderButtomColor }}
                            onChange={ e => this.changePassWord(e) }
                            onFocus={ this.passwordRestoreInitial }
                        />
                        <label>Password</label>
                        <div ref={ c => this.passwordHint = c } style={{ marginTop: '-25px', color: 'red', opacity: this.state.passwordErrorOpacity }}>Please input your password!</div>
                    </div>
                    
                    <div className="login_bottom">
                        {/* 登录 */}
                        <button
                            className="bottom_btn1"
                            // to="/mainpage"
                            onClick={ this.handleLogin }
                        >
                            Login
                        </button>
                        {/* 注册 */}
                        <NavLink
                            className="bottom_btn2"
                            to="/signup"
                        >
                            Signup
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }
}
