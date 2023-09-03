import React, { HTMLAttributes } from "react";
import moment from "moment";

import { PingButtonProps, TimestampProps, IP } from "../types";
import { PingIcon } from "../assets/icons";
import "./components.css"

export const Timestamp = (props: TimestampProps ) => {
    return (
        <div {...props} className="tooltip timestamp">{moment(props.time).fromNow()}
            <span className="tooltiptext">{moment(props.time).format("dddd, MMMM D YYYY, h:mm A")}</span>
        </div>
    );
}

export const BufferingIcon = () => {
    return (
        <div className="buffering-icon"></div>
    );
}

export function PingButton<T extends IP | string>({update, apiPath, children}: PingButtonProps<T>) {
    // clicked is going to equal one of the states that is defined in setClicked (it is a getter and setter in the [])
    const [clicked, setClicked] = React.useState<boolean>(false)
    const pingSite = async (e) => {
        e.stopPropagation()
        setClicked(true)
        try {
            const response = await fetch(`api/${apiPath}`)
            const result = await response.json()
            update(result)
        }
        finally {
            setClicked(false)
        }
    }
    return (
        <button className={"ping-button" + (clicked ? " loading" : "")} onClick={(e) => pingSite(e)}>
            {(!clicked) 
                ? <PingIcon/>
                : <div style={{position: "relative", width: "10px", marginRight: "4px"}}> <BufferingIcon/> </div>
            }
            {(!clicked) ? children : "Pinging"}
        </button>
    );
}