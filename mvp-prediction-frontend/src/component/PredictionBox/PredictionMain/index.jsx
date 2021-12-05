import React, { Component } from 'react'
import './index.css'

export default class PredictionMain extends Component {
    state = {
        rightTransform: '',
        rightTransition: '',
        rightOpacity: '',
        leftTransform: '',
        leftTransition: ''
    }

    percentage = () => {
        let percent = 0.80;
        if (percent <= 0.5) {  //红色区域不超过一半
            this.setState({ rightTransform: `rotate(${percent * 360}deg)` });
            // right.style.transform = `rotate(${percent * 360}deg)`
        } else {    //红色区域超过一半的情况，重点部分
            this.setState({ rightTransform: `rotate(180deg)`,
                            rightTransition: `opacity 0s step-end 1s, transform 1s linear`,
                            rightOpacity: 0,
                            leftTransition: `transform ${(percent - 0.5) / 0.5}s linear 1s`,
                            leftTransform: `rotate(${percent * 360 - 180}deg)`
                        });
        }
    }

    render() {
        return (
            <div className="prediction-result-main-wrap">
                <div className="prediction-result-circle">
                    <div className="circle-left" style={{ transform: this.state.leftTransform, transition: this.state.leftTransition }}></div>
                    <div className="circle-right" style={{ transform: this.state.rightTransform, transition: this.state.rightTransition, opacity: this.state.rightOpacity }}></div>
                    <div className="circle-bottom-left"></div>
                    <div className="circle-bottom-right"></div>
                </div>
                <div className="prediction-result-percent" onClick={ this.percentage }>80%</div>
            </div>
        )
    }
}
