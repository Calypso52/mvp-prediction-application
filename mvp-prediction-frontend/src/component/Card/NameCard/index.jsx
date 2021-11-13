import React, { Component } from 'react'

export default class NameCard extends Component {
    getName = (name) => {
        this.props.setNameToInput(name);
    }

    render() {
        const { players } = this.props;
        return (
            <ul className="menu-bar">
                {
                    players.map( player => {
                        return  <li 
                                    key={ player.id }
                                    onClick={ () => this.getName(player.name) }
                                >
                                    <div className="icon">
                                        <img 
                                            src={ player.src }
                                            alt="Anthony"
                                        />
                                    </div>
                                    { player.name }
                                </li>
                    })
                }
            </ul>
        )
    }
}
