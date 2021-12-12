import React, { Component } from 'react'
import PubSub from 'pubsub-js'
// 导入集中管理的url路径
import URL from '@/request/url'
// 导入axios请求，重命名为：$axios
import $axios from '@/request'
import './index.css'

// 给对象添加一个过期时间属性
function setExpire(successResponseObj) {
    const curHour = new Date().getHours();
    const today_0_oclock = new Date(new Date().toLocaleDateString()).getTime();
    let expireTime;
    if(curHour < 5) { // 说明在当天，过期时间应设置在今天5点
        expireTime = today_0_oclock + 5 * 60 * 60 * 1000;
    } else { // 说明在昨天，过期时间应设置在明天5点
        expireTime = today_0_oclock + 29 * 60 * 60 * 1000;
    }

    successResponseObj.expire = expireTime;
    return successResponseObj;
}

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
            /*
            const state = { 'name': keyWord };
            const title = '';
            const url = `playerStatistic?name=${keyWord}`
            window.history.pushState(state, title, url);
            */

            // get请求获取球员信息卡（使用封装好的get请求）（使用了promise）
            const requestParams = {name: keyWord};
            // 获取localStorage中key值为keyWord的缓存数据。当获取不出来的时候，返回null
            const localStorage_key = JSON.parse(localStorage.getItem(keyWord));
            // 当有key值为当前搜索keyWord的缓存，并且缓存没有过期时，直接取出来而不发送请求
            if(localStorage_key && (localStorage_key).expire >= new Date().getTime()) {
                this.props.updateStatistic({ playerStatistic: localStorage_key || {}, isSearchStatisticLoading: false });
                console.log(localStorage_key.percent);
                PubSub.publish('clear-figure');
                setTimeout(() => { PubSub.publish('mvp-prediction', localStorage_key.percent); }, 500);
            } else { // 没有缓存或者过期时，都要发送请求，并将结果添加/覆盖
                let searchStatistic = $axios.getRequest(URL.PLAYER_STATISTIC, requestParams);
                // 处理结果
                searchStatistic
                    .then(responseData => {
                        this.props.updateStatistic({ playerStatistic: responseData || {}, isSearchStatisticLoading: false });
                        // 给当前响应回来的球员数据设置一个过期时间 -- 凌晨5点。（判断有没有过当日的5点）
                        let responseData_expire = setExpire(responseData);
                        localStorage.setItem(keyWord, JSON.stringify(responseData_expire));
                        // 将数据post给后端，后端将球员数据存进bigquery，供算法取出
                        // 深拷贝
                        let predictionItem = Object.assign({}, responseData);
                        predictionItem.predPrize = 'mvp';
                        // 清除上一个预测结果的图像
                        PubSub.publish('clear-figure');
                        return $axios.postRequest(URL.INPUT_DATA_TO_ALGORITHM, predictionItem);
                    })
                    .then(responseData => {
                        if(responseData === -1) console.log('给 后端-bigquery-算法 失败了');
                        else {
                            setTimeout(() => { PubSub.publish('mvp-prediction', responseData); }, 500);
                            let localStorage_key = JSON.parse(localStorage.getItem(keyWord));
                            localStorage_key.percent = responseData;
                            localStorage.setItem(keyWord, JSON.stringify(localStorage_key));
                        }
                    })
                    .catch(error => {
                        this.props.updateStatistic({ isSearchStatisticLoading: false, err: error.message });
                    })
            }
        }
    }

    // 根据输入的字符，补全名字
    handleNameMakeUp = () => {
        // console.log('要发送axios了');
        const { value: keyWord } = this.keyWordElement;
        if(keyWord.trim().length === 0) {
            this.props.updatePlayerName({players: [], isFilterNotFound: false, cardOpacity: 0 });
            setTimeout(() => { this.props.updatePlayerName({ cardDisplay: 'none' }) }, 500);
        } else {
            this.props.updatePlayerName({isSearchInterval: false, isSearchingNameLoading: true, isFilterNotFound: false, cardOpacity: 1, cardDisplay: 'block' });
            // post请求获取符合条件的球员全名下拉框（使用封装好的post请求）（使用了promise）
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

    showCard = () => {
        const key = 'from input';
        this.props.setCardOpacity(key);
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
                    onClick={ this.showCard }
                />
                <span className="fas fa-search" onClick={ this.handleSearch }></span>
            </div>
        )
    }
}
