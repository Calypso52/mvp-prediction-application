import React, { Component } from 'react'
import Search from './component/Search'
import Card from './component/Card'
import './App.css'
import StatisticBox from './component/StatisticBox'
import PredictionBox from './component/PredictionBox'

export default class App extends Component {
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
    selectedPlayerName: ''
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

  render() {
    return (
      <div>
        <div className="outermostBackground"></div>
        <div className="outermostWrapper">
          <Search
            updateStatistic={this.updateStatistic}
            updatePlayerName={this.updatePlayerName}
            setNameToInput={this.setNameToInput}
            {...this.state}
          />
          <Card
            {...this.state}
            setNameToInput={this.setNameToInput}
          />
          <StatisticBox
            {...this.state}
          />
          <PredictionBox />
        </div>
      </div>
    )
  }
}
