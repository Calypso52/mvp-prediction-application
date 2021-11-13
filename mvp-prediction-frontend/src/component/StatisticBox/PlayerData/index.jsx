import React, { Component } from 'react'

export default class PlayerData extends Component {
    render() {
        const { playerStatistic } = this.props;
        return (
            <div>
                <div><span>player name: { playerStatistic.name }</span></div>
                <div><span>pts: { playerStatistic.pts }</span></div>
                <div><span>reb: { playerStatistic.reb }</span></div>
                <div><span>ast: { playerStatistic.ast }</span></div>
                <div><span>blk: { playerStatistic.blk }</span></div>
                <div><span>tov: { playerStatistic.tov }</span></div>
            </div>
        )
    }
}
