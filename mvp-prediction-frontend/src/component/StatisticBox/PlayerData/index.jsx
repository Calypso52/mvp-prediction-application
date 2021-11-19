import React, { Component } from 'react'
import './index.css'

export default class PlayerData extends Component {
    render() {
        const { playerStatistic } = this.props;

        return (
            <div class="playerCardWrapper">
                <div class="upperWrapper">
                    <div class="teamBackgroundImage" style={{ background: `url('${playerStatistic.teamSrc}') center center no-repeat`, opacity: 0.1, height: '250px' }}></div>
                    <div class="teamlogo"><img src={ playerStatistic.teamSrc } alt="teamLogo"/></div>
                    <div class="playerLogo"><img src={ playerStatistic.src } alt="playerLogo"/></div>
                    <div class="teamInformation"><p>{ playerStatistic.team }</p></div>
                    <div class="playerName">
                        <p>{ playerStatistic.name.split(' ')[0] }</p>
                        <p>{ playerStatistic.name.split(' ')[1] }</p>
                    </div>
                </div>
                <div class="statisticWrapper">
                    <ul class="statisticRow">
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
