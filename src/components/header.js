import React from 'react';
// const {BrowserWindow} = window.require('electron').remote;
const {BrowserWindow} = require('electron').remote;

export default class Header extends React.Component {

    minimizeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    };

    maximizeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    };

    closeWindow = () => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    };

    render() {
        return (
            <div className="nav" id="title-bar">
                <div className="NavLogo">
                    <img className="logo" src={require('../images/logo/logo.png')} alt=""/>
                </div>
                <div id="title-bar-btns">
                    <i className="fas fa-window-minimize" onClick={()=> this.minimizeWindow()} id="min-btn"/>
                    <i className="fas fa-window-maximize" onClick={()=> this.maximizeWindow()} id="max-btn"/>
                    <i className="fas fa-window-close" onClick={()=> this.closeWindow()} id="close-btn"/>
                </div>
            </div>
        )
    }
};

