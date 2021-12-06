import React, { Component } from 'react'
import PredictionLeftBar from './PredictionLeftBar'
import PredictionMain from './PredictionMain'
import './index.css'

export default class PredictionBox extends Component {
    state = {
        // 当前选中的奖项名称
        currentPrize: 'MVP',
        // 当前选中的奖项icon
        currentPrizeIcon: 'fas fa-trophy',
        // 属于PredictionMain组件中的状态
        rightTransform: '',
        rightTransition: '',
        rightOpacity: '',
        leftTransform: '',
        leftTransition: '',
        percentageOpacity: 1,
        resultPercentage: '0%'
    }

    setCurrentPrize = (itemPrize, itemIcon) => {
        this.setState({ currentPrize: itemPrize, currentPrizeIcon: itemIcon });
    }

    percentage = (percent) => {
        this.setState({ resultPercentage: percent * 100 + '%' });
        let delayTime;
        if (percent <= 0.5) {  //红色区域不超过一半
            delayTime = 1100;
            this.animationFirstStep(percent);
        } else {    //红色区域超过一半的情况，重点部分
            delayTime = percent * 2000;
            this.animationSecondStep(percent);
        }
        setTimeout(() => {
            this.animationThirdStep();
        }, delayTime);
    }

    animationFirstStep = (percent) => {
        this.setState({ rightTransform: `rotate(${percent * 360}deg)`,
                        rightTransition: `opacity 0s step-end 1s, transform 1s linear`
                        });
    }

    animationSecondStep = (percent) => {
        this.setState({ rightTransform: `rotate(180deg)`,
                        rightTransition: `opacity 0s step-end 1s, transform 1s linear`,
                        rightOpacity: 0,
                        leftTransition: `transform ${(percent - 0.5) / 0.5}s linear 1s`,
                        leftTransform: `rotate(${percent * 360 - 180}deg)`
                        });
    }

    animationThirdStep = () => {
        this.setState({ percentageOpacity: 1 });
    }

    // 将图像恢复初始值
    clearFigure = () => {
        this.setState({
            rightTransform: '',
            rightTransition: 'transform 0s linear',
            rightOpacity: '',
            leftTransform: '',
            leftTransition: '',
            percentageOpacity: 0
        })
    }

    render() {
        return (
            <div className="pred-outerwrapper">
                <PredictionLeftBar
                    setCurrentPrize={ this.setCurrentPrize }
                    clearFigure={ this.clearFigure }
                    percentage={ this.percentage }
                    {...this.state}
                />
                <PredictionMain
                    animationFirstStep={ this.animationFirstStep }
                    animationSecondStep={ this.animationSecondStep }
                    animationThirdStep={ this.animationThirdStep }
                    {...this.state}
                />
            </div>
        )
    }
}
