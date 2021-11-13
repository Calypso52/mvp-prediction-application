import React, { Component } from 'react'
import './index.css'

export default class index extends Component {
    render() {
        return (
            <div className="outerWrap">
                <div className="loading" style={ this.props.styleObj }></div>
            </div>
        )
    }
}
