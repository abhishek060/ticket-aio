import React from 'react';
import './index.css'
import {DefaultButton1, DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        const {onCreateTaskClicked, deleteAllTaskClicked, onStartAllTaskClicked, onStopAllTaskClicked} = this.props;
        return (
            <div style={{marginLeft: 10}}>
                <div className="task-submenu">
                    <span className='main-heading-color'>Tasks</span>
                </div>

                <div className="task-manger-btns">
                    <ul>
                        <li className='create-btn'>
                            <DefaultButton1 onClick={onCreateTaskClicked} text="Create Task"/>
                        </li>
                        <li className='start-btn'>
                            <DefaultButton2 onClick={onStartAllTaskClicked} text="Start All"/>
                        </li>
                        <li className='stop-btn'>
                            <DefaultButton1 onClick={onStopAllTaskClicked} text="Stop All"/>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton2 onClick={deleteAllTaskClicked} text="Delete All"/>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
};

