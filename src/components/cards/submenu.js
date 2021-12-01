import React from 'react';
import './index.css'
import {Row} from "react-bootstrap";
import {DefaultButton1,DefaultButton2} from "../Buttons/default";

export default class TaskSubMenu extends React.Component {

    render() {
        return (
            <Row>
                <div className="profile-submenu">
                    <div>
                        <span className='main-heading-color'>Cards</span>
                    </div>

                </div>

                <div className="profile-manger-btns">
                    <ul>
                        <li className='create-btn'>
                            <DefaultButton1 onClick={this.props.openCardModal} text="Add Cards" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#DBDBDB'}}/>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton2 onClick={this.props.onDeleteAllCards} text="Delete All" styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#CA7653'}}/>
                        </li>
                    </ul>

                </div>

            </Row>
        )
    }
};

