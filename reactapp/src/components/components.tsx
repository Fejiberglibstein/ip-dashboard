import React, { HTMLAttributes } from "react";
import moment from "moment";

import { PingButtonProps, TimestampProps, IP } from "../types";
import { PingIcon } from "../assets/icons";
import "./components.css"

export const Timestamp = (props: TimestampProps ) => {
    return (
        <div {...props} className="timestamp">{moment(props.time).fromNow()}
            <Tooltip>{moment(props.time).format("dddd, MMMM D YYYY, h:mm A")}</Tooltip>
        </div>
    );
}

export const BufferingIcon = () => {
    return (
        <div className="buffering-icon"></div>
    );
}

export function PingButton<T extends IP | string>(props: PingButtonProps<T>) {
    // clicked is going to equal one of the states that is defined in setClicked (it is a getter and setter in the [])
    const { update, apiPath } = props

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
        <button className={"ping-button" + (clicked ? " loading" : "")} onClick={(e) => pingSite(e)} {...props}>
            {(!clicked) 
                ? <PingIcon/>
                : <BufferingIcon/>
            }
            {(!clicked) ? props.children : "Pinging"}
        </button>
    );
}

export const Tooltip = (props: React.BaseHTMLAttributes<HTMLSpanElement>) => {
    return <div className="tooltiptext" {...props} >{props.children}</div>
}