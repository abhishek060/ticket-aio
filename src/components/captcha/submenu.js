import React from 'react';
import './index.css'
import {DefaultButton1} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <div className="captcha-submenu">
                    <span className='main-heading-color'>Captcha</span>
                </div>

                <div className="captcha-manger-btns">
                    <ul>
                        <li className='add-account-btn'>
                            <DefaultButton1 
                                onClick={this.props.onAddAccountClicked} 
                                text="Add Account" 
                                styles={{
                                    margin: '0 auto',
                                    width: undefined,
                                    fontSize: 14,
                                    borderColor: '#CA7653'
                                }}/>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
};

