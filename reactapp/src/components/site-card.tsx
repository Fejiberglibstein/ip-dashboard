import React from "react";

import "./site-card.css";
import { SiteProps, SiteStatusProps, IPdata, MachineListProps, IP } from "./types";
import { CriticalIcon, StatusCriticalIcon, StatusOfflineIcon, StatusOnlineIcon, PingIcon } from "../assets/icons";
import { TimeStamp, BufferingIcon } from "./components";

const siteColors = {onlineColor: "#0fa958", offlineColor: "#FFC737", criticalColor: "#E55050"};

// this is a component, so it needs to return jsx (component is like a node (godot))
export const Site = ({siteName, IPs, setSite}: SiteProps): React.JSX.Element => {   // the variable IPs needs to be an array of IPs (IPs is parameter)
    
    const criticalIPs = IPs.filter((IP) => IP.checkThis && !IP.isOnline);                   //List of all IPs that need to be checked
    const offlineIPs = IPs.filter((IP) => !IP.isOnline && !IP.checkThis);                     //List of all Offline IPs
    const onlineIPs = IPs.filter((IP) => IP.isOnline && !IP.checkThis);    //List of all Online IPs

    const IPdata = {criticalIPs: criticalIPs, offlineIPs: offlineIPs, onlineIPs: onlineIPs};

    const siteStatus = getSiteStatus(IPdata);

    // now for the list
    const machineList = criticalIPs.concat(offlineIPs).slice(0,5)
    machineList.sort((a,b) => b.timeSinceLastPing - a.timeSinceLastPing)

    return (
        <div className="site-card" style={{borderLeft: "5.70px solid " + siteStatus.color}}>
            <span>{siteName.replace(/_/g, " ")}</span>
            <div className="site-card-content">
                <SiteStatus site={siteStatus}/>
                <MachineList machineList={machineList}/>
                <PingSitesButton setSite={setSite} siteName={siteName}/>
            </div>
        </div>
    );
}

const PingSitesButton = ({setSite, siteName}: {setSite: Function, siteName: string}) => {
    // clicked is going to equal one of the states that is defined in setClicked (it is a getter and setter in the [])
    const [clicked, setClicked] = React.useState<boolean>(false)
    const pingSite = async () => {
        setClicked(true)
        try {
            const response = await fetch(`/api/ping_site/${siteName}`)
            const result = await response.json()
            setSite(siteName, result)
        }
        finally {
            setClicked(false)
        }
    }
    return (
        <button className={"ping-button" + (clicked ? " loading" : "")} onClick={pingSite}>{(!clicked) ? <PingIcon/> : <div style={{position: "relative", width: "10px", marginRight: "4px"}}> <BufferingIcon/> </div>} {(!clicked) ? "Ping Site" : "Pinging"}</button>
    );
}

const SiteStatus = ({site: {status, color, machinesOnline, machinesOffline, machinesCritical}}: {site: SiteStatusProps}): React.JSX.Element => {
    
    return (
        <div className="site-status-container">
            { (machinesCritical !== (0 || undefined)) 
                ? <div> <StatusCriticalIcon/> <span>{machinesCritical + ((machinesCritical == 1) ? " Machine critical" : " Machines critical")}</span> </div>
                : <></>
            }
            { (machinesOffline !== (0 || undefined)) 
                ? <div> <StatusOfflineIcon/> <span> {machinesOffline + ((machinesOffline == 1) ? " Machine offline" : " Machines offline")}</span> </div>
                : <></>
            }
            { (machinesOnline !== (0 || undefined)) 
                ? <div> <StatusOnlineIcon/> <span>{machinesOnline + ((machinesOnline == 1) ? " Machine online" : " Machines online")}</span> </div>
                : <></>
            }
        </div>
    );
}

const MachineList = ({machineList}: MachineListProps): React.JSX.Element => {
    return (
        <div className="machine-list">
            {/* <span style={{fontSize: "14px", padding: "2px"}}>Machines Offline</span> */}
            <div className="machine-list-title">
                <span>Machine Name</span>
                <span>Last Online</span>
            </div>
            
            <ul className="machine-list-container">
                { (machineList.length == 0)
                    ? <li className="machine-list-item" style={{justifyContent: "center", borderRadius: "8px"}}> <span>All machines are online</span> </li>
                    : machineList.map((m, i) => <MachineListItem machine={m} key={i} id={i} totalMachines={machineList.length}/>)
                }
            </ul>
        </div>
    );
}

const MachineListItem = ({machine, id, totalMachines}: {machine: IP, id: number, totalMachines: number}): React.JSX.Element => {
    return (
        <li 
            className={"machine-list-item"}
            style={{
                background: (id % 2 == 0) ? "#363A42" : "#27292E",
                borderRadius: ((id == 0) ? "8px 8px " : "2px 2px ") +           // If it's the first component round the top corners
                              ((id == totalMachines-1) ? "8px 8px" : "2px 2px")   // If it's the last component round the bottom corners
            }}
        >
            {machine.checkThis ? <CriticalIcon style={{position: "absolute", left: "-20px"}}/> : <></>}
            <span> {machine.ipAddress} </span>
            <TimeStamp time={machine.lastPingTime}/> 
        </li>
    );
}


function getSiteStatus({criticalIPs, offlineIPs, onlineIPs}: IPdata): SiteStatusProps {
    let siteStatus: SiteStatusProps = { status: "online", color: ""};

    if (onlineIPs.length > 0) {
        siteStatus.machinesOnline = onlineIPs.length;
    }

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