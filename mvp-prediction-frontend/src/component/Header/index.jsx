import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'

export default class Header extends Component {
    componentDidMount = () => {
        // 获取缓存在localstorage里面的账号信息
        const logedInAccount = JSON.parse(localStorage.getItem('Account'));
        const curTime = new Date().getTime();
        if(!logedInAccount) { // 没有登录信息
            this.setState({ account: '', isRouteToLogin: 'block', isLogedIn: 'none' });
        } else if(curTime >= logedInAccount.account_expire_time) {  // 登陆保存时间过期了
            this.setState({ account: '', isRouteToLogin: 'block', isLogedIn: 'none' });
        } else { // 有没过期的登录信息
            this.setState({ account: logedInAccount.account, isRouteToLogin: 'none', isLogedIn: 'block' });
        }
    }

    state = {
        account: '',
        // block表示需要展示，导航向登陆页面的样式
        isRouteToLogin: 'block',
        // block表示需要展示，登陆的账号名
        isLogedIn: 'none'
    }

    switchAccount = () => {
        let isSwitch = window.confirm('Are you sure to log out?');
        if(isSwitch) {
            // 清除当前登录信息
            this.setState({ account: '', isRouteToLogin: 'block', isLogedIn: 'none' });
            // 清除当前的登陆账号在localStorage中的缓存
            localStorage.removeItem('Account');
        }
    }

    render() {
        const { account } = this.state;
        return (
            <div className="headerWrapper">
                <div className="headerLogo"></div>
                <NavLink
                    className="headerLogin"
                    style={{ display: this.state.isRouteToLogin }}
                    to="/login"
                >
                    Login / Signup
                </NavLink>
                <div
                    className="headerLogedin"
                    style={{ display: this.state.isLogedIn }}
                    onClick={ this.switchAccount }
                >
                    Signed in as<span>&nbsp;{ account }</span>
                    <img src="https://avatars.githubusercontent.com/u/33220764?s=40&v=4" alt="avatars" />
                </div>
            </div>
        )
    }
}
