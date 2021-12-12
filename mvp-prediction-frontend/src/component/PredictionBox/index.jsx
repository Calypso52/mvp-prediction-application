import React, { Component } from 'react'
import PubSub from 'pubsub-js'
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
        resultPercentage: '0%',
        // 控制百分比文字的出现是否要过渡效果
        percentTransition: ''
    }

    componentDidMount() {
        PubSub.subscribe('mvp-prediction', (_, data) => {
            this.setState({ currentPrize: 'MVP', currentPrizeIcon: 'fas fa-trophy' });
            const mvpPercentage = data[0];
            const playerName = data[1];
            // 设置缓存预测数据的键名
            const playerOfpredictionResult = playerName;
            // 获取缓存在浏览器中的球员预测结果数据，若无，返回null
            const localCache = JSON.parse(localStorage.getItem(playerOfpredictionResult));
            // 检查缓存，如果有这个球员的mvp预测结果缓存，并且没有过期，直接读取
            if(localCache && localCache.mvp_percentage && localCache.expire >= new Date().getTime()) {
                this.percentage(localCache.mvp_percentage);
            } else {
                // 缓存
                let predictionResult = JSON.parse(localStorage.getItem(playerOfpredictionResult)) || {};
                predictionResult.mvp_percentage = mvpPercentage;
                localStorage.setItem(playerOfpredictionResult, JSON.stringify(predictionResult));
            }
            this.percentage(data[0]);
        })
        PubSub.subscribe('clear-figure', (_, data) => {
            this.clearFigure();
            this.setState({ percentTransition: 'opacity 0.5s' });
            if(data === 'hasCache') {
                setTimeout(() => {this.props.setPredictingStatus(false);}, 500);
            } else if(data === 'noCache') {
                setTimeout(() => {this.props.setPredictingStatus(true);}, 500);
            }
        })
    }

    setCurrentPrize = (itemPrize, itemIcon) => {
        this.setState({ currentPrize: itemPrize, currentPrizeIcon: itemIcon });
    }

    percentage = (percent) => {
        this.props.setPredictingStatus(false);
        this.setState({ resultPercentage: percent * 100 + '%', percentTransition: '' });
        let delayTime;
        if (percent <= 0.5) {  //红色区域不超过一半
            delayTime = 1100;
            this.animationFirstStep(percent);
        } else {    //红色区域超过一半的情况，重点部分
            delayTime = percent * 2700;
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
                        leftTransition: `transform ${(percent - 0.5) / 0.5+1}s cubic-bezier(.12,.49,.32,1.01) 1s`,
                        leftTransform: `rotate(${percent * 360 - 180}deg)`
                        });
    }

    animationThirdStep = () => {
        this.setState({ percentageOpacity: 1, percentTransition: 'opacity 0.5s' });
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
        const { playerStatistic, setPredictingStatus, isPredicting } = this.props;
        return (
            <div className="pred-outerwrapper">
                <PredictionLeftBar
                    setCurrentPrize={ this.setCurrentPrize }
                    clearFigure={ this.clearFigure }
                    percentage={ this.percentage }
                    setPredictingStatus={ setPredictingStatus }
                    {...this.state}
                    playerStatistic={ playerStatistic }
                />
                <PredictionMain
                    animationFirstStep={ this.animationFirstStep }
                    animationSecondStep={ this.animationSecondStep }
                    animationThirdStep={ this.animationThirdStep }
                    {...this.state}
                    isPredicting={ isPredicting }
                />
            </div>
        )
    }
}
