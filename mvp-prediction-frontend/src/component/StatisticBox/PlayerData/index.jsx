import React, { Component } from 'react'
import './index.css'

export default class PlayerData extends Component {
    render() {
        const { playerStatistic } = this.props;
        const name = playerStatistic.name || '';
        const defaultTeam = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png?w=100&h=100&transparent=true'
        const teamSrc = playerStatistic.teamSrc || defaultTeam;
        const src = playerStatistic.src || '';
        const team = playerStatistic.team || '';
        const pts = playerStatistic.pts || 0.0;
        const reb = playerStatistic.reb || 0.0;
        const ast = playerStatistic.ast || 0.0;
        const stl = playerStatistic.stl || 0.0;
        const blk = playerStatistic.blk || 0.0;
        const tov = playerStatistic.tov || 0.0;

        return (
            <div className="playerCardWrapper">
                <div className="upperWrapper">
                    <div className="teamBackgroundImage" style={{ background: `url('${teamSrc}') center center no-repeat`, opacity: 0.1, height: '250px' }}></div>
                    <div className="teamlogo"><img src={ teamSrc } alt="teamLogo"/></div>
                    <div className="playerLogo"><img src={ src } alt="playerLogo"/></div>
                    <div className="teamInformation"><p>{ team }</p></div>
                    <div className="playerName">
                        <p>{ name.split(' ')[0] }</p>
                        <p>{ name.split(' ')[1] }</p>
                    </div>
                </div>
                <div className="statisticWrapper">
                    <ul className="statisticRow">
                        <li>
                            <p>PTS</p>
                            <p>{ pts }</p>
                        </li>
                        <li>
                            <p>REB</p>
                            <p>{ reb }</p>
                        </li>
                        <li>
                            <p>AST</p>
                            <p>{ ast }</p>
                        </li>
                        <li>
                            <p>STL</p>
                            <p>{ stl }</p>
                        </li>
                        <li>
                            <p>BLK</p>
                            <p>{ blk }</p>
                        </li>
                        <li>
                            <p>TOV</p>
                            <p>{ tov }</p>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
