import React from 'react';
import {Modal} from 'react-bootstrap';
// const createCsvWriter = window.require('csv-writer').createObjectCsvWriter;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvFilePath = 'task.csv';
// const csv = window.require('csvtojson');
const csv = require('csvtojson');

class AddTaskModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            site: "",
            link: "",
            keywords: "",
            proxy: "",
            mode: "",
            size: "",
            quantity: 2,
            billingProfile: "",
            previousCsvData: [],
            show: true
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async componentWillMount() {
        await this.fetchPreviousDataFromCsv();
        console.log(this.props);
    }

    async fetchPreviousDataFromCsv() {
        await csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                for (let index = 0; index < jsonObj.length; index++) {
                    jsonObj[index].site = jsonObj[index][0];
                    jsonObj[index].size = jsonObj[index][1];
                    jsonObj[index].keywords = jsonObj[index][2];
                    jsonObj[index].billingProfile = jsonObj[index][3];
                    jsonObj[index].status = jsonObj[index][4];
                    delete jsonObj[index][0];
                    delete jsonObj[index][1];
                    delete jsonObj[index][2];
                    delete jsonObj[index][3];
                    delete jsonObj[index][4];
                }
                this.setState({previousCsvData: jsonObj});
            })
    };

    submitForm(e) {
        e.preventDefault();
        const {site, keywords, size, billingProfile} = this.state;

        // Csv schema
        const csvWriter = createCsvWriter({
            path: 'task.csv',
            header: [
                {id: 'site', title: '0'},
                {id: 'size', title: '1'},
                {id: 'keywords', title: '2'},
                {id: 'billingProfile', title: '3'},
                {id: 'status', title: '4'},
                {id: 'id', title: 'id'}
            ]
        });
        // Csv data
        this.state.previousCsvData.push({
            site: site, //store
            size: size, //size
            keywords: keywords, //keywords
            billingProfile: billingProfile, //billiing profile
            status: "Success", //status
            id: new Date().getTime() //status
        });

        csvWriter.writeRecords(this.state.previousCsvData)       // returns a promise
            .then(() => {
                console.log('...Done');
            }).catch((e) => {
            console.log("Some error occured while writing data in CSV" + e.message);
        });
    };

    render() {
        return (
            <Modal
                onEnter={() => {
                    this.fetchPreviousDataFromCsv()
                }}
                show={this.state.show}
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <form onSubmit={(e) => {
                    this.submitForm(e)
                }}>
                    <Modal.Body>

                        <div class="grid-container-modal">
                            <div class="modalTop">
                                <div class="modalTopA">
                                    <h3>Create Tasks</h3>
                                </div>
                                <div class="modalTopB">
                                    <i class="far fa-times close hvr-shrink"></i>
                                </div>
                            </div>
                            <div class="modalBott">
                                <div class="modalBottLeft">
                                    <div class="modalBottLeft1">
                                        <div class="dropdownXL">
                                            <select onChange={(e) => {
                                                this.handleInputChange(e)
                                            }} value={this.state.site}
                                                    name="site" class="dropdown-select">
                                                <option value="">Select Site</option>
                                                <option value="Kith">Kith</option>
                                                <option value="Bodega">Bodega</option>
                                                <option value="DSMNY E-Flash">DSMNY E-Flash</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="modalBottLeft2">
                                        <input onChange={(e) => {
                                            this.handleInputChange(e)
                                        }} value={this.state.link} name="link"
                                               class="modal-input"
                                               placeholder="Link"/>
                                    </div>
                                    <div class="modalBottLeft3">
                                        <input onChange={(e) => {
                                            this.handleInputChange(e)
                                        }} value={this.state.keywords}
                                               name="keywords" class="modal-input"
                                               placeholder="Keywords"/>
                                    </div>
                                    <div class="modalBottLeft4">
                                        <div class="dropdown">
                                            <select onChange={(e) => {
                                                this.handleInputChange(e)
                                            }} value={this.state.proxy}
                                                    name="proxy" class="dropdown-select">
                                                <option value="">No Proxy</option>
                                                <option value="Option #1">Option #1</option>
                                                <option value="Option #2">Option #2</option>
                                                <option value="Option #3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="modalBottLeft5">
                                        <div class="modalBottLeft5A">
                                            <label class="cov-radio">
                                                <input type="checkbox" name="advance" checked="true"/>
                                                <span class="checkmark"></span>
                                                Advance
                                            </label>
                                        </div>
                                        <div class="modalBottLeft5B">
                                            <label class="cov-radio">
                                                <input type="checkbox" name="login"/>
                                                <span class="checkmark"></span>
                                                Require Login
                                            </label>
                                        </div>
                                        <div class="modalBottLeft5C">
                                            <label class="cov-radio">
                                                <input type="checkbox" name="schedule"/>
                                                <span class="checkmark"></span>
                                                Schedule Task
                                            </label>
                                        </div>
                                        <div class="modalBottLeft5D">
                                            <label class="cov-radio">
                                                <input type="checkbox" name="force"/>
                                                <span class="checkmark"></span>
                                                Force Captcha
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="modalBottRight">
                                    <div class="modalBottRight1">
                                        <div class="dropdown">
                                            <select onChange={(e) => {
                                                this.handleInputChange(e)
                                            }} value={this.state.mode}
                                                    name="mode" class="dropdown-select">
                                                <option value="">Mode</option>
                                                <option value="Option #1">Option #1</option>
                                                <option value="Option #2">Option #2</option>
                                                <option value="Option #3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="modalBottRight2">
                                        <input class="modal-input size" value={this.state.size} name="size"
                                               onChange={(e) => {
                                                   this.handleInputChange(e)
                                               }} placeholder="Size"/>
                                    </div>
                                    <div class="modalBottRight3">
                                        <div class="QtyInputDiv">
                                            <span>Task Amount</span>
                                            <div class="number-input">
                                                <button
                                                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()"></button>
                                                <input onChange={(e) => {
                                                    this.handleInputChange(e)
                                                }} value={this.state.quantity}
                                                       class="quantity" min="1"
                                                       name="quantity" value="1"
                                                       type="number"/>
                                                <button
                                                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
                                                    class="plus"></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modalBottRight4">
                                        <div class="dropdown">
                                            <select onChange={(e) => {
                                                this.handleInputChange(e)
                                            }} value={this.state.billingProfile}
                                                    name="billingProfile"
                                                    class="dropdown-select">
                                                <option value="">Billing Profile</option>
                                                <option value="Option #1">Option #1</option>
                                                <option value="Option #2">Option #2</option>
                                                <option value="Option #3">Option #3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="modalBottRight5">
                                        {/*<a href="#" class="modalBlueBtn hvr-shrink">Create*/}
                                        {/*Task</a>*/}
                                        <input value="Create Task" class="modalBlueBtn hvr-shrink" type="submit"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                </form>
            </Modal>
        )
    }
};

export default AddTaskModal;
