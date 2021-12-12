import React, { Component } from 'react'
import Loading from '@/component/Loading'
import './index.css'

export default class PredictionMain extends Component {
    render() {
        const { currentPrize, isPredicting, currentPrizeIcon, rightTransform, rightTransition, rightOpacity, leftTransform, leftTransition, percentageOpacity, resultPercentage, percentTransition } = this.props;
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
                {
                    isPredicting ? 
                    <div className="prediction-result-loading">
                        <Loading/>
                    </div>
                    :
                    <div className="prediction-result-percent" style={{ opacity: percentageOpacity, transition: percentTransition }}>
                        { resultPercentage }
                    </div>
                }
            </div>
        )
    }
}
