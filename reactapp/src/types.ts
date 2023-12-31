import { HTMLAttributes } from "react"

//Same class as the one in IP.cs
export interface IP {
    ipAddress: string,
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
export interface SiteStatusProps extends HTMLAttributes<HTMLElement> {
    status?: "online" | "offline" | "critical",
    color?: string,
    machinesOnline?: number,
    machinesOffline?: number,
    machinesCritical?: number,
    childStyle?: React.CSSProperties
}

export interface IPStatus {
    status: "online" | "offline" | "critical",
    color: string

}

export interface MachineListProps {
    machineList: Array<IP>
}


// This is a discriminated union type; when enabled is true we require all 
// the other params but when it's false we don't care about the other values
export type PopupModalProps =
    {
        enabled: true;
        siteName: string, 
        IPs: Array<IP>,
        setPopupSiteName: React.Dispatch<React.SetStateAction<string | null>>,
        setIP: (siteName: string, IP: IP) => void,
        setSite: Function
    } | {
        enabled: false
        siteName?: null,
        IPs?: null,
        setPopupSiteName?: null
        setIP?: null
        setSite?: Function
    }

export interface TimestampProps extends HTMLAttributes<HTMLElement> {
    time: Date
}

export interface PingButtonProps<T extends IP | String> extends HTMLAttributes<HTMLElement> {
    update: (arg1: T) => void,
    apiPath: string
}

export type FormProps = {
    IP: IP,
    updateForm: (Event) => void,
    setForm: React.Dispatch<React.SetStateAction<IP | null>>,
    setFormIndex: React.Dispatch<React.SetStateAction<number | "add" | null>>
    formIndex: number | "add" | null,
    onAddMachine: Function,
}

export type BannerProps = {
    sites: { [id: string] : Array<IP> }
}