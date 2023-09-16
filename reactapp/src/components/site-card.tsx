import React from "react";
import { Icon } from '@iconify/react';

import "./site-card.css";
import { SiteProps, SiteStatusProps, MachineListProps, IP } from "../types";

import { Timestamp, PingButton } from "./components";
import { getSiteStatus } from "../status-colors";


// this is a component, so it needs to return jsx (component is like a node (godot))
export const Site = ({siteName, IPs, setSite, popupSite}: SiteProps): React.JSX.Element => {   // the variable IPs needs to be an array of IPs (IPs is parameter)


    const siteStatus: SiteStatusProps = getSiteStatus(IPs);

    // now for the list
    const machineList = IPs.filter(c => !c.isOnline).sort((a, b) => (a.timeSinceLastPing && b.timeSinceLastPing) ? b.timeSinceLastPing - a.timeSinceLastPing : 0).slice(0,5)
    machineList.sort((a,b) => {
        if ( a.timeSinceLastPing !== undefined &&  b.timeSinceLastPing !== undefined) 
            return b.timeSinceLastPing - a.timeSinceLastPing 
        else
            return 0
    });
   

    return (
        <div className="site-card" style={{borderLeft: "5.70px solid " + siteStatus.color}}>
            <span>{siteName.replace(/_/g, " ")}</span>
            <div className="site-card-content" onClick={() => popupSite(siteName)}>
                <SiteStatus {...siteStatus} />
                <MachineList machineList={machineList}/>
                <PingButton
                    update={(response) => setSite(siteName, response)}
                    apiPath={`ping_site/${siteName}`}
                    style={{ position: "absolute", right: "0px", bottom: "0px" }}
                >Ping Site</PingButton>
            </div>
        </div>
    );
}


export const SiteStatus = (site: SiteStatusProps): React.JSX.Element => {

    const {machinesOnline, machinesOffline, machinesCritical, ...props} = site
    return (
        <div {...props} className="site-status-container">
            { (machinesCritical !== (0 || undefined)) 
                ? <div> <Icon icon="tabler:circle-x-filled" color="#e55050" width="24" height="24" /> <span>{machinesCritical + ((machinesCritical == 1) ? " Machine critical" : " Machines critical")}</span> </div>
                : <></>
            }
            { (machinesOffline !== (0 || undefined)) 
                ? <div> <Icon icon="tabler:alert-circle-filled" color="#ffc737" width="24" height="24"/>  <span> {machinesOffline + ((machinesOffline == 1) ? " Machine offline" : " Machines offline")}</span> </div>
                : <></>
            }
            { (machinesOnline !== (0 || undefined)) 
                ? <div> <Icon icon="tabler:circle-check-filled" color="#0fa958" width="24" height="24" /> <span>{machinesOnline + ((machinesOnline == 1) ? " Machine online" : " Machines online")}</span> </div>
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
                borderRadius: ((id == 0) ? "8px 8px " : "2px 2px ") +           // If it's the first component round the top corners
                              ((id == totalMachines-1) ? "8px 8px" : "2px 2px")   // If it's the last component round the bottom corners
            }}
        >
            {machine.checkThis ? <Icon icon="uil:exclamation" color="#e55050" width="24" height="24" style={{position: "absolute", left: "-20px"}}/> : <></>}
            <span> {machine.ipAddress} </span>
            <Timestamp time={machine.lastPingTime != undefined ? machine.lastPingTime : new Date(0)}/> 
        </li>
    );
}


