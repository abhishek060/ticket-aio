import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Col, Container, Modal, Row, Form} from "react-bootstrap";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Header from '../../components/header/index';
import SubHeaderMenu from '../../components/captcha/submenu';
import {DefaultButton1} from "../../components/Buttons/default";
import Apis from "../../utils/api";
import User from "../../utils/utility";
import './Index.css'

const Constant = require('../../common/constants');

export default class Captcha extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginUserObj: {},
            nav: false,
            contentHeight: window.innerHeight - 144,
            proxy: "",
            account: "",
            solverName: "",
            captchaType: "-1",
            captcha_site: "-1",
            showWindow: "0",
            googleAccountsData: [],
            captchaHarvestersData: [],
            captchaHarvesterInfoData: [],
            recordCaptchaData: []
        };
        this.startAndStopTaskInLS();
        this.fetchRecordedCaptcha();
    }

    fetchRecordedCaptcha() {
        let loginUserObj = localStorage.getItem('logged-user-obj');
        let userObj = JSON.parse(loginUserObj);
        this.fetchRecordCaptchaDataFromDb(userObj)
        setTimeout(this.fetchRecordedCaptcha.bind(this), 3000);
    }

    fetchRecordCaptchaDataFromDb(userObj) {
        this.setState({recordCaptchaData: []})
        let accessToken = userObj?.accessToken;
        // let appID = userObj.user[0].app_id;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.RECORD_CAPTCHA + Constant.API_ENDPOINTS.USER_CAPTCHA + '?access_token=' + accessToken).then(function (res) {
                if (res.error) {
                    User.logout()
                    // alert(failedResponseMessage)
                } else if (res.status === 200) {
                    // if (res.data.success)
                    context.setState({recordCaptchaData: res.data.data});
                } else {
                    // alert(failedResponseMessage)
                }
            }
        );
    }

    startAndStopTaskInLS() {
        let data = localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS);
        if (data !== null) {
            let captchaData = JSON.parse(data);
            let recordCaptchaData = this.state.recordCaptchaData;
            if (recordCaptchaData.length > 0) {
                for (let index = 0; index < captchaData.length; index++) {
                    if (captchaData[index].isV2Start) {
                        this.openV2(captchaData[index].accountID, captchaData[index].show, captchaData[index].id, captchaData[index].proxy, captchaData[index].captchaInfoID, recordCaptchaData[0]['id'])
                        this.setState({recordCaptchaData: []})
                        break;
                    }

                    if (captchaData[index].isV3Start) {
                        this.openV3(captchaData[index].accountID, captchaData[index].show, captchaData[index].id, captchaData[index].proxy, captchaData[index].captchaInfoID, recordCaptchaData[0]['id'])
                        this.setState({recordCaptchaData: []});
                        break;
                    }
                }
            }
            this.setState({captchaHarvestersData: captchaData})
        }
        // let loginUserObj = localStorage.getItem('logged-user-obj');
        // let userObj = JSON.parse(loginUserObj);
        // this.fetchRecordCaptchaDataFromDb(userObj)
        setTimeout(this.startAndStopTaskInLS.bind(this), 7000);
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
        this.fetchCaptchaHarvestersFromLS();
        this.fetchGmailAccountsFromLS();
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
                    this.fetchCaptchaDataFromDb(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    fetchCaptchaDataFromDb(userObj) {
        let accessToken = userObj.accessToken;
        let appID = userObj?.user[0]?.app_id;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.CAPTCHA_DATA + '?filter[where][app_id]=' + appID + '&access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                // if (res.data.success)
                context.setState({captchaHarvesterInfoData: res.data});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    formatWithIcon = (cell, row) => {
        return (
            <span>
                <i style={{marginLeft: '20px', fontSize: 15}} onClick={() => {
                    this.deleteAccountFromLS(row)
                }} className="fas fa-trash c-pointer"/>
            </span>
        )
    };

    columns = [
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: '5',
            text: 'Actions',
            formatter: this.formatWithIcon
        }
    ];

    deleteAccountFromLS(accountData) {
        const {googleAccountsData} = this.state;
        let newAccountArray = googleAccountsData;
        for (let index = 0; index < googleAccountsData.length; index++) {
            if (googleAccountsData[index].id === accountData.id) {
                newAccountArray.splice(index, 1);
                break;
            }
        }
        let context = this;

        localStorage.setItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES, JSON.stringify(newAccountArray));

        this.setState({googleAccountsData: newAccountArray}, () => {
            context.fetchGmailAccountsFromLS();
        })
    }

    CaptchaModal = () => {
        const {
            proxy,
            account,
            solverName,
            captchaType,
            googleAccountsData,
            showWindow,
            captchaHarvesterInfoData,
            captcha_site
        } = this.state;

        return (
            <Modal
                show={this.state.modalShow}
                onHide={() => {
                    this.setState({modalShow: false});
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <form id='taskaddForm' onSubmit={(e) => {
                    this.submitForm(e)
                }}>
                    <Modal.Body>
                        <span className='c-task-header sub-heading-color f-w-700'>Captcha</span>
                        <div id='card'>
                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <input
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={solverName}
                                        name='solverName'
                                        type="text" 
                                        required={true}
                                        placeholder="Solver name"
                                        className="input-box-color form-control"/>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <input
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={proxy}
                                        name='proxy'
                                        type="text" 
                                        required={true}
                                        placeholder="Proxy"
                                        className="input-box-color form-control"/>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control 
                                            className="input-box-color"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name='captcha_site'
                                            value={captcha_site} 
                                            as="select">
                                            <option value='-1'>Select site</option>
                                            {captchaHarvesterInfoData.map((data, index) => {
                                                return (
                                                    <option value={data.id}>{data.domain}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row style={{marginTop: 15}}>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control 
                                            className="input-box-color"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name='account'
                                            value={account} 
                                            as="select">
                                            <option value='-1'>Account</option>
                                            {googleAccountsData.map((data, index) => {
                                                return (
                                                    <option value={data.id}>{data.email}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control 
                                            className="input-box-color"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name='captchaType'
                                            value={captchaType} 
                                            as="select">
                                            <option value='-1'>Captcha type</option>
                                            {['v2', 'v3'].map((data, index) => {
                                                return (
                                                    <option value={data}>{data}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Control 
                                            className="input-box-color"
                                            onChange={(e) => this.handleInputChange(e)}
                                            name='showWindow'
                                            value={showWindow} 
                                            as="select">
                                            <option value='0'>Show Captcha Window</option>
                                            <option value='1'>Yes</option>
                                            <option value='2'>No</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div style={{marginTop: 20}}>
                                <DefaultButton1
                                    onClick={(e) => this.saveCapatchaInLS(e)}
                                    text={'Save'}
                                    styles={{width: '100%'}}/>
                            </div>
                        </div>
                    </Modal.Body>
                </form>
            </Modal>
        )
    };

    async findCookiesFullInfo(id) {
        const {googleAccountsData} = this.state;
        let found = false;
        for (let data of googleAccountsData) {
            if (data.id === id) {
                found = true;
                return data.cookies;
            }
        }
        if (!found) {
            return "1";

        }
    }

    async findCaptchaFullInfoData(id) {
        const {captchaHarvesterInfoData} = this.state;
        let found = false;
        for (let data of captchaHarvesterInfoData) {
            if (data.id === id) {
                found = true;
                return data;
            }
        }
        if (!found) {
            return "1";

        }
    }

    async findEmailIDFromCookiesFullInfo(id) {
        const {googleAccountsData} = this.state;
        for (let data of googleAccountsData) {
            if (data.id === id) {
                return data.email;
            }
        }
    }

    async saveCapatchaInLS(e) {
        e.preventDefault();
        const {
            proxy,
            account,
            solverName,
            captchaType,
            showWindow,
            captcha_site
        } = this.state;


        if (solverName === "") {
            alert("Solver name is required");
            return;
        }

        if (captcha_site === "") {
            alert("Select site");
            return;
        }

        if (captchaType === "-1") {
            alert("select captcha type");
            return;
        }
        if (showWindow === "0") {
            alert("select show captcha window");
            return;
        }
        if (account === "") {
            alert("Add new account or select one");
            return;
        }
        this.setState({modalShow: false});

        let dataObj = [{
            id: User.makeId(10),
            account: await this.findEmailIDFromCookiesFullInfo(account),
            accountID: account,
            solverName: solverName,
            captchaType: captchaType,
            proxy: proxy,
            show: showWindow,
            isV2Start: false,
            isV3Start: false,
            captchaInfoID: captcha_site
        }];
        await this.setCaptchaHarvestersInLS(dataObj)
    }

    fetchGmailAccountsFromLS() {
        let data = localStorage.getItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES);
        if (data !== null)
            this.setState({googleAccountsData: JSON.parse(data)})
    }

    fetchCaptchaHarvestersFromLS() {
        let data = localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS);
        if (data !== null)
            this.setState({captchaHarvestersData: JSON.parse(data)})
    }

    setCaptchaHarvestersInLS = async (captchaData) => {
        if (localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS)) {
            let previousData = JSON.parse(localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS));
            previousData.push(captchaData[0]);
            await localStorage.setItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS, JSON.stringify(previousData));
        } else {
            await localStorage.setItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS, JSON.stringify(captchaData));
        }
        this.fetchCaptchaHarvestersFromLS()
    };

    setLocalStorageValue = async (cookiesData) => {
        if (localStorage.getItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES)) {
            let previousData = (localStorage.getItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES));
            previousData.push(cookiesData[0]);
            await localStorage.setItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES, (previousData));

        } else {
            await localStorage.setItem(Constant.LOCAL_STORAGE.GOOGLE_COOKIES, cookiesData);
        }
        this.fetchGmailAccountsFromLS()
    };

    async openAddGmailAccountWindow() {
        let context = this;
        Apis.HttpPostRequest("http://localhost:9997/login", {}).then(function (res) {
            if (res.success) {
                // console.log(res.data)
                context.setLocalStorageValue(res.data)
            } else {
                alert("Failed to add account")
            }
        });
    }

    async openYoutube(accountID, proxy) {
        let cookies = await this.findCookiesFullInfo(accountID);
        // if (cookies === "1") {
        //     alert("You have deleted this account, delete this captcha and create a new one");
        //     return;
        // }
        // let context = this;
        Apis.HttpPostRequest("http://localhost:9997/youtube", {cookies: cookies, proxy: proxy}).then(function (res) {
            if (res.success) {
                // console.log(res.data)
                // context.setLocalStorageValue(res.data)
            } else {
                // alert("Failed to add account")
            }
        });
    }

    async stopV2(captchaID) {
        this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV2Start", false)
    }

    async startV2(captchaID) {
        this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV2Start", true)
    }

    async stopV3(captchaID) {
        this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV3Start", false)
    }

    async startV3(captchaID) {
        this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV3Start", true)
    }

    deleteCaptchaHarvesterFromLS(captchaID) {
        let data = localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS);
        if (data !== null) {
            let captchaArray = JSON.parse(data);

            let newcaptchaArray = captchaArray;
            for (let index = 0; index < captchaArray.length; index++) {
                if (captchaArray[index].id === captchaID) {
                    newcaptchaArray.splice(index, 1);
                    break;
                }
            }
            // let context = this;
            localStorage.setItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS, JSON.stringify(newcaptchaArray));
            this.fetchCaptchaHarvestersFromLS();
        }
    }

    startOrStopCaptchaKeyModificationInLS(id, key, value) {
        let data = localStorage.getItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS);
        if (data !== null) {
            let captchaData = JSON.parse(data);
            let newCaptchaArray = captchaData;

            for (let index = 0; index < captchaData.length; index++) {
                if (captchaData[index].id === id) {
                    newCaptchaArray[index][key] = value;
                    break;
                }
            }
            localStorage.setItem(Constant.LOCAL_STORAGE.CAPTCHA_HARVESTERS, JSON.stringify(newCaptchaArray));
            this.fetchCaptchaHarvestersFromLS();
        }
    }

    async openV2(id, show, captchaID, proxy, captchaInfoID, recordCaptchaID) {
        show = show !== "2";

        // this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV2Start", true);
        try {
            // let userID = this.state.loginUserObj.user[0].id;

            let cookies = await this.findCookiesFullInfo(id);

            if (cookies === "1") {
                return;
            }

            let v2Data = await this.findCaptchaFullInfoData(captchaInfoID);
            if (v2Data === "1") {
                return;
            }

            // let context = this;
            Apis.HttpPostRequest("http://localhost:9997/v2", {
                cookies: cookies,
                show: show,
                proxy: proxy,
                recordCaptchaID: recordCaptchaID,
                v2: v2Data
            }).then(function (res) {
                if (res.success) {
                } else {

                }
            });
        } catch (e) {
            this.startOrStopCaptchaKeyModificationInLS(id, "isV2Start", false)
        }
    }

    async openV3(id, show, captchaID, proxy, captchaInfoID, recordCaptchaID) {
        show = show !== "2";
        // this.startOrStopCaptchaKeyModificationInLS(captchaID, "isV3Start", true);
        try {
            // let userID = this.state.loginUserObj.user[0].id;

            let cookies = await this.findCookiesFullInfo(id);

            if (cookies === "1") {
                return;
            }

            let v3Data = await this.findCaptchaFullInfoData(captchaInfoID);
            if (v3Data === "1") {
                return;
            }

            // let context = this;
            Apis.HttpPostRequest("http://localhost:9997/v3", {
                cookies: cookies,
                show: show,
                recordCaptchaID: recordCaptchaID,
                proxy: proxy,
                v3: v3Data
            }).then(function (res) {
                if (res.success) {
                    // console.log(res.data)
                    // context.setLocalStorageValue(res.data)
                } else {
                    // alert("Failed to add account")
                }
            });
        } catch (e) {
            this.startOrStopCaptchaKeyModificationInLS(id, "isV3Start", false);
        }
    }

    _renderEmptyCaptcha() {
        return (
            <Col>
                <DefaultButton1 
                    onClick={() => this.setState({modalShow: true})}
                    text="Add Solver"
                    styles={{
                        margin: '0 auto',
                        width: '100%',
                        fontSize: 14,
                    }}/>
            </Col>
        )
    }

    _renderCaptcha(data, index) {
        return (
            <Col className='sub-container-background' key={index}>
                <div>
                    <span className='captcha-name main-heading-color'
                          style={{marginBottom: 5, textAlign: 'left'}}>{data.solverName}</span>
                    <i style={{position: 'absolute', top: 10, right: 10, fontSize: 15}} onClick={() => {
                        this.deleteCaptchaHarvesterFromLS(data.id)
                    }} className="fas fa-trash c-pointer main-heading-color2"/>
                    <input 
                        type="text" 
                        placeholder="Proxy"
                        className="input-box-color" 
                        disabled={true} 
                        value={data.proxy}
                    />

                    <span style={{marginTop: 10}} className="main-heading-color2">Captcha {data.captchaType}</span>

                    <ul>
                        <li className='yt-btn'>
                            <DefaultButton1 
                                onClick={() => this.openYoutube(data.accountID, data.proxy)} 
                                text="Youtube"
                                styles={{
                                    margin: '0 auto',
                                    width: undefined,
                                    fontSize: 14,
                                }}/>
                        </li>

                        <li className='clear-cc-btn'>
                            <DefaultButton1
                                onClick={() => data.isV2Start ? this.stopV2(data.id) : this.startV2(data.id)}
                                // onClick={() => data.isV2Start ? this.stopV2(data.id) : this.openV2(data.accountID, data.show, data.id, data.proxy, data.captchaInfoID)}
                                text={data.isV2Start ? "Stop V2" : "Start V2"}
                                styles={{
                                    margin: '0 auto',
                                    width: undefined,
                                    fontSize: 14,
                                }}/>
                        </li>

                        <li className='open-solver-btn'>
                            <DefaultButton1
                                onClick={() => data.isV3Start ? this.stopV3(data.id) : this.startV3(data.id)}
                                // onClick={() => data.isV3Start ? this.stopV3(data.id) : this.openV3(data.accountID, data.show, data.id, data.proxy, data.captchaInfoID)}
                                text={data.isV3Start ? "Stop V3" : "Start V3"}
                                styles={{
                                    margin: '0 auto',
                                    width: undefined,
                                    fontSize: 14,
                                }}/>
                        </li>
                        <li className='open-solver-btn'>
                            <span style={{fontSize: 12}} className="main-heading-color2">Account : {data.account}</span>
                        </li>
                    </ul>
                </div>
            </Col>
        )
    }

    render() {
        const {contentHeight, captchaHarvestersData, googleAccountsData} = this.state;
        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }
        return (
            <Container fluid>
                <Header path={this.props?.location?.pathname}/>
                <SubHeaderMenu onAddAccountClicked={() =>
                    this.openAddGmailAccountWindow()
                }/>
                {this.CaptchaModal()}

                <Row className='captcha-main-container main-background' style={{height: contentHeight}}>

                    <Col lg={4} style={{marginLeft: 0, marginRight: 0}}>
                        <Row style={{marginLeft: 0, marginRight: 0, marginTop: 40, marginBottom: 10}}>
                            {
                                captchaHarvestersData.map((data, index) => {
                                    return this._renderCaptcha(data, index)
                                })
                            }
                            {this._renderEmptyCaptcha()}
                        </Row>
                    </Col>

                    <Col lg={8} style={{backgroundColor: 'transparent'}}>
                        <Row style={{marginRight: 0}}>
                            <BootstrapTable 
                                keyField='id'
                                data={googleAccountsData}
                                columns={this.columns}
                                bordered={false}
                                noDataIndication={"No accounts added"}/>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}
