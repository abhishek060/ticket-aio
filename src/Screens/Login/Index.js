import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { DefaultButton1 } from "../../components/Buttons/default";
import { Toaster } from "../../components/toast";
import Constant from "../../common/constants";
import Apis from "../../utils/api";
import "./Index.css";
import logo from "../../images/logo/full-text-logo.png"
import spinner from "../../images/spinner.gif";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            license_key: "",
            loading: false,
            nav: false,
            showToast: false,
            apiMessage: "",
            successResponse: false
        }
    }

    loader = () => {
        return (
            <div className='login-form'>
                <img src={spinner} style={{height: 100, width: 100}} alt="spinner" />
                <span className='text-center sub-heading-color'>Please wait while we validate your key..</span>
            </div>
        )
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        try {
            if (localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS)) {
                let loginDataFromLS = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS);
                if (loginDataFromLS === 'true') {
                    // let loginUserObj = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_INFO);
                    this.setState({nav: true})
                } else {
                    this.setState({nav: false})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    async submitValidateKey(e) {
        e.preventDefault();
        let context = this;
        const {license_key} = this.state;
        if (license_key === "") {
            context.setState({apiMessage: "Enter key", successResponse: false, showToast: true})
            return;
        }
        this.setState({loading: true});

        let dataObj = {
            "key": license_key,
            "app_id": Constant.APP_ID
        };
        await Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.LOGIN, dataObj).then(async function (res) {
            context.setState({loading: false});
            console.log(res);
            if (res.error) {
                context.setState({apiMessage: "Some error has occured", successResponse: false, showToast: true})
            } else if (res.status === 200) {
                if (res.data.success) {
                    if (res.data.is_expired) {
                        context.setState({
                            apiMessage: "License key has expired",
                            successResponse: false,
                            showToast: true
                        })
                    } else {
                        context.setState({
                            apiMessage: "Logged in successfully",
                            successResponse: true,
                            showToast: true
                        })
                        await context.setLocalStorageValue(res.data.response, context)
                    }
                } else {
                    context.setState({
                        apiMessage: res.data.msg,
                        successResponse: false,
                        showToast: true
                    })
                }
            } else {
                context.setState({
                    apiMessage: "Some error has occured",
                    successResponse: false,
                    showToast: true
                })
            }
        }).catch((err) => {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true
            })
            context.setState({loading: false});
        });
    }

    async setLocalStorageValue(userData, context) {
        await localStorage.setItem(Constant.LOCAL_STORAGE.LOGIN_STATUS, true);
        await localStorage.setItem(Constant.LOCAL_STORAGE.LOGIN_INFO, JSON.stringify(userData));
        context.setState({nav: true})
    }

    render() {
        const {loading, license_key, showToast, apiMessage, successResponse} = this.state;
        if (this.state.nav) {
            return <Redirect to='dashboard'/>
        }

        return (
            <Container fluid className='login-container'>
                <Toaster context={this} showToast={showToast} message={apiMessage} success={successResponse}/>
                <Row>
                    {!loading ? <div className="login-form">
                        <img src={logo} alt="logo" height={80}/>
                        <input
                            className="input-box"
                            onChange={(e) => {this.handleInputChange(e)}} 
                            value={license_key} 
                            name="license_key" 
                            type="text" 
                            required={true}
                            placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                        />
                        <DefaultButton1
                            onClick={(e) => this.submitValidateKey(e)} 
                            text="Login"
                        />
                    </div> : this.loader()}
                </Row>
            </Container>
        )
    }
}