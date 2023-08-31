import React from "react";
import moment from "moment";
import "./components.css"

export const TimeStamp = ({time}: {time: Date}) => {
    return (
        <div className="tooltip timestamp">{moment(time).fromNow()}
            <span className="tooltiptext">{moment(time).format("dddd, MMMM D YYYY, h:mm A")}</span>
        </div>
    );
}