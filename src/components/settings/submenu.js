import React from 'react';
import './index.css'
import {DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <div className="captcha-submenu">
                    <span className='main-heading-color'>Settings</span>
                </div>
                <div className="profile-manger-btns">
                    <ul>
                        <li className='deactivate-btn'>
                            <DefaultButton2 
                                onClick={this.props.logout} 
                                text="Deactivate" 
                                styles={{
                                    margin: '0 auto',
                                    width: undefined,
                                    fontSize: 14,
                                    borderColor: '#C24148'
                                }}/>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
};

