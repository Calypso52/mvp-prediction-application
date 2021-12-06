import React, { Component } from 'react'
import Search from '@/component/Search'
import Card from '@/component/Card'
import StatisticBox from '@/component/StatisticBox'
import PredictionBox from '@/component/PredictionBox'
import Header from '@/component/Header'
import PlayerRelatedNews from '@/component/PlayerRelatedNews'
import './index.css'

export default class MainPage extends Component {
    state = {
      // 远程搜索下拉框数据
      players: [],
      // 是否是搜索间隙
      isSearchInterval: true,
      // 是否正在搜索球员名字
      isSearchingNameLoading: false,
      // 球员名字是否没有找到
      isFilterNotFound: false,
      // 球员各项数据
      playerStatistic: {},
      // 搜索结果控件 -- 是否第一次搜索
      isSearchStatisticFirst: true,
      // 搜索结果控件 -- 搜索结果是否处于loading状态
      isSearchStatisticLoading: false,
      // 下拉框中选择的球员的名字
      selectedPlayerName: '',
      // 点击input框时告知下拉框出现
      cardOpacity: 0,
      // 控制input框不显示的同时，把display设置为hidden
      cardDisplay: 'none'
    }
  
    // 更新球员名字下拉框
    updatePlayerName = (PlayerName) => {
      this.setState(PlayerName);
    }
  
    // 更新球员数据框
    updateStatistic = (playerStatistic) => {
      this.setState(playerStatistic)
    }
  
    // 点击姓名条后把名字放到input上面去
    setNameToInput = (name) => {
      this.setState({selectedPlayerName: name});
    }

    // 点击input框，显示下拉框
    setCardOpacity = (key) => {
      const { cardOpacity } = this.state;
      if(key === 'from input' && cardOpacity === 0) {
        this.setState({ cardOpacity: 1 });
      }
      if(key === 'from card' && cardOpacity === 1) {
        this.setState({ cardOpacity: 0 });
        setTimeout(() => { this.setState({ cardDisplay: 'none' }) }, 500);
      }
    }
  
    render() {
      return (
        <div className="mainPageUI">
          <div className="mainUI">
            {/* 顶部导航栏 */}
            <div className="topBar">
              <Header/>
              <div className="inputAndSelect">
                <Search
                  updateStatistic={this.updateStatistic}
                  updatePlayerName={this.updatePlayerName}
                  setNameToInput={this.setNameToInput}
                  setCardOpacity={ this.setCardOpacity }
                  {...this.state}
                />
                <Card
                  setNameToInput={this.setNameToInput}
                  setCardOpacity={ this.setCardOpacity }
                  {...this.state}
                />
              </div>
            </div>
            {/* 中间主页部分 */}
            <div className="mainPageBody">
              <StatisticBox
                {...this.state}
              />
              <PlayerRelatedNews/>
              <PredictionBox
                {...this.state}
              />
            </div>
          </div>
        </div>
      )
    }
  }
  
