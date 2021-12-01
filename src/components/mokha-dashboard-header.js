import React from 'react';
import * as Color from "../common/colors";

const DashboardHeader = () => {
    return (
        <div className="custom-footer text-center">
            <span style={{color: Color.PRIMARY_COLOR, fontSize: 18, fontWeight: 700}}>AIO <label
                style={{color: Color.SECONDARY_COLOR}}>Dashboard</label></span>
        </div>
    )
};

export default DashboardHeader;
