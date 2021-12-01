import React from 'react';
import Toast from 'react-bootstrap/Toast'

export function Toaster({context, showToast = false, message = "", success = true, delay = 5000,loader=false}) {
    if (showToast)
        return (
            <div
                aria-live="polite"
                aria-atomic="true">
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 9999,
                        bottom: 20,
                        right: 20,
                        borderRadius: 5,
                        padding: 10,
                        backgroundColor: '#F18C16'
                    }}>
                    <Toast onClose={() => context.setState({showToast: false})} show={showToast} delay={delay} autohide>
                        <Toast.Body>
                            {!loader ? success ? <img src={require('../images/logo/correct.png')} height={30} alt=""/>
                                : <img src={require('../images/logo/close.png')} height={30} alt=""/>:null}

                            <span style={{fontWeight: 'bold', marginLeft: 5, color: '#000'}}>{message}</span></Toast.Body>
                    </Toast>
                </div>
            </div>
        );
    else
        return null;
}