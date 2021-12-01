import React, {Component} from 'react';
import './Index.css'

import Header from '../../components/header/index';
import {Col, Container, Row} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Redirect} from "react-router-dom";
import Apis from "../../utils/api";
import DashboardHeader from "../../components/mokha-dashboard-header";
import {Line} from 'react-chartjs-2'
import User from "../../utils/utility";
import * as Color from "../../common/colors";
import play from "../../images/logo/play.png";
import moneyBag from "../../images/money-bag.png";
import shoe from "../../images/shoe.png";

const Constant = require('../../common/constants');

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginUserObj: {},
            nav: false,
            totalAmount: 0,
            totalOrders: 0,
            credits: 0,
            licenseKey: "",
            expiryDate: "",
            recentOrders: [],
            accountStatus: "",
            userEmail: ""
        };
    }

    componentDidMount() {
        try {
            if (localStorage.getItem('logged-status')) {
                let loginDataFromLS = localStorage.getItem('logged-status');
                if (loginDataFromLS === 'true') {
                    let loginUserObj = localStorage.getItem('logged-user-obj');
                    let userObj = JSON.parse(loginUserObj);
                    this.fetchDashboardData(userObj);
                    this.setState({loginUserObj: userObj})
                } else {
                    this.setState({nav: true})
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    fetchDashboardData(userObj) {
        let accessToken = userObj.accessToken;
        let context = this;
        Apis.HttpGetRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.USER + Constant.API_ENDPOINTS.DASHBOARD_DATA + '?access_token=' + accessToken).then(function (res) {
            if (res.error) {
                User.logout();
            } else if (res.status === 200) {
                if (res.data.success) {
                    let dashboardData = res.data.data
                    let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
                    context.setState({
                        licenseKey: dashboardData.licenseDetails.license_key,
                        expiryDate: new Date(parseInt(dashboardData.licenseDetails.expiry_date)).toLocaleString("en", dateOptions),
                        totalAmount: dashboardData.completedOrders.totalAmount === null ? 0 : dashboardData.completedOrders.totalAmount,
                        totalOrders: dashboardData.completedOrders.totalOrders,
                        credits: dashboardData.userData.credits,
                        recentOrders: dashboardData.recentOrders,
                        accountStatus: dashboardData.userData.is_active ? "Active" : "Inactive",
                        userEmail: dashboardData.userData.email
                    });
                }
            } else {
            }
        });
    }

    columns = [
        {
            dataField: 'url',
            text: 'Product URL',
            headerStyle: (colum, colIndex) => {
                return {textAlign: 'left', width: '50%'};
            }
        }, {
            dataField: 'size',
            text: 'Size',
            headerStyle: (colum, colIndex) => {
                return {width: '130px', textAlign: 'center'};
            },
            formatter: (cell, row) => {
                return <span>{row.size[0]}</span>
            }
        }, {
            dataField: 'added_on',
            text: 'Date',
            headerStyle: (colum, colIndex) => {
                return {width: '120px', textAlign: 'center'};
            },
            formatter: (cell, row) => {
                let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
                let purchaseDate = new Date(parseInt(row.added_on)).toLocaleString("en", dateOptions)
                return <span>{purchaseDate}</span>
            }
        }
    ];

    chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Monthly Purchase Analytics',
                fill: true,
                lineTension: 0.4,
                backgroundColor: Color.SECONDARY_COLOR,
                borderColor: Color.PRIMARY_COLOR,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: Color.PRIMARY_COLOR,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: Color.PRIMARY_COLOR,
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    purchaseChart = () => {
        return (
            <Line
                options={{
                    responsive: true,
                    legend: {
                        labels: {
                            fontColor: Color.SECONDARY_COLOR,
                            fontSize: 16,
                            boxWidth: 0,
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: Color.SECONDARY_COLOR,
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: Color.PRIMARY_COLOR,
                            }
                        }]
                    }
                }}
                data={this.chartData}
            />
        )
    }

    render() {
        const {licenseKey, expiryDate, totalAmount, totalOrders, credits, recentOrders, accountStatus, userEmail} = this.state
        if (this.state.nav === true) {
            return <Redirect to='/'/>
        }
        return (
            <Container fluid className='dashboard-container'>
                <Header path={this.props?.location?.pathname}/>
                <div className="p-l-70 p-r-70">
                    <Row className='center dashboard-sticky-header app-background-color'>
                        <DashboardHeader/>
                    </Row>
                    <Row>
                        <Col className='dashboard-main-container sub-container-background l-h-90'>
                            <Row>
                                <Col xs={2} className='text-center'>
                                    <img className='custom-radius' src={play} height={50} width={50} alt="play" />
                                </Col>
                                <Col>
                                    <Row className='r-h-30'>
                                        <span className='dash-title main-heading-color'>{userEmail}</span>
                                    </Row>
                                    <Row className='r-h-81'>
                                        <span className='dash-status main-heading-color2'>{accountStatus}</span>
                                    </Row>
                                </Col>
                                <Col/>
                                <Col>
                                    <span className='dash-status main-heading-color2'>Status : </span>
                                    <span className='dash-status main-heading-color'>Bound</span>
                                </Col>
                                {/*<Col>*/}
                                    {/*<DefaultButton1 onClick={() => alert("Under construction")} text="Unbind" styles={{*/}
                                        {/*margin: '0 auto',*/}
                                        {/*width: undefined,*/}
                                        {/*fontSize: 14,*/}
                                        {/*borderColor: '#C24148'*/}
                                    {/*}}/>*/}
                                {/*</Col>*/}
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col className='dashboard-main-container sub-container-background l-h-190'>
                            <Row className='vertical-align'>
                                <Col>
                                    <div className='square-box'>
                                        <div className='square-content'>
                                            <img src={moneyBag} alt="money-bag" style={{height: '33%', width: '70%'}} />
                                        </div>
                                    </div>
                                </Col>
                                <Col className='m-l-35'>
                                    <Row className='r-h-20'>
                                        <span className='dash-title main-heading-color'
                                              style={{fontSize: 20}}>$ {totalAmount}</span>
                                    </Row>
                                    <Row>
                                        <span className='dash-status main-heading-color2' style={{fontSize: 12}}>Total Amount Spent</span>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col className='dashboard-main-container sub-container-background l-h-190'>
                            <Row className='vertical-align'>
                                <Col>
                                    <div className='square-box'>
                                        <div className='square-content'>
                                            <img src={shoe} alt="shoe" style={{height: '33%', width: '70%'}} />
                                        </div>
                                    </div>
                                </Col>
                                <Col className='m-l-35'>
                                    <Row className='r-h-20'>
                                        <span className='dash-title main-heading-color'
                                              style={{fontSize: 20}}>{totalOrders}</span>
                                    </Row>
                                    <Row>
                                        <span className='dash-status main-heading-color2'
                                              style={{fontSize: 12}}>Total Items Purchased</span>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col className='dashboard-main-container sub-container-background l-h-190'>
                            {this.purchaseChart()}
                        </Col>
                    </Row>

                    <Row>
                        <Col className='dashboard-main-container sub-container-background'>
                            <Row className='card-row'>
                                <i className='dash-title fa fa-key main-heading-color2'/>
                                <span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'
                                >
                                    Key :
                                </span>
                                <span
                                    style={{paddingLeft: 7}}
                                    className='dash-title main-heading-color'
                                >
                                    {licenseKey}
                                </span>
                            </Row>
                            <Row className='card-row'>
                                <i className='dash-title fa fa-dollar-sign main-heading-color2'/>
                                <span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'
                                >
                                    Credits :
                                </span>
                                <span
                                    style={{paddingLeft: 7}}
                                    className='dash-title main-heading-color'
                                >
                                    {credits}
                                </span>
                            </Row>
                        </Col>
                        <Col className='dashboard-main-container sub-container-background'>
                            <Row className='card-row'>
                                <i className='dash-title fa fa-credit-card main-heading-color2'/>
                                <span
                                    style={{fontSize: 18}}
                                    className='dash-status main-heading-color2'
                                >
                                    Renewal :
                                </span>
                                <span
                                    style={{paddingLeft: 7}}
                                    className='dash-title main-heading-color'
                                >
                                    {expiryDate}
                                </span>
                            </Row>
                            {/*<Row className='vertical-align'>*/}
                                {/*<DefaultButton1 onClick={() => alert("Under construction")} text="Renew" styles={{*/}
                                    {/*margin: '0 auto',*/}
                                    {/*width: undefined,*/}
                                    {/*fontSize: 14,*/}
                                    {/*borderColor: '#C24148',*/}
                                    {/*position: 'relative',*/}
                                    {/*top: -10*/}
                                {/*}}/>*/}
                            {/*</Row>*/}
                            {/*<Row className='vertical-align'>*/}
                            {/*<span className='price-span'>$40/month</span>*/}
                            {/*</Row>*/}
                        </Col>
                    </Row>

                    <Row className='center' style={{marginTop: 10}}>
                        <span className='dash-title main-heading-color2'>Past Checkouts</span>
                    </Row>

                    <Row>
                        <BootstrapTable 
                            keyField='id' 
                            id='checkoutTable'
                            data={recentOrders}
                            columns={this.columns}
                            bordered={false}
                            noDataIndication={"No past checkouts"}
                        />
                    </Row>
                </div>
            </Container>
        );
    }
}
