import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'
// 导入集中管理的url路径
import URL from '@/request/url'
// 导入axios请求，重命名为：$axios
import $axios from '@/request'

export default class index extends Component {
    state = {
        // 帐号
        accountNumber: '',
        // 密码
        passWord: '',
        // 确认密码
        confirmPassWord: '',
        // account input下边框颜色
        accountBorderButtomColor: '#fff',
        // account 下方字
        accountErrorOpacity: 0,
        // password input框边框颜色
        passwordBorderButtomColor: '#fff',
        // pasword 下方字
        passwordErrorOpacity: 0,
        // confirm password input框边框颜色
        confirmPasswordBorderButtomColor: '#fff',
        // confirm pasword 下方字
        confirmPasswordErrorOpacity: 0,
        // 搜索时鼠标样式
        cursor: 'default'
    }

    // 帐号数据绑定
    changeAccountNumber = (e) => {
        this.setState({ accountNumber: e.target.value });
    }

    // 密码数据绑定
    changePassWord = (e) => {
        this.setState({ passWord: e.target.value });
    }

    // 确认密码数据绑定
    changeConfirmPassWord = (e) => {
        this.setState({ confirmPassWord: e.target.value });
    }

    // 验证账号密码注册得对不对
    handleSignup = () => {
        const { accountNumber, passWord, confirmPassWord } = this.state;
        // 帐号没填
        if(!accountNumber || accountNumber.length === 0) {
            this.accountHint.innerHTML = 'Please enter your username!';
            this.setState({ accountBorderButtomColor: 'red', accountErrorOpacity: 1 });
        }
        // 账号位数不够
        else if(accountNumber.length < 5) {
            this.accountHint.innerHTML = 'Account number must be greater than 5!';
            this.setState({ accountBorderButtomColor: 'red', accountErrorOpacity: 1 });
        }
        // 账号位数过长
        else if(accountNumber.length > 16) {
            this.accountHint.innerHTML = 'Account number must be less than 16!';
            this.setState({ accountBorderButtomColor: 'red', accountErrorOpacity: 1 });
        }
        // 密码没填
        else if(!passWord || passWord.length === 0) {
            this.passwordHint.innerHTML = 'Please enter your password!';
            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
        }
        // 密码位数不够
        else if(passWord.length < 8) {
            this.passwordHint.innerHTML = 'Password number must be greater than 8!';
            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
        }
        // 密码位数太长
        else if(passWord.length > 16) {
            this.passwordHint.innerHTML = 'Password number must be less than 16!';
            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
        }
        // 确认密码没填
        else if(!confirmPassWord || confirmPassWord.length === 0) {
            this.confirmPasswordHint.innerHTML = 'Please enter your confirm password!';
            this.setState({ confirmPasswordBorderButtomColor: 'red', confirmPasswordErrorOpacity: 1 });
        }
        // 两次密码不一致
        else if(passWord && confirmPassWord && passWord !== confirmPassWord) {
            this.passwordHint.innerHTML = 'The two passwords are inconsistent!';
            this.confirmPasswordHint.innerHTML = 'The two passwords are inconsistent!';
            this.setState({ passwordBorderButtomColor: 'red', passwordErrorOpacity: 1 });
            this.setState({ confirmPasswordBorderButtomColor: 'red', confirmPasswordErrorOpacity: 1 });
        }
        // 有账号有密码，并且两次密码一样，可以发送请求了
        else if(accountNumber && passWord && confirmPassWord && accountNumber.length >= 5 && passWord.length >= 8 && passWord === confirmPassWord) {
            const requestParams = {
                accountNumber,
                passWord
            };
            this.setState({ cursor: 'wait' });
            // 发送请求
            let signupResult = $axios.postRequest(URL.USER_SIGN_UP, requestParams);
            // 处理结果
            signupResult
                .then(responseData => {
                    // 1表示注册成功，2表示注册失败
                    switch(responseData) {
                        case 1:
                            alert('Signup success!');
                            // 注册成功，跳转到登陆界面（故意卡一下）
                            setTimeout(() => {
                                this.props.history.push("/login");
                                this.setState({ cursor: 'default' });
                            }, 500);
                            break;
                        case 2:
                            // 注册失败（表示有重复的帐号了），清空三个输入框，重新注册
                            alert('The account is duplicated, please re-enter the account!');
                            this.setState({ accountNumber: '', passWord: '', confirmPassWord: '' });
                            this.setState({ cursor: 'default' });
                            break;
                        case 3:
                            // 注册失败
                            alert('Signup failed!');
                            break;
                        default:
                            alert('Signup failed!');
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

    // confrim password input框颜色恢复
    confirmPasswordRestoreInitial = () => {
        this.setState({ confirmPasswordBorderButtomColor: '#fff', confirmPasswordErrorOpacity: 0 })
    }

    render() {
        const { accountNumber, passWord, confirmPassWord } = this.state;
        return (
            <div className="signupUI">
                <div className="signup" style={{ cursor: this.state.cursor }}>
                    <h2>User Signup</h2>
                    <div className="signup_box">
                        {/* required就是不能为空 必须在css效果中有很大的作用 */}
                        {/* 可以简写为required */}
                        <input
                            type="text"
                            required
                            value={ accountNumber }
                            style={{ borderBottomColor: this.state.accountBorderButtomColor }}
                            onFocus={ this.accountRestoreInitial }
                            onChange={ e => this.changeAccountNumber(e) }
                        />
                        <label>Your Username</label>
                        <div ref={ c => this.accountHint = c } style={{ marginTop: '-25px', color: 'red', opacity: this.state.accountErrorOpacity }}>Please input your username!</div>
                    </div>
                    <div className="signup_box">
                        <input
                            type="password"
                            required
                            value={ passWord }
                            style={{ borderBottomColor: this.state.passwordBorderButtomColor }}
                            onChange={ e => this.changePassWord(e) }
                            onFocus={ this.passwordRestoreInitial }
                        />
                        <label>Your Password</label>
                        <div ref={ c => this.passwordHint = c } style={{ marginTop: '-25px', color: 'red', opacity: this.state.passwordErrorOpacity }}>Please input your password!</div>
                    </div>
                    <div className="signup_box">
                        <input
                            type="password"
                            required
                            value={ confirmPassWord }
                            style={{ borderBottomColor: this.state.confirmPasswordBorderButtomColor }}
                            onChange={ e => this.changeConfirmPassWord(e) }
                            onFocus={ this.confirmPasswordRestoreInitial }
                        />
                        <label>Confirm Password</label>
                        <div ref={ c => this.confirmPasswordHint = c } style={{ marginTop: '-25px', color: 'red', opacity: this.state.confirmPasswordErrorOpacity }}>Please input your confirm password!</div>
                    </div>
                    <div className="login_bottom">
                        <NavLink
                            className="bottom_btn"
                            to="/login"
                        >
                            Back to login
                        </NavLink>
                        <button 
                            className="bottom_btn"
                            // to="/login"
                            onClick={ this.handleSignup }
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
