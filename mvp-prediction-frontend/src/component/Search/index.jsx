import React, { Component } from 'react'
import './index.css'
// 导入集中管理的url路径
import URL from '@/request/url'
// 导入axios请求，重命名为：$axios
import $axios from '@/request'

export default class Search extends Component {
    // 点击搜索按钮后触发
    handleSearch = () => {
        // 获取用户输入
        const { value: keyWord } = this.keyWordElement;
        if(keyWord.trim().length === 0) {
            this.props.updateStatistic({isSearchStatisticFirst: true});
        } else {
            // 通知，不是初始界面了
            this.props.updateStatistic({isSearchStatisticFirst: false, isSearchStatisticLoading: true, isFilterNotFound: false});

            // 更改url但不跳转
            const state = { 'name': keyWord };
            const title = '';
            const url = `playerStatistic?name=${keyWord}`
            window.history.pushState(state, title, url);

            // get请求获取球员信息卡（使用封装好的get请求）
            const requestParams = {name: keyWord};
            let searchStatistic = $axios.getRequest(URL.PLAYER_STATISTIC, requestParams);
            // 处理结果
            searchStatistic
                .then(responseData => {
                    this.props.updateStatistic({ playerStatistic: responseData[0] || {}, isSearchStatisticLoading: false });
                })
                .catch(error => {
                    this.props.updateStatistic({ isSearchStatisticLoading: false, err: error.message });
                })
        }
    }

    // 根据输入的字符，补全名字
    handleNameMakeUp = () => {
        // console.log('要发送axios了');
        const { value: keyWord } = this.keyWordElement;
        if(keyWord.trim().length === 0) {
            this.props.updatePlayerName({players: [], isFilterNotFound: false})
        } else {
            this.props.updatePlayerName({isSearchInterval: false, isSearchingNameLoading: true, isFilterNotFound: false});

            // post请求获取符合条件的球员全名下拉框（使用封装好的post请求）
            const requestParams = {name: keyWord};
            let makeupNamePost = $axios.postRequest(URL.MAKEUP_PLAYER_NAME, requestParams);
            // 处理结果
            makeupNamePost
                .then(responseData => {
                    if(responseData.length) this.props.updatePlayerName({players: responseData, isSearchingNameLoading: false});
                    else this.props.updatePlayerName({players: [], isSearchingNameLoading: false, isFilterNotFound: true})
                })
                .catch(error => {
                    this.props.updateStatistic({players: [], isSearchingNameLoading: false, err: error.message});
                })
        }
    }

    remoteSearch = () => {
        window.s = setTimeout(this.handleNameMakeUp, 500);
    }

    clearRemoteSearch = () => {
        // console.log("要清除timeInterval了");
        clearTimeout(window.s);
        // 防止内存泄漏
        window.s = null;
    }

    changeValue = (e) => {
        this.props.setNameToInput(e.target.value);
    }

    render() {
        return (
            <div className="searchWrap">
                <input 
                    type="text"
                    placeholder="Search player"
                    ref={ c => this.keyWordElement = c }
                    onKeyUp={ this.remoteSearch }
                    onKeyDown={ this.clearRemoteSearch }
                    value={ this.props.selectedPlayerName }
                    onChange={ e => this.changeValue(e) }
                />
                <span className="fas fa-search" onClick={ this.handleSearch }></span>
            </div>
        )
    }
}
