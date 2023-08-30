
//Same class as the one in IP.cs
export interface IP {
    ipAddress: string,
    site : string,
    assetNumber?: string,
    machineName : string,
    isOnline? : boolean,
    lastPingTime? : Date,
    currentTime? : Date,
    timeSinceLastPing? : number,
    checkThis?: string
}

export interface SiteProps {
    siteName: string,
    IPs: Array<IP>
}

export interface IPdata {
    criticalIPs: Array<IP>,
    offlineIPs: Array<IP>,
    onlineIPs: Array<IP>
}

export interface SiteStatusProps {
    status: "online" | "offline" | "critical",
    color: string
    machinesOnline?: number,
    machinesOffline?: number,
    machinesCritical?: number
}