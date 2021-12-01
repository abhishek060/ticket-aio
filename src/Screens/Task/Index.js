import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Col, Container, Modal, Row, Form} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Header from '../../components/header/index';
import SubHeaderMenu from '../../components/task/submenu';
import {DefaultButton1, DefaultButton2} from "../../components/Buttons/default";
import {Toaster} from "../../components/toast";
import Apis from "../../utils/api";
import User from "../../utils/utility";
import * as Sites from "../../common/sites";
import './Index.css';

const Constant = require('../../common/constants');

export default class Task extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            taskData: [],
            selectedData: [],
            profileDataArray: [],
            proxyData: [],
            keywords: "",
            task_name: "",
            amount: "",
            size: "-1",
            taskCount: 1,
            proxy_id: "",
            profile_name: "",
            profile_id: "",
            loginUserObj: {},
            nav: false,
            taskID: "",
            buttonText: "Create",
            site_name: "",
            isUpdating: false,
            loader: false,
            apiMessage: "",
            successResponse: false,
            showToast: false,
            contentHeight: window.innerHeight - 144,
            selectProfile: {},
            selectProxy: {},
            showLogsModal: false,
            taskLogs: [],
            showDeleteAllModal: false,
            taskRow: [],
        };
        // this.handleSelect = this.handleSelect.bind(this);
        this._fetchTaskAtRegularInterval();
    }

    _renderSize() {
        let data = [];
        let index = 4.0;
        while (index <= 15) {
            data.push(
                <option key={index} value={index}>{index}</option>
            )
            index = index + 0.5;
        }
        return data;
    }

    copyAndCreateTask(row) {
        let accessToken = this.state.loginUserObj.accessToken;
        try {
            let dataObj = {
                keywords: row.keywords === undefined || row.keywords === "" ? row.url : row.keywords,
                task_name: row.task_name,
                amount: row.amount,
                site_name: row.site_name,
                size: [row.size],
                proxy_id: row.proxy_id,
                profile_id: row.profile_id,
                cardIdentifier: row.cardIdentifier,
                profileIdentifier: row.profileIdentifier,
                proxyIdentifier: row.proxyIdentifier === undefined ? "" : row.proxyIdentifier,

            };
            let context = this;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.ADD_ORDER + "?access_token=" + accessToken, dataObj).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured while copying task",
                        successResponse: false,
                        showToast: true
                    })
                    User.logout()
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchTaskData(context.state.loginUserObj)
                        context.setState({
                            apiMessage: "Task created successfully",
                            successResponse: true,
                            showToast: true
                        })
                    }
                    else
                        context.setState({apiMessage: res.data.msg, successResponse: false, showToast: true})
                } else {
                    context.setState({
                        apiMessage: "Some error has occured while copying task",
                        successResponse: false,
                        showToast: true
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured while copying task",
                successResponse: false,
                showToast: true
            })
        }
    }

    editTask(row) {
        const {profileDataArray, proxyData} = this.state;

        this.setState({
            taskID: row.id,
            keywords: row.keywords === undefined || row.keywords === "" ? row.url : row.keywords,
            task_name: row.task_name,
            site_name: row.site_name,
            amount: row.amount,
            size: row.size,
            proxy_id: row.proxy_id,
            // profile_name: row.keywords,
            profile_id: row.profile_id,
            modalShow: true,
            buttonText: "Update",
            isUpdating: true
        });


        let proxyFound = false;
        let profileFound = false;

        for (let profile of profileDataArray) {
            if (profile.id === row.profile_id) {
                this.setState({selectProfile: profile})
                profileFound = true;
            }
        }
        for (let proxy of proxyData) {
            if (proxy.id === row.proxy_id) {
                this.setState({selectProxy: proxy})
                proxyFound = true;
            }
        }
        if (!profileFound)
            this.setState({selectProfile: {identifier: 'random'}})

        if (!proxyFound)
            this.setState({selectProxy: {identifier: 'random'}})


        // cardIdentifier: row.cardIdentifier,
        //     profileIdentifier: row.profileIdentifier,
        //     proxyIdentifier: row.proxyIdentifier
    }

    updateOrders(e) {
        this.setState({modalShow: false})
        e.preventDefault();
        try {
            let accessToken = this.state.loginUserObj.accessToken;
            let context = this;
            const {task_name, taskID, proxy_id, site_name, profile_id, size, keywords, amount, selectProfile, selectProxy} = this.state;

            let dataObj = {
                id: taskID,
                keywords: keywords,
                task_name: task_name,
                site_name: site_name,
                amount: amount,
                size: [size],
                proxy_id: proxy_id,
                profile_id: profile_id,
                cardIdentifier: selectProfile.identifier,
                profileIdentifier: selectProfile.identifier,
                proxyIdentifier: selectProxy.identifier
            };

            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.UPDATE_ORDERS + "?access_token=" + accessToken, dataObj).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Failed to update task",
                        successResponse: false,
                        showToast: true
                    })
                    User.logout()
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchTaskData(context.state.loginUserObj);
                        context.setState({
                            apiMessage: "Updated successfully",
                            successResponse: true,
                            showToast: true
                        })
                    }
                    else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true
                        })
                } else {
                    context.setState({
                        apiMessage: "Failed to update task",
                        successResponse: false,
                        showToast: true
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Failed to update task",
                successResponse: false,
                showToast: true
            })
        }
    }

    _fetchTaskAtRegularInterval() {
        if (localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS)) {
            let loginDataFromLS = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS);
            if (loginDataFromLS === 'true') {
                let loginUserObj = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_INFO);
                let userObj = JSON.parse(loginUserObj);
                this.setState({loginUserObj: userObj});
                this.fetchTaskData(userObj);
            }
        }
        setTimeout(this._fetchTaskAtRegularInterval.bind(this), 3000);
    }

    handleInputChange(event) {
        const {profileDataArray, proxyData} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name === 'profile_id') {
            if (value === 'random')
                this.setState({selectProfile: {identifier: 'random'}});
            for (let profile of profileDataArray) {
                if (profile.id === value) {
                    this.setState({selectProfile: profile})
                }
            }
        }
        if (name === 'proxy_id') {
            if (value === 'random')
                this.setState({selectProxy: {identifier: 'random'}});
            for (let proxy of proxyData) {
                if (proxy.id === value)
                    this.setState({selectProxy: proxy})
            }
        }
        this.setState({
            [name]: value
        });
    }

    resetTaskFormFields() {
        this.setState({
            keywords: "",
            task_name: "",
            amount: "",
            size: "",
            site_name: "",
            proxy_id: "",
            profile_name: "",
            profile_id: "",
            selectProfile: {},
            selectProxy: {}
        })
    }

    componentDidMount() {
        this.setState({contentHeight: window.innerHeight - 144})

        window.addEventListener("resize", (event) => {
            this.setState({contentHeight: window.innerHeight - 144})
        });
        setTimeout(() => {
            try {
                if (localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS)) {
                    let loginDataFromLS = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_STATUS);
                    if (loginDataFromLS === 'true') {
                        let loginUserObj = localStorage.getItem(Constant.LOCAL_STORAGE.LOGIN_INFO);
                        let userObj = JSON.parse(loginUserObj);
                        // this.fetchSiteData(userObj);
                        this.fetchTaskData(userObj);
                        this.fetchProfileData(userObj);
                        this.fetchProxyData(userObj);
                        this.setState({loginUserObj: userObj})
                    } else {
                        this.setState({nav: true})
                    }
                }
            } catch (e) {
                console.log(e.message)
            }
        }, 3000)
    }

    fetchSiteData(userObj) {
        this.fetchDataFromApi(Constant.API_ENDPOINTS.SITE, 'addSiteData', userObj)
    }

    fetchProfileData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.USER_PROFILES + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({profileDataArray: res.data.profiles});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    fetchProxyData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROXIES + Constant.API_ENDPOINTS.USER_PROXIES + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({proxyData: res.data.proxies});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    fetchTaskData(userObj) {
        this.fetchDataFromApi(Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.USER_ORDERS, 'taskData', userObj)
    }

    fetchDataFromApi(apiEndPoint, stateName, userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + apiEndPoint + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout()
                // alert(failedResponseMessage)
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({[stateName]: res.data.orders});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    startFetchlogs(taskID) {
        this.setState({taskLogs: []});
        this.interval = setInterval(() => this.fetchLogsOfTask(taskID), 2500);
    }

    stopFetchLogs() {
        this.setState({showLogsModal: false});
        clearInterval(this.interval);
    }

    fetchLogsOfTask(taskID) {
        const {loginUserObj} = this.state;
        let accessToken = loginUserObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + 'task_logs/task-logs/' + taskID + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                // User.logout()
            } else if (res.status === 200) {
                if (res.data.success)
                    context.setState({taskLogs: res.data.data});
            } else {
                // alert(failedResponseMessage)
            }
        });
    }

    openAddTaskModal = () => {
        // this.resetTaskFormFields();
        this.setState({isEditing: false, modalShow: true, isUpdating: false});
    };

    onAddTaskModalClose() {
        this.setState({modalShow: false});
    }

    openDeleteAllTaskModal() {
        this.setState({showDeleteAllModal: true});
    }

    closeDeleteAllTaskModal() {
        this.setState({showDeleteAllModal: false});
    }

    formatWithIcon = (cell, row) => {
        return (
            <span>
                <i onClick={() => {
                    row.status === 'created' || row.status === 'stopped' ? this.startTask(row) : this.stopTask(row)
                }}
                   className={row.status === 'created' || row.status === 'stopped' ? "fas fa-play c-pointer" : "fas fa-pause c-pointer"}/>
                <i onClick={() => {this.editTask(row)}} className="fas fa-pen c-pointer"/>
                <i onClick={() => {this.deleteTask(row)}} className="fas fa-trash c-pointer"/>
                <i onClick={() => {this.copyAndCreateTask(row)}} className="fas fa-copy c-pointer"/>
                <i onClick={() => {
                    this.setState({showLogsModal: true})
                    this.startFetchlogs(row.id)
                }} className="fas fa-info c-pointer"/>
            </span>
        )
    };

    columns = [
        {
            dataField: 'task_name',
            text: 'Task Name',
        },
        {
            dataField: 'site_name',
            text: 'Store'
        },
        {
            dataField: 'keywords',
            text: 'Keywords/URL',
            formatter: (cell, row) => {
                if (row.keywords === undefined || row.keywords === "")
                    return <span>{row.url}</span>
                else
                    return <span>{row.keywords}</span>
            }
        }, {
            dataField: 'size',
            text: 'Size'
        },
        {
            dataField: 'profile',
            text: 'Profile',
            formatter: (cell, row) => {
                if (row.profile !== undefined)
                    return <span>{row.profile.profile_name}</span>
                else
                    return <span>random</span>
            }
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell, row) => {
                return <span className={row.status === 'stopped' ? 'stopped' : 'created'}>{row.status}</span>
            }
        },
        {
            dataField: '5',
            text: 'Actions',
            formatter: this.formatWithIcon
        }
    ];

    taskLogsColumns = [
        {
            dataField: 'timeStamp',
            text: 'Time',
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'center', width: '20%', fontSize: '11px'};
            },
            formatter: (cell, row) => {
                let dateObj = new Date(row.timeStamp);
                return (<span
                    style={{fontSize: 11}}>{dateObj.getDate() + "/" + parseInt(dateObj.getMonth() + 1) + "/" + dateObj.getFullYear() + " " + dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds()}</span>);
            }

        },
        {
            dataField: 'logText',
            text: 'Log',
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'center', width: '80%', fontSize: '11px'};
            },
            formatter: (cell, row) => {
                return (<span style={{fontSize: 11}}>{row.logText}</span>)
            }
        }
    ];

    selectRow = {
        mode: 'checkbox',
        onSelect: (row, isSelect, rowIndex, e) => {
            let data = this.state.selectedData;
            if (isSelect) {
                data.push(row);
                this.setState({selectedData: data})
            } else {
                for (let index = 0; index < data.length; index++) {
                    if (row['id'] === data[index]['id'])
                        data.splice(index, 1)
                }
                this.setState({selectedData: data})
            }
        },
        onSelectAll: (isSelect, rows, e) => {
            let data = rows;
            if (isSelect) {
                this.setState({selectedData: data});
            } else {
                data = [];
                this.setState({selectedData: data});
            }
        }
    };

    startAllTask() {
        try {
            const {loginUserObj} = this.state;
            let context = this;
            let accessToken = loginUserObj.accessToken;
            if (accessToken === undefined) {
                context.setState({
                    apiMessage: "Please retry,operation failed",
                    successResponse: false,
                    showToast: true
                });
                return;
            }
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.START_ALL_TASKS + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true
                    });
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: true,
                            showToast: true
                        });
                        context.fetchTaskData(loginUserObj)
                    } else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true
                        });
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true
            })
        }
    }

    stopAllTask() {
        try {
            const {loginUserObj} = this.state;
            let context = this;
            let accessToken = loginUserObj.accessToken;
            if (accessToken === undefined) {
                context.setState({
                    apiMessage: "Please retry,operation failed",
                    successResponse: false,
                    showToast: true
                });
                return;
            }
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.STOP_ALL_TASKS + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true
                    });
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: true,
                            showToast: true
                        });
                        context.fetchTaskData(loginUserObj)
                    } else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true
                        });
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true
            })
        }
    }

    addSite() {
        this.setState({modalShow: false, isAddSiteModalOpened: true});
    }

    async startCaptchaHarvester() {
        fetch("http://localhost:9997/open-captcha-harvester", {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({main: true})
        })
            .then(res => console.log("Response :- " + (res)))
            .then(
                (result) => {
                    console.log((result));
                },
                (error) => {
                    console.log("error : " + error);
                }
            )
    }

    deleteTask(row) {
        let context = this;
        try {
            let accessToken = this.state.loginUserObj.accessToken;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.DELETE_USER_ORDER_SINGLE + '/' + row.id + '?access_token=' + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                    })
                    User.logout()
                } else if (res.status === 200) {
                    context.setState({
                        apiMessage: "Deleted successfully",
                        successResponse: true,
                        showToast: true,
                    });
                    context.fetchTaskData(context.state.loginUserObj)
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true,
            })
        }
    }

    deleteAllTask() {
        try {
            const {loginUserObj} = this.state;
            let context = this;
            let accessToken = loginUserObj.accessToken;
            if (accessToken === undefined) {
                context.setState({
                    apiMessage: "Please retry,operation failed",
                    successResponse: false,
                    showToast: true,
                    showDeleteAllModal: false
                });
                return;
            }
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.DELETE_USER_ORDER + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        showDeleteAllModal: false
                    })
                    User.logout()
                } else if (res.status === 200) {
                    if (res.data.success) {
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: true,
                            showToast: true,
                            showDeleteAllModal: false
                        });
                        context.fetchTaskData(loginUserObj)
                    } else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true,
                            showDeleteAllModal: false
                        });
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        showDeleteAllModal: false
                    })
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true,
                showDeleteAllModal: false
            })
        }
    }

    async createTask(e) {
        e.preventDefault();

        try {
            this.setState({modalShow: false});
            let accessToken = this.state.loginUserObj.accessToken;
            const {keywords, task_name, taskCount, amount, size, proxy_id, site_name, profile_id, selectProfile, selectProxy} = this.state;

            let dataObj = {
                keywords: keywords,
                task_name: task_name,
                site_name: site_name,
                amount: amount,
                size: [size],
                proxy_id: proxy_id,
                profile_id: profile_id,
                cardIdentifier: selectProfile.identifier,
                profileIdentifier: selectProfile.identifier,
                proxyIdentifier: selectProxy.identifier
            };

            let context = this;
            let taskName = dataObj.task_name;
            for (let index = 0; index < taskCount; index++) {
                if (taskCount > 1) {
                    dataObj.task_name = taskName;
                    dataObj.task_name = dataObj.task_name + "-" + (index + 1)
                }
                Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.ADD_ORDER + "?access_token=" + accessToken, dataObj).then(function (res) {
                    if (res.error) {
                        context.setState({
                            apiMessage: "Some error has occured",
                            successResponse: false,
                            showToast: true
                        })
                        User.logout()
                    }
                    else if (res.status === 200) {
                        if (res.data.success) {
                            context.fetchTaskData(context.state.loginUserObj);
                            context.setState({
                                apiMessage: "Created successfully",
                                successResponse: true,
                                showToast: true
                            })
                        } else
                            context.setState({
                                apiMessage: res.data.msg,
                                successResponse: false,
                                showToast: true
                            });
                    } else {
                        context.setState({
                            apiMessage: "Some error has occured",
                            successResponse: false,
                            showToast: true
                        });
                    }
                });
            }
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured " + e.message,
                successResponse: false,
                showToast: true
            })
        }
    }

    async startTask(row) {
        try {
            this.setState({
                apiMessage: "Starting Please wait...",
                loader: true,
                showToast: true
            })
            let accessToken = this.state.loginUserObj.accessToken;
            let context = this;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.START_TASK + "/" + row.id + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        loader: false
                    })
                    User.logout()
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchTaskData(context.state.loginUserObj);
                        context.setState({
                            apiMessage: "Task started successfully",
                            successResponse: true,
                            showToast: true,
                            loader: false
                        })
                    } else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true,
                            loader: false
                        });
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        loader: false
                    });
                }
            });

        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true,
                loader: false
            })
        }
    }

    async stopTask(row) {

        try {
            this.setState({
                apiMessage: "Stopping Please wait...",
                loader: true,
                showToast: true
            });
            let accessToken = this.state.loginUserObj.accessToken;
            let context = this;
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.ORDERS + Constant.API_ENDPOINTS.STOP_TASK + "/" + row.id + "?access_token=" + accessToken, {}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        loader: false
                    })
                    User.logout()
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchTaskData(context.state.loginUserObj);
                        context.setState({
                            apiMessage: "Task stopped successfully",
                            successResponse: true,
                            showToast: true,
                            loader: false
                        })
                    } else
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true,
                            loader: false
                        });
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        loader: false
                    });
                }
            });
        } catch (e) {
            this.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true,
                loader: false
            })
        }
    }

    TaskModal = () => {
        const {isUpdating, taskCount, site_name, profileDataArray, proxyData, keywords, task_name, amount, size, proxy_id, profile_id, buttonText} = this.state;
        return (
            <Modal
                show={this.state.modalShow}
                onHide={() => {
                    this.onAddTaskModalClose()
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <form id='taskaddForm' onSubmit={(e) => {
                    this.submitForm(e)
                }}>
                    <Modal.Body>

                        <span className='sub-heading-color'>{buttonText} Task</span>

                        <Row style={{marginTop: 15}}>
                            <Col>
                                <input
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={task_name}
                                    style={{background: 'transparent'}} 
                                    type="text" 
                                    required={true}
                                    placeholder="Task name"
                                    name='task_name'
                                    className="input-box-color form-control"/>
                            </Col>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Control
                                        className='input-box-color'
                                        onChange={(e) => this.handleInputChange(e)} 
                                        name='site_name'
                                        value={site_name} 
                                        as="select"
                                        multiple={false}
                                    >
                                        <option value='-1'>Select Site</option>
                                        {Sites.AIO.map((data, index) => {
                                            return (
                                                <option key={data.name} value={data.url}>{data.name}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row style={{marginTop: 15}}>
                            <Col>
                                <input 
                                    onChange={(e) => this.handleInputChange(e)}
                                    style={{background: 'transparent'}} 
                                    type="text"
                                    required={true}
                                    placeholder="Keywords"
                                    value={keywords}
                                    name='keywords'
                                    className="input-box-color form-control"/>
                            </Col>
                        </Row>

                        <Row style={{marginTop: 15}}>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Control 
                                        className='input-box-color'
                                        onChange={(e) => this.handleInputChange(e)} 
                                        name='size'
                                        value={size} 
                                        as="select"
                                        multiple={false}
                                    >
                                        <option value='-1'>Select Size</option>
                                        <option value='random'>Random</option>
                                        {this._renderSize()}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <input
                                    onChange={(e) => this.handleInputChange(e)}
                                    value={amount}
                                    name='amount'
                                    style={{height: 40}} 
                                    type="number"
                                    required={true}
                                    placeholder="Amount"
                                    className="input-box-color form-control"/>
                            </Col>
                        </Row>

                        <Row style={{marginTop: 15}}>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Control 
                                        className='input-box-color'
                                        onChange={(e) => this.handleInputChange(e)} 
                                        name='profile_id'
                                        value={profile_id} 
                                        as="select"
                                        multiple={false}
                                    >
                                        <option value='-1'>Select Profile</option>
                                        <option value='random'>Random</option>
                                        {profileDataArray.map((data, index) => {
                                            return (
                                                <option key={data.id} value={data.id}>{data.profile_name}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Control 
                                        className='input-box-color'
                                        onChange={(e) => this.handleInputChange(e)} 
                                        name='proxy_id'
                                        value={proxy_id} 
                                        as="select"
                                        multiple={false}
                                    >
                                        <option value='-1'>Select Proxy</option>
                                        <option value='random'>Random</option>
                                        {proxyData.map((data, index) => {
                                            return (
                                                <option key={data.id} value={data.id}>{data.ip + ":" + data.port}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        {!isUpdating ? <Row>
                            <Col style={{position: 'relative'}}>
                                <span className='sub-heading-color' style={{
                                    position: 'absolute',
                                    right: 100,
                                    padding: 7,
                                    fontWeight: 'bold',
                                    marginTop: 10
                                }}>Task Count : {taskCount}</span>
                                <div style={{height: 40, position: 'absolute', right: 10, top: 0, marginTop: 8}}>
                                    <span className='setting-minus hover-btn line-h-40'
                                        onClick={() => this.setState({taskCount: taskCount < 2 ? 1 : taskCount - 1})}>-</span>
                                    <span className='setting-plus hover-btn line-h-40'
                                        onClick={() => this.setState({taskCount: taskCount + 1})}>+</span>
                                </div>
                            </Col>
                        </Row> : null}

                        <div style={{marginTop: 60}}>
                            <DefaultButton1
                                onClick={(e) => isUpdating ? this.updateOrders(e) : this.createTask(e)}
                                text={buttonText}
                                styles={{width: '100%'}}
                            />
                        </div>

                    </Modal.Body>
                </form>
            </Modal>
        )
    };

    TaskLogsModal = () => {
        const {taskLogs} = this.state;
        return (
            <Modal
                show={this.state.showLogsModal}
                onHide={() => {
                    this.stopFetchLogs()
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Body>
                    <span className='sub-heading-color'>Task Logs</span>
                    <div style={{
                        height: taskLogs.length === 0 ? 100 : this.state.contentHeight - 50,
                        overflowY: 'auto'
                    }}>
                        <BootstrapTable 
                            id="taskDataTable" 
                            className="logTable" 
                            keyField='id' 
                            data={taskLogs}
                            columns={this.taskLogsColumns}
                            bordered={false}
                            noDataIndication={"No logs found"}
                        />
                    </div>
                    <div style={{marginTop: 60}}>
                        <DefaultButton1
                            onClick={(e) => this.stopFetchLogs()}
                            text="Close"
                            styles={{width: '100%'}}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        )
    };

    DeleteAllModal = () => {
        return (
            <Modal
                show={this.state.showDeleteAllModal}
                onHide={() => {this.closeDeleteAllTaskModal()}}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title className='sub-heading-color'>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete all tasks?</Modal.Body>
                <Modal.Footer>
                    <DefaultButton1 text="Cancel" onClick={() => {this.closeDeleteAllTaskModal()}} />
                    <DefaultButton2 text="Delete" onClick={() => {this.deleteAllTask()}} />
                </Modal.Footer>
            </Modal>
        )
    };

    handleSelect(key) {
        this.setState({key: key});
    }

    render() {
        const {showToast, apiMessage, loader, successResponse, contentHeight} = this.state;
        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }
        return (
            <Container fluid>

                {this.TaskModal()}
                {this.TaskLogsModal()}
                {this.DeleteAllModal()}

                <Toaster 
                    loader={loader} 
                    context={this} 
                    showToast={showToast} 
                    message={apiMessage}
                    success={successResponse}
                />

                <Header path={this.props?.location?.pathname}/>

                <SubHeaderMenu
                    onCreateTaskClicked={() => this.openAddTaskModal()}
                    onStartAllTaskClicked={() => this.startAllTask()}
                    onStopAllTaskClicked={() => this.stopAllTask()}
                    deleteAllTaskClicked={() => this.openDeleteAllTaskModal()}
                />
                <Row className='task-main-container main-background' style={{height: contentHeight}}>
                    <Col>
                        <BootstrapTable 
                            id="taskDataTable" 
                            keyField='id' 
                            data={this.state.taskData}
                            columns={this.columns}
                            selectRow={this.selectRow}
                            bordered={false}
                            noDataIndication={"No task added"}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
