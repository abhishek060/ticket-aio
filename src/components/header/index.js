import React from 'react';
import './index.css'
import {Link} from "react-router-dom";
import * as Color from "../../common/colors";
import logo from "../../images/logo/logo.png";

export default class Header extends React.Component {
    render() {
        const selectedIndex = this.props.path;
        return (
            <div className="header-nav">
                <div>
                    <img className="logo" src={logo} alt="logo"/>
                </div>

                <div className="menu-items">

                    <ul>
                        <Link to="/dashboard">
                            <li><i
                                className="fa fa-tachometer-alt"
                                style={{color: selectedIndex === '/dashboard' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/dashboard' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Home</span>
                            </li>
                        </Link>
                        <Link to="/task">
                            <li><i
                                className="fa fa-tasks"
                                style={{color: selectedIndex === '/task' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/task' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Task</span>
                            </li>
                        </Link>
                        <Link to="/profile">
                            <li><i className="fa fa-search-location"
                                   style={{color: selectedIndex === '/profile' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/profile' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Profile</span>
                            </li>
                        </Link>
                        {/*<Link to="/cards">*/}
                            {/*<li><i className="fa fa-credit-card"*/}
                                   {/*style={{color: selectedIndex === '/cards' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>*/}
                                {/*<span style={{color: selectedIndex === '/cards' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Cards</span>*/}
                            {/*</li>*/}
                        {/*</Link>*/}
                        <Link to="/proxies">
                            <li><i className="fa fa-network-wired"
                                   style={{color: selectedIndex === '/proxies' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/proxies' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}>Proxy</span>
                            </li>
                        </Link>

                        <Link to="/captcha">
                            <li><i className="fa fa-th-large"
                                   style={{color: selectedIndex === '/captcha' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/captcha' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR,left:-13}}>Captcha</span>
                            </li>
                        </Link>
                        <Link to="/settings">
                            <li style={{marginLeft:45}}><i className="fa fa-cog"
                                   style={{color: selectedIndex === '/settings' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR}}/>
                                <span style={{color: selectedIndex === '/settings' ? Color.PRIMARY_COLOR : Color.SECONDARY_COLOR,left:-13}}>Settings</span>
                            </li>
                        </Link>
                    </ul>

                </div>
            </div>
        )
    }
};

