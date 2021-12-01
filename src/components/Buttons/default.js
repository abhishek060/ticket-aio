import React from 'react';
import {Button} from "react-bootstrap";

export const DefaultButton1 = ({onClick,text, styles = {}}) => {
    return (
        <Button onClick={onClick} className="button1" style={styles}>{text}</Button>
    )
};

export const DefaultButton2 = ({onClick,text, styles = {}}) => {
    return (
        <Button onClick={onClick} className="button2" style={styles}>{text}</Button>
    )
};
