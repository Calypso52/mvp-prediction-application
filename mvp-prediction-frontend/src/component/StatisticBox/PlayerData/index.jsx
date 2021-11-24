import React, { Component } from 'react'
import './index.css'

export default class PlayerData extends Component {
    render() {
        const { playerStatistic } = this.props;

        return (
            <div className="playerCardWrapper">
                <div className="upperWrapper">
                    <div className="teamBackgroundImage" style={{ background: `url('${playerStatistic.teamSrc}') center center no-repeat`, opacity: 0.1, height: '250px' }}></div>
                    <div className="teamlogo"><img src={ playerStatistic.teamSrc } alt="teamLogo"/></div>
                    <div className="playerLogo"><img src={ playerStatistic.src } alt="playerLogo"/></div>
                    <div className="teamInformation"><p>{ playerStatistic.team }</p></div>
                    <div className="playerName">
                        <p>{ playerStatistic.name.split(' ')[0] }</p>
                        <p>{ playerStatistic.name.split(' ')[1] }</p>
                    </div>
                </div>
                <div className="statisticWrapper">
                    <ul className="statisticRow">
                        <li>
                            <p>PTS</p>
                            <p>{ playerStatistic.pts }</p>
                        </li>
                        <li>
                            <p>REB</p>
                            <p>{ playerStatistic.reb }</p>
                        </li>
                        <li>
                            <p>AST</p>
                            <p>{ playerStatistic.reb }</p>
                        </li>
                        <li>
                            <p>STL</p>
                            <p>{ playerStatistic.stl }</p>
                        </li>
                        <li>
                            <p>BLK</p>
                            <p>{ playerStatistic.blk }</p>
                        </li>
                        <li>
                            <p>TOV</p>
                            <p>{ playerStatistic.tov }</p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
