import { IPStatus, IPdata, SiteStatusProps, IP} from "./types";

const siteColors = {onlineColor: "#0fa958", offlineColor: "#FFC737", criticalColor: "#E55050"};

export function getSiteStatus( IPs: Array<IP> ): SiteStatusProps {
    let siteStatus: SiteStatusProps = { status: "online", color: ""};

    const criticalIPs = IPs.filter((IP) => IP.checkThis && !IP.isOnline);                   //List of all IPs that need to be checked
    const offlineIPs = IPs.filter((IP) => !IP.isOnline && !IP.checkThis);                   //List of all Offline IPs
    const onlineIPs = IPs.filter((IP) => IP.isOnline && !IP.checkThis);                     //List of all Online IPs

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

export function getIPStatus(IP: IP): IPStatus {
    let ipStatus: IPStatus = { status: "online", color: ""}
    if(!IP.isOnline) 
        ipStatus.status = "offline"
    if(IP.checkThis) 
        ipStatus.status = "critical"

    ipStatus.color = siteColors[`${ipStatus.status}Color`];
    return ipStatus

}