import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SideMenu extends React.Component {
    render() {
        const {selectedIndex} = this.props;
        return (
            <div className="mainSidebar">
                <ul>
                    <Link to="/">
                        <li style={{backgroundColor: selectedIndex === '/dashboard' ? '#3cdcc2' : 'initial'}}><i
                            className="fa fa-home"
                            style={{color: selectedIndex === '/dashboard' ? '#FFF' : '#3cdcc2'}}></i></li>
                    </Link>
                    <Link to="/task">
                        <li style={{backgroundColor: selectedIndex === '/task' ? '#3cdcc2' : 'initial'}}><i
                            className="fa fa-tasks" style={{color: selectedIndex === '/task' ? '#FFF' : '#3cdcc2'}}></i>
                        </li>
                    </Link>
                    <Link to="/profile">
                        <li style={{backgroundColor: selectedIndex === '/profile' ? '#3cdcc2' : 'initial'}}><i
                            className="fa fa-user"
                            style={{color: selectedIndex === '/profile' ? '#FFF' : '#3cdcc2'}}></i></li>
                    </Link>
                    <Link to="/proxies">
                        <li style={{backgroundColor: selectedIndex === '/proxies' ? '#3cdcc2' : 'initial'}}><i
                            className="fa fa-star"
                            style={{color: selectedIndex === '/proxies' ? '#FFF' : '#3cdcc2'}}></i></li>
                    </Link>
                    <Link to="/settings">
                        <li style={{backgroundColor: selectedIndex === '/settings' ? '#3cdcc2' : 'initial'}}><i
                            className="fa fa-cog"
                            style={{color: selectedIndex === '/settings' ? '#FFF' : '#3cdcc2'}}></i></li>
                    </Link>
                </ul>
            </div>
        )

    }
};

export default SideMenu;
