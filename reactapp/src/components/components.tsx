import React from "react";

import "./styles.css";
import { SiteProps, SiteStatusProps, IPdata } from "./types";
import { StatusCritcalIcon, StatusOfflineIcon, StatusOnlineIcon } from "../assets/site-status-icons";

const siteColors = {onlineColor: "#0fa958", offlineColor: "#FFC737", criticalColor: "#E55050"};

// this is a component, so it needs to return jsx (component is like a node (godot))
export const Site = ({siteName, IPs}: SiteProps): React.JSX.Element => {   // the variable IPs needs to be an array of IPs (IPs is parameter)
    
    const criticalIPs = IPs.filter((IP) => IP.checkThis);                   //List of all IPs that need to be checked
    const offlineIPs = IPs.filter((IP) => IP.isOnline);                     //List of all Offline IPs
    const onlineIPs = IPs.filter((IP) => !IP.isOnline && !IP.checkThis);    //List of all Online IPs

    const IPdata = {criticalIPs: criticalIPs, offlineIPs: offlineIPs, onlineIPs: onlineIPs};

    const siteStatus = getSiteStatus(IPdata);

    siteName = siteName.replace(/_/g, " ");
    return (
        <div className="site-card" style={{borderLeft: "5.70px solid " + siteStatus.color}}>
            <span>{siteName}</span>
            <div className="site-card-content">
                <SiteStatus site={siteStatus}/>
            </div>
        </div>
    );
}

const SiteStatus = ({site: {status,  color, machinesOnline, machinesOffline, machinesCritical}}: {site: SiteStatusProps}): React.JSX.Element => {
    
    return (
        <div className="site-status-container">
            { (machinesOnline !== (0 || undefined)) 
                ? <> <StatusOnlineIcon/> <span>{machinesOnline + " Machines Online"}</span> </>
                : <></>
            }
            { (machinesOffline !== (0 || undefined)) ? <span>{machinesOffline + " Machines Offline"}</span> : <></> }
            { (machinesCritical !== (0 || undefined)) ? <span>{machinesCritical + " Machines Offline for 5+ days"}</span> : <></> }
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