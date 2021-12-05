import React, { Component } from 'react'
import './index.css'
import NameCard from './NameCard';
import Loading from '../Loading'

export default class Card extends Component {
    // 点击下拉框中的球员，下拉框消失
    hideCard = () => {
        const key = 'from card';
        this.props.setCardOpacity(key);
    }
    render() {
        const { players, isSearchingNameLoading, isSearchInterval, isFilterNotFound, err, cardOpacity, cardDisplay } = this.props;
        const { setNameToInput } = this.props;
        const styleObj = {
            margin: '15px 170px'
        }
        return (
            <div className="cardWrapper" style={{ opacity: cardOpacity, display: cardDisplay }} onClick={ this.hideCard }>
                {
                    isSearchInterval ? <div></div> : 
                    isSearchingNameLoading ? <Loading styleObj={ styleObj }/> : 
                    isFilterNotFound ? <h3 style={{ color: '#fff' }}>No player name found</h3> :
                    err ? <h2 style={{ color: 'red' }}>{ err }</h2> : 
                    <NameCard 
                        players={ players }
                        setNameToInput={ setNameToInput }
                    />
                }
                
            </div>
        )
    }
}
