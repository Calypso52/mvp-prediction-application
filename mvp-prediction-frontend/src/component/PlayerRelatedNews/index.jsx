import React, { Component } from 'react'
import { Skeleton } from 'antd';
import './index.css'

export default class PlayerRelatedNews extends Component {
    render() {
        const { playerStatistic, isSearchStatisticLoading } = this.props;
        const newsUrl = playerStatistic.newsUrl || '';
        const newsTitle = playerStatistic.newsTitle || '';
        const newsDate = playerStatistic.newsDate || '';
        const newsIntro = playerStatistic.newsIntro || '';
        // 新闻条目数组
        const newsUrlArray = newsUrl ? newsUrl.split(';') : [];
        const newsTitleArray = newsTitle ? newsTitle.split(';') : [];
        const newsDateArray = newsDate ? newsDate.split(';') : [];
        const newsIntroArray = newsIntro ? newsIntro.split(';') : [];
        return (
            <div className="PlayerRelatedNewsWrapper">
                {
                    isSearchStatisticLoading ? <Skeleton active /> :
                <ul>
                    <li className="newsItem">
                        <p className="newsItemTime">{ newsDateArray.length ? newsDateArray[0] : '' }</p>
                        <p className="newsItemTitle"><a href={ newsUrlArray.length ? newsUrlArray[0] : '' } target="_blank" rel="noreferrer">{ newsTitleArray.length ? newsTitleArray[0] : '' }</a></p>
                        <p className="newsItemAbstract">{ newsIntroArray.length ? newsIntroArray[0] : '' }</p>
                    </li>
                    <div className="newsCut"></div>
                    <li className="newsItem">
                        <p className="newsItemTime">{ newsDateArray.length ? newsDateArray[1] : '' }</p>
                        <p className="newsItemTitle"><a href={ newsUrlArray.length ? newsUrlArray[1] : '' } target="_blank" rel="noreferrer">{ newsTitleArray.length ? newsTitleArray[1] : '' }</a></p>
                        <p className="newsItemAbstract">{ newsIntroArray.length ? newsIntroArray[1] : '' }</p>
                    </li>
                    <div className="newsCut"></div>
                    <li className="newsItem">
                        <p className="newsItemTime">{ newsDateArray.length ? newsDateArray[2] : '' }</p>
                        <p className="newsItemTitle"><a href={ newsUrlArray.length ? newsUrlArray[2] : '' } target="_blank" rel="noreferrer">{ newsTitleArray.length ? newsTitleArray[2] : '' }</a></p>
                        <p className="newsItemAbstract">{ newsIntroArray.length ? newsIntroArray[2] : '' }</p>
                    </li>
                    <div className="newsCut"></div>
                </ul>
                }
            </div>
        )
    }
}
