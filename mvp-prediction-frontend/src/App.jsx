import React, { Component } from 'react'
import Search from './component/Search'
import Card from './component/Card'
import { v4 as uuid } from 'uuid'
import './App.css'
import StatisticBox from './component/StatisticBox'
import PredictionBox from './component/PredictionBox'

export default class App extends Component {
  state = {
    // 远程搜索下拉框数据
    players: [
      { id: uuid(), name: 'James' },
      { id: uuid(), name: 'Durant' },
      { id: uuid(), name: 'Harden' },
      { id: uuid(), name: 'Paul' },
      { id: uuid(), name: 'Westbrook' },
      { id: uuid(), name: 'Davis' },
      { id: uuid(), name: 'Anthony' }
    ],
    // 球员各项数据
    playerStatistic: [],
    // 搜索结果控件 -- 是否第一次搜索
    isSearchFirst: true,
    // 搜索结果控件 -- 搜索结果是否处于loading状态
    isSearchLoading: false
  }

  updateStatistic = (playerStatistic) => {
    this.setState(playerStatistic)
  }

  render() {
    const { players } = this.state;
    return (
      <div className="outermostWrapper">
          <Search
            updateStatistic={ this.updateStatistic }
          />
          <Card
            players={ players }
          />
          <StatisticBox/>
          <PredictionBox/>
      </div>
    )
  }
}
