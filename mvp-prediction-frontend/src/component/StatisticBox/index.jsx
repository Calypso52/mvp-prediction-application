import React, { Component } from 'react'
import Loading from '../Loading'
import PlayerData from './PlayerData'
import './index.css'

export default class StatisticBox extends Component {
    render() {
        const { playerStatistic, isSearchStatisticFirst, isSearchStatisticLoading, err } = this.props;

        const styleObj = {
            marginTop: '150px'
        }
        return (
            <div className="sta-outerwrapper">
                {
                    isSearchStatisticFirst ? <h2 style={{ color: '#fff' }}>Please enter player name</h2> : 
                    isSearchStatisticLoading ? <Loading styleObj={ styleObj }/> : 
                    err ? <h2 style={{ color: 'red' }}>{ err }</h2> : 
                    !Object.keys(playerStatistic).length ? <h2 style={{ color: '#fff' }}>Please enter player name correctly</h2> : 
                    <PlayerData playerStatistic={ playerStatistic }/>
                }
            </div>
        )
    }
}
