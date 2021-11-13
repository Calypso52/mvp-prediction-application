import React, { Component } from 'react'
import './index.css'
import NameCard from './NameCard';
import Loading from '../Loading'

export default class Card extends Component {
    render() {
        const { players, isSearchingNameLoading, isSearchInterval, isFilterNotFound, err } = this.props;
        const { setNameToInput } = this.props;
        const styleObj = {
            margin: '15px 170px'
        }
        return (
            <div className="wrapper">
                {
                    isSearchInterval ? <h3 style={{ color: '#fff' }}>Please enter play name</h3> :
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
