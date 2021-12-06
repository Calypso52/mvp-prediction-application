import React, { Component } from 'react'
import './index.css'

export default class PredictionLeftBar extends Component {
    state = {
        // 当前选中的选项序号
        currentIndex: 0
    }

    setCurrentIndex = (event) => {
        // 获取当前点的是哪一个li索引
        let itemIndex = parseInt(event.currentTarget.getAttribute('index'), 10);
        // 获取当前选中的奖项名称
        let itemPrize = event.currentTarget.firstElementChild.nextElementSibling.innerHTML;
        // 获取当前选中的奖项icon类
        let itemIcon = event.currentTarget.firstElementChild.getAttribute('class');
        // 将选中的li添加active类使其高亮
        this.setState({ currentIndex: itemIndex });
        // 更新选中的奖项
        this.props.setCurrentPrize(itemPrize, itemIcon);
        // 清空展示图像中的数据条
        this.props.clearFigure();
        // 执行查询预测结果函数
        setTimeout(() => { this.sendPrediction(itemIndex) }, 500);
    }

    // 查询预测结果函数
    sendPrediction = (itemIndex) => {
        let percent;
        switch(itemIndex) {
            case 0: // 发送MVP预测
                percent = 0.9;
                break;
            case 1: // 发送DPOY预测
                percent = 0.755
                break;
            case 2: // 发送MIP预测
                percent = 0.15
                break;
            default:
                break;
        }
        this.props.percentage(percent);
    }

    render() {
        const prizeItemArr = [
                                ['fas fa-trophy', 'MVP'], 
                                ['fas fa-shield-alt', 'DPOY'], 
                                ['fas fa-level-up-alt', 'MIP']
                            ];
        let itemList = [];
        for(let i = 0; i < prizeItemArr.length; i++) {
            itemList.push(
                <li 
                    key = { i }
                    className={ `prediction-left-bar-item ${this.state.currentIndex === i ? 'active' : ''}` }
                    index = { i }
                    onClick={ this.setCurrentIndex }
                >
                    <i className={ prizeItemArr[i][0] }></i>
                    <div className="prediction-prize">{ prizeItemArr[i][1] }</div>
                    <div className="left-string"></div>
                    <div className="prediction-active-Background"></div>
                </li>
            )
        }
        return (
            <div className="prediction-left-bar">
                <div className="prediction-left-bar-award">Awards Prediction</div>
                <div></div>
                <ul className="prediction-left-bar-menu">
                    {/* <li className="prediction-left-bar-item" ref={ c => this.itemMVP = c } onClick={ this.predictItemClick }>
                        <i class="fas fa-trophy"></i>
                        <div className="prediction-prize">MVP</div>
                        <div className="left-string"></div>
                    </li>
                    <li className="prediction-left-bar-item" onClick={ this.predictItemClick }>
                        <i class="fas fa-shield-alt"></i>
                        <div className="prediction-prize">DPOY</div>
                        <div className="left-string"></div>
                    </li>
                    <li className="prediction-left-bar-item" onClick={ this.predictItemClick }>
                        <i class="fas fa-level-up-alt"></i>
                        <div className="prediction-prize">MIP</div>
                        <div className="left-string"></div>
                    </li> */}
                    { itemList }
                </ul>
            </div>
        )
    }
}
