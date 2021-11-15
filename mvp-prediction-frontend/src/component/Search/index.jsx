import axios from 'axios';
import React, { Component } from 'react'
import './index.css'

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
            setTimeout(() => {
                // axios请求
                axios
                    // 暂时用get获取所有信息。考虑两个办法，把 keyWord 传给后端：
                    // 1> .get(`http://localhost:3000/api1/playerName?name=${keyWord}`)
                    // 2> .post('http://localhost:3000/api1/playerName', keyWord)
                    .get('http://localhost:3000/api1/playerStatistic')
                    .then(
                        response => {
                            const responseData = response.data;
                            // 请求成功后通知搜索数据结果栏更新状态（需要修改）
                            const filteredName = this.filterKeyName(keyWord.toLowerCase(), responseData);
                            this.props.updateStatistic({ playerStatistic: filteredName[0], isSearchStatisticLoading: false });
                        },
                        error => {
                            // 请求失败通知搜索数据结果栏更新失败界面（需要修改）
                            this.props.updateStatistic({ isSearchStatisticLoading: false, err: error.message });
                        }
                    )
            }, 1000)
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
            setTimeout(() => {
                axios
                    .get('http://localhost:3000/api2/playerName')
                    .then(
                        response => {
                            const responseData = response.data;
                            const filteredName = this.filterKeyName(keyWord.toLowerCase(), responseData);
                            if(filteredName.length) this.props.updatePlayerName({players: filteredName, isSearchingNameLoading: false});
                            else this.props.updatePlayerName({players: [], isSearchingNameLoading: false, isFilterNotFound: true})
                        },
                        error => {
                            this.props.updateStatistic({players: [], isSearchingNameLoading: false, err: error.message});
                        }
            )
            },1000)
        }
    }

    // 过滤包含关键字的名字
    filterKeyName = (filterWord, dataObj) => {
        return dataObj.filter(obj => obj.name.toLowerCase().search(filterWord) !== -1);
    }

    remoteSearch = () => {
        window.s = setTimeout(this.handleNameMakeUp, 500);
    }

    clearRemoteSearch = () => {
        // console.log("要清除timeInterval了");
        clearTimeout(window.s);
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
