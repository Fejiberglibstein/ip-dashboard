import React, { HTMLAttributes } from "react";
import { Icon } from '@iconify/react';
import moment from "moment";

import { PingButtonProps, TimestampProps, IP } from "../types";
import "./components.css"

export const Timestamp = (props: TimestampProps ) => {
    return (
        <div {...props} className="timestamp">{moment(props.time).fromNow()}
            <Tooltip>{moment(props.time).format("dddd, MMMM D YYYY, h:mm A")}</Tooltip>
        </div>
    );
}

export const BufferingIcon = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props} className="buffering-icon"></div>
    );
}

export function PingButton<T extends IP | string>(props: PingButtonProps<T>) {
    // clicked is going to equal one of the states that is defined in setClicked (it is a getter and setter in the [])
    const { update, apiPath, ...passProps} = props

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
        <button className={"ping-button" + (clicked ? " loading" : "")} onClick={(e) => pingSite(e)} {...passProps as HTMLAttributes<HTMLButtonElement>}>
            {(!clicked) 
                ? <Icon icon="tabler:wifi" color="#a4a4a4" width="16" height="16" />
                : <BufferingIcon/>
            }
            {(!clicked) ? props.children : "Pinging"}
        </button>
    );
}

export const Tooltip = (props: React.BaseHTMLAttributes<HTMLSpanElement>) => {
    return <div className="tooltiptext" {...props} >{props.children}</div>
}