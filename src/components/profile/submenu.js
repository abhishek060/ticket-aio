import React from 'react';
import CSVReader from "react-csv-reader";
import {DefaultButton1,DefaultButton2} from "../Buttons/default";
import Apis from "../../utils/api";
import './index.css'

const Constant = require('../../common/constants');

export default class TaskSubMenu extends React.Component {

    createBulkProfile(dataObj) {
        let accessToken = this.state.loginUserObj.accessToken;

        let context = this;
        try {
            this.setState({
                apiMessage: "Creating profile Please wait...",
                bulkUploadLoader: true,
                showToast: true
            });
            Apis.HttpPostRequest(Constant.BASE_URL + Constant.API_ENDPOINTS.PROFILE + Constant.API_ENDPOINTS.ADD_BULK_PROFILE + "?access_token=" + accessToken, {profiles: dataObj}).then(function (res) {
                if (res.error) {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        bulkUploadLoader: false
                    })
                }
                else if (res.status === 200) {
                    if (res.data.success) {
                        context.fetchProfileData(context.state.loginUserObj);
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: true,
                            showToast: true,
                            bulkUploadLoader: false
                        })
                    } else {
                        context.setState({
                            apiMessage: res.data.msg,
                            successResponse: false,
                            showToast: true,
                            bulkUploadLoader: false
                        })
                    }
                } else {
                    context.setState({
                        apiMessage: "Some error has occured",
                        successResponse: false,
                        showToast: true,
                        bulkUploadLoader: false
                    })
                }
            });
        } catch (e) {
            context.setState({
                apiMessage: "Some error has occured",
                successResponse: false,
                showToast: true,
                bulkUploadLoader: false
            })
        }
    }

    handleBulkUpload = (data) => {
        let dataObj = [];
        data.map((jsonObj) => {
            dataObj.push({
                "firstName": jsonObj['FIRST NAME'],
                "lastName": jsonObj['LAST NAME'],
                country: {
                    isocode: "US",
                    name: 'United States'
                },
                region: {
                    countryIso: 'US',
                    isocode: 'US-' + jsonObj['STATE CODE'],
                    isocodeShort: jsonObj['STATE CODE'],
                    name: jsonObj['STATE NAME'],
                },
                "line1": jsonObj['ADDRESS LINE 1'],
                "line2": jsonObj['ADDRESS LINE 2'],
                "postalCode": jsonObj['ZIP'],
                "town": jsonObj['CITY'],
                "phone": jsonObj['PHONE NUMBER'],
                "email": jsonObj['EMAIL'],
                "profile_name": jsonObj['PROFILE NAME'],
                billing: {
                    "firstName": jsonObj['FIRST NAME'],
                    "lastName": jsonObj['LAST NAME'],
                    country: {
                        isocode: "US",
                        name: 'United States'
                    },
                    region: {
                        countryIso: 'US',
                        isocode: 'US-' + jsonObj['STATE CODE'],
                        isocodeShort: jsonObj['STATE CODE'],
                        name: jsonObj['STATE NAME'],
                    },
                    "line1": jsonObj['ADDRESS LINE 1'],
                    "line2": jsonObj['ADDRESS LINE 2'],
                    "postalCode": jsonObj['ZIP'],
                    "town": jsonObj['CITY'],
                    "phone": jsonObj['PHONE NUMBER'],
                    "email": jsonObj['EMAIL'],
                },
                card: {
                    number: jsonObj['CARD NUMBER'],
                    month: jsonObj['EXPIRY MONTH'],
                    year: jsonObj['EXPIRY YEAR'],
                    cvv: jsonObj['CVV'],
                    cardHolderName: jsonObj['CARD HOLDER NAME']
                }                
            });
            return dataObj;
        });
        this.createBulkProfile(dataObj);
    }

    papaParseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    render() {
        return (
            <div style={{marginLeft: 10}}>
                <div className="profile-submenu">
                    <span className='main-heading-color'>Profiles</span>
                </div>

                <div className="profile-manger-btns">
                    <ul>
                        <li className='create-btn'>
                            <DefaultButton1 
                                onClick={this.props.openProfileModal} 
                                text="Create Profile" 
                                styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#DBDBDB'}}
                            />
                        </li>
                        <li className='create-btn'>
                            <CSVReader
                                onFileLoaded={this.handleBulkUpload}
                                parserOptions={this.papaParseOptions}
                            />
                            <label for="react-csv-reader-input">Bulk Upload</label>
                        </li>
                        <li className='delete-btn'>
                            <DefaultButton2 
                                onClick={this.props.onDeleteAllProfile} 
                                text="Delete All" 
                                styles={{margin:'0 auto',width:undefined,fontSize:14,borderColor:'#CA7653'}}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
};
