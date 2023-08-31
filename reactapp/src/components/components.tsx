import React from "react";
import moment from "moment";

import "./styles.css";
import { SiteProps, SiteStatusProps, IPdata, MachineListProps, IP } from "./types";
import { StatusCriticalIcon, StatusOfflineIcon, StatusOnlineIcon } from "../assets/site-status-icons";

const siteColors = {onlineColor: "#0fa958", offlineColor: "#FFC737", criticalColor: "#E55050"};

// this is a component, so it needs to return jsx (component is like a node (godot))
export const Site = ({siteName, IPs}: SiteProps): React.JSX.Element => {   // the variable IPs needs to be an array of IPs (IPs is parameter)
    
    const criticalIPs = IPs.filter((IP) => IP.checkThis && !IP.isOnline);                   //List of all IPs that need to be checked
    const offlineIPs = IPs.filter((IP) => IP.isOnline);                     //List of all Offline IPs
    const onlineIPs = IPs.filter((IP) => !IP.isOnline && !IP.checkThis);    //List of all Online IPs

    const IPdata = {criticalIPs: criticalIPs, offlineIPs: offlineIPs, onlineIPs: onlineIPs};

    const siteStatus = getSiteStatus(IPdata);

    // now for the list
    const machineList = criticalIPs.concat(offlineIPs).slice(0,5)
    machineList.sort((a,b) => a.timeSinceLastPing - b.timeSinceLastPing)

    siteName = siteName.replace(/_/g, " ");
    return (
        <div className="site-card" style={{borderLeft: "5.70px solid " + siteStatus.color}}>
            <span>{siteName}</span>
            <div className="site-card-content">
                <SiteStatus site={siteStatus}/>
                <MachineList machineList={machineList}/>
            </div>
        </div>
    );
}

const MachineListItem = ({machine}: {machine: IP}): React.JSX.Element => {
    return (
        <li className="machine-list-item">
            <span> {machine.ipAddress} </span>
            <div className="timestamp"> {moment(machine.lastPingTime).fromNow()} </div>
        </li>
    );
}

const MachineList = ({machineList}: MachineListProps): React.JSX.Element => {
    return (
        <div className="machine-list">
            <div className="machine-list-title">
                <span>Machine Name</span>
                <span>Last Online</span>
            </div>
            
            <ul className="machine-list-container">
                {machineList.map((m, i) => <MachineListItem machine={m} key={i}/>)}
            </ul>
        </div>
    );
}

const SiteStatus = ({site: {status, color, machinesOnline, machinesOffline, machinesCritical}}: {site: SiteStatusProps}): React.JSX.Element => {
    
    return (
        <div className="site-status-container">
            { (machinesCritical !== (0 || undefined)) 
                ? <div> <StatusCriticalIcon/> <span>{machinesCritical + " Machines critical"}</span> </div>
                : <></>
            }
            { (machinesOffline !== (0 || undefined)) 
                ? <div> <StatusOfflineIcon/> <span>{machinesOffline + " Machines offline"}</span> </div>
                : <></>
            }
            { (machinesOnline !== (0 || undefined)) 
                ? <div> <StatusOnlineIcon/> <span>{machinesOnline + " Machines online"}</span> </div>
                : <></>
            }
        </div>
    );
}

function getSiteStatus({criticalIPs, offlineIPs, onlineIPs}: IPdata): SiteStatusProps {
    let siteStatus: SiteStatusProps = { status: "online", color: ""};

    siteStatus.machinesOnline = onlineIPs.length;

    if (offlineIPs.length > 0) {
        siteStatus.status = "offline";
        siteStatus.machinesOffline = offlineIPs.length;
    }

    if (criticalIPs.length > 0) {
        siteStatus.status = "critical";
        siteStatus.machinesCritical = criticalIPs.length;
    }

    siteStatus.color = siteColors[`${siteStatus.status}Color`];
    return siteStatus;

}