import React, { Component } from 'react'
import PredictionLeftBar from './PredictionLeftBar'
import PredictionMain from './PredictionMain'
import './index.css'

export default class PredictionBox extends Component {
    render() {
        return (
            <div className="pred-outerwrapper">
                <PredictionLeftBar/>
                <PredictionMain/>
            </div>
        )
    }
}
