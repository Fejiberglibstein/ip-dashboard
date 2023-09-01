import moment from 'moment';

//Same class as the one in IP.cs
export interface IP {
    ipAddress: string,
    site: string,
    assetNumber: string,
    machineName: string,
    isOnline?: boolean,
    lastPingTime?: Date,
    currentTime?: Date,
    timeSinceLastPing?: number,
    checkThis?: string
}

// React "needs" the props at the end, this is for component parameters
// it is this way because the siteList in IpTracker.cs is a Dictionary<string, List<IP>>
export interface SiteProps {
    siteName: string,
    IPs: Array<IP>,
    setSite: Function,
    popupSite: Function 
}    

// could do this if a function ever needs to return a string () => string

// dictionary that stores a list of IPs that are in the states outlined below
export interface IPdata {
    criticalIPs: Array<IP>,
    offlineIPs: Array<IP>,
    onlineIPs: Array<IP>
}

// 
export interface SiteStatusProps {
    status: "online" | "offline" | "critical",
    color: string
    machinesOnline?: number,
    machinesOffline?: number,
    machinesCritical?: number
}

export interface MachineListProps {
    machineList: Array<IP>
}

export interface PopupModalProps {
    siteName: string, 
    IPs: Array<IP>,
    setPopupSiteName: React.Dispatch<React.SetStateAction<string | null>>
}