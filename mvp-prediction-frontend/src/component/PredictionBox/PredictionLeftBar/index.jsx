import React, { Component } from 'react'
import './index.css'

export default class PredictionLeftBar extends Component {
    render() {
        return (
            <div className="prediction-left-bar">
                <div className="prediction-left-bar-award">Awards Prediction</div>
                <div></div>
                <ul className="prediction-left-bar-menu">
                    <li className="prediction-left-bar-item">
                        <i className="fas fa-search"></i>
                        <div className="prediction-prize">MVP</div>
                    </li>
                    <div></div>
                    <li className="prediction-left-bar-item">
                        <i className="fas fa-search"></i>
                        <div className="prediction-prize">DPOY</div>
                    </li>
                    <div></div>
                    <li className="prediction-left-bar-item">
                        <i className="fas fa-search"></i>
                        <div className="prediction-prize">MIP</div>
                    </li>
                    <div></div>
                </ul>
            </div>
        )
    }
}
