import React, { Component } from 'react'
import './index.css'

export default class PredictionMain extends Component {
    render() {
        const { currentPrize, currentPrizeIcon, rightTransform, rightTransition, rightOpacity, leftTransform, leftTransition, percentageOpacity, resultPercentage } = this.props;
        return (
            <div className="prediction-result-main-wrap">
                <div className="prediction-result-title">
                    <i className={ currentPrizeIcon }></i>
                    <div>{ currentPrize }</div>
                </div>
                <div className="prediction-result-circle">
                    <div className="circle-left" style={{ transform: leftTransform, transition: leftTransition }}></div>
                    <div className="circle-right" style={{ transform: rightTransform, transition: rightTransition, opacity: rightOpacity }}></div>
                    <div className="circle-bottom-left"></div>
                    <div className="circle-bottom-right"></div>
                </div>
                <div className="prediction-result-percent" style={{ opacity: percentageOpacity }}>
                    { resultPercentage }
                </div>
            </div>
        )
    }
}
