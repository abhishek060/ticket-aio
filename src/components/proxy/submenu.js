import React from 'react';
import './index.css'
import {DefaultButton1, DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <div className="captcha-submenu">
                    <span className='main-heading-color'>Proxies</span>
                </div>

                <div className="profile-manger-btns">
                    <ul>
                        <li className='save-btn'>
                            <DefaultButton1 onClick={this.props.onProxySaveClicked} text="Save" styles={{
                                margin: '0 auto',
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#DBDBDB',
                            }}/>
                        </li>
                        <li className='test-btn'>
                            <DefaultButton1 onClick={this.props.testAllProxies} text="Test All" styles={{
                                margin: '0 auto',
                                width: undefined,
                                fontSize: 14,
                                borderColor: '#CA7653'
                            }}/>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton2 onClick={this.props.deleteAllProxies} text="Delete All" styles={{
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

