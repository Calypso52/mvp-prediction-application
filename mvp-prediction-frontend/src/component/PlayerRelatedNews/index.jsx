import React, { Component } from 'react'
import './index.css'

export default class PlayerRelatedNews extends Component {
    render() {
        return (
            <div className="PlayerRelatedNewsWrapper">
                <ul>
                    <li className="newsItem">
                        <p className="newsItemTime">12/04/2021, 11:31 AM</p>
                        <p className="newsItemTitle">LeBron James: Scores 23 in return</p>
                        <p className="newsItemAbstract">James posted 23 points (9-23 FG, 2-8 3Pt, 3-5 FT), 11 rebounds, six assists and two steals across 36 minutes during .</p>
                    </li>
                    <div className="newsCut"></div>
                    <li className="newsItem">
                        <p className="newsItemTime">12/03/2021, 8:26 PM</p>
                        <p className="newsItemTitle">LeBron James: Starting in return</p>
                        <p className="newsItemAbstract">James posted 23 points (9-23 FG, 2-8 3Pt, 3-5 FT), 11 rebounds, six assists and two steals across 36 minutes during F.</p>
                    </li>
                    <div className="newsCut"></div>
                    <li className="newsItem">
                        <p className="newsItemTime">12/02/2021, 6:08 PM</p>
                        <p className="newsItemTitle">LeBron James: Clears protocols, to play Friday</p>
                        <p className="newsItemAbstract">James posted 23 points (9-23 FG, 2-8 3Pt, 3-5 FT), 11 rebounds, six assists and 119-115 loss to the Clippers.</p>
                    </li>
                    <div className="newsCut"></div>
                </ul>
            </div>
        )
    }
}
