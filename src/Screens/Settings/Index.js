import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Header from '../../components/header/index';
import SubHeaderMenu from '../../components/settings/submenu';
import {DefaultButton1,DefaultButton2} from "../../components/Buttons/default";
import {Toaster} from "../../components/toast";
import Apis from "../../utils/api";
import User from "../../utils/utility";
import './Index.css'

const Constant = require('../../common/constants');

export default class Proxies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monitorDelay: 0,
            errorDelay: 0,
            webhook_url: "",
            loginUserObj: {},
            nav: false,

            apiMessage: "",
            successResponse: false,
            showToast: false,
            contentHeight: window.innerHeight - 144
        };
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {

        this.setState({contentHeight: window.innerHeight - 144})

        window.addEventListener("resize", (event) => {
            this.setState({contentHeight: window.innerHeight - 144})
        });

        try {
            if (localStorage.getItem('logged-status')) {
                let loginDataFromLS = localStorage.getItem('logged-status');
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem('logged-user-obj');
                    let userObj = JSON.parse(loginUserObj);
                    this.fetchUserData(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    fetchUserData(userObj) {
        this.fetchDataFromApi(Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.USER_DATA, userObj)
    }

    fetchDataFromApi(apiEndPoint, userObj) {
        let context = this;
        let accessToken = userObj.accessToken;
        Apis.HttpGetRequest(Constant.BASE_URL + apiEndPoint + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success) {
                    let userData = res.data.userData;
                    context.setState({
                        monitorDelay: userData.monitor_delay === undefined ? 0 : userData.monitor_delay,
                        errorDelay: userData.error_delay === undefined ? 0 : userData.error_delay,
                        webhook_url: userData.discord_webhook === undefined ? "" : userData.discord_webhook
                    });
                }
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    async saveSettingsData(e) {
        const {monitorDelay, errorDelay} = this.state;
        e.preventDefault();
        await this.updateSettings({
            "monitor_delay": monitorDelay,
            "error_delay": errorDelay
        })
    }

    async saveDiscordSettingsData(e) {
        const {webhook_url} = this.state;
        e.preventDefault();
        await this.updateSettings({discord_webhook: webhook_url})
    }

    async updateSettings(updateObj) {
        this.setState({loading: true});
        let accessToken = this.state.loginUserObj.accessToken;
        let context = this;
        await Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.UPDATE_SETTINGS + '?access_token=' + accessToken, updateObj).then(async function (res) {
            context.setState({loading: false});
            if (res.error) {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                User.logout()
            } else if (res.status === 200) {
                if (res.data.success) {
                    context.fetchUserData(context.state.loginUserObj);
                    context.setState({
                        apiMessage: "Settings updated successfully",
                        successResponse: true,
                        showToast: true
                    })
                } else {
                    context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                }
            } else {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
            }
        }).catch((err) => {
            context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
            context.setState({loading: false});
        });
    }

    async testDiscordLink() {
        let accessToken = this.state.loginUserObj.accessToken;
        let context = this;
        await Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.TEST_DISCORD + '?access_token=' + accessToken, {}).then(async function (res) {
            if (res.error) {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
                User.logout();
            } else if (res.status === 200) {
                if (res.data.success) {
                    context.setState({
                        apiMessage: res.data.msg,
                        successResponse: true,
                        showToast: true
                    })
                } else {
                    context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                }
            } else {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
            }
        }).catch((err) => {
            context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
        });
    }

    render() {
        const {monitorDelay, errorDelay, webhook_url,showToast,apiMessage,successResponse,contentHeight} = this.state;

        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }

        return (
            <Container fluid>
                <Toaster context={this} showToast={showToast} message={apiMessage} success={successResponse}/>
                <Header path={this.props?.location?.pathname}/>
                <SubHeaderMenu logout={() => {
                    localStorage.clear();
                    window.location.href = '#/'
                }}/>

                <Row className='settings-main-container main-background' style={{height: contentHeight}}>

                    <Col className='sub-container-background'>
                        <div>
                            <div className='captcha-name sub-heading-color'>Monitor Delay</div>
                            <div style={{display: 'inline-flex'}}>
                                <div className='counter-value'>{monitorDelay}</div>
                                <div className='settings-plus-minus'>
                                    <span 
                                        className='setting-minus hover-btn'
                                        onClick={() => this.setState({monitorDelay: monitorDelay < 100 ? 0 : monitorDelay - 100})}
                                    ><i className="fas fa-minus"/></span>
                                    <span 
                                        className='setting-plus hover-btn'
                                        onClick={() => this.setState({monitorDelay: monitorDelay + 100})}
                                    ><i className="fas fa-plus"/></span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='captcha-name sub-heading-color'>Error Delay</div>
                            <div style={{display: 'inline-flex'}}>
                                <div className='counter-value'>{errorDelay}</div>
                                <div className='settings-plus-minus'>
                                    <span 
                                        className='setting-minus hover-btn'
                                        onClick={() => this.setState({errorDelay: errorDelay < 100 ? 0 : errorDelay - 100})}
                                    ><i className="fas fa-minus"/></span>
                                    <span 
                                        className='setting-plus hover-btn'
                                        onClick={() => this.setState({errorDelay: errorDelay + 100})}
                                    ><i className="fas fa-plus"/></span>
                                </div>
                            </div>
                        </div>
                        <DefaultButton1 
                            onClick={(e) => this.saveSettingsData(e)} 
                            text="Save" 
                            styles={{
                                margin: '0 auto',
                                width: '100%',
                                fontSize: 14,
                                borderColor: '#CA7653'
                            }}/>
                    </Col>

                    <Col style={{backgroundColor: 'transparent'}}/>

                    <div className='setting-footer'>
                        <div className='setting-footer-text'>Discord Webhook</div>
                        <div style={{display: 'inline-flex', width: '100%'}}>
                            <input
                                className="settings-input bg-transparent input-box-color"
                                value={webhook_url} 
                                onChange={(e) => this.handleInputChange(e)} 
                                name='webhook_url'
                                type="text" 
                                required={true} 
                                placeholder="Webhook"
                            />
                            <DefaultButton1 
                                onClick={(e)=> this.testDiscordLink(e)} 
                                text="Test" 
                                styles={{
                                    marginLeft: 15,
                                    width: '8%',
                                    fontSize: 14,
                                    borderColor: '#CA7653'
                                }}/>
                            <DefaultButton2 
                                onClick={(e) => this.saveDiscordSettingsData(e)} 
                                text="Save" 
                                styles={{
                                    marginLeft: 15,
                                    width: '8%',
                                    fontSize: 14,
                                    borderColor: '#CA7653'
                                }}/>
                        </div>
                    </div>
                </Row>
            </Container>
        );
    }
}
