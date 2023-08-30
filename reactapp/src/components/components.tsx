import React from "react"
import "./styles.css"

// this connects with the siteList list in Program.cs
export interface IP {
    IpAddress: string,
    Site : string,
    AssetNumber?: string,
    MachineName : string,
    IsOnline? : boolean,
    LastPingTime? : Date,
    CurrentTime? : Date,
    TimeSinceLastPing? : number,
    CheckThis?: string
}

// this is a component, so it needs to return jsx (component is like a node (godot))
export const Site = ({IPs}: {IPs: Array<IP>}) => {      // the variable sites needs to be an array of IPs (sites is parameter)
    return (
        <div className="site-card">
            <span>Hi</span>
        </div>
    )
}