import React, { useEffect, useRef } from "react";

import "./modal.css";
import { IP, PopupModalProps } from "../types";
import { PingButton, Timestamp } from "./components"
import { getIPStatus } from "../status-colors";
import { CriticalIcon, StatusCriticalIcon } from "../assets/icons";
export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP}: PopupModalProps): React.JSX.Element => {
    let criticalMachineLookup = IPs?.filter((IP) => IP.checkThis)    // List of the critical machines
    const criticalMachinesRef = useRef<Map<number, HTMLTableRowElement> | null>(null)    // List of all table elements that are critical    

    function getCriticalMachines() {
        if (!criticalMachinesRef.current) {
            // Initialize the Map on first usage.
            criticalMachinesRef.current = new Map();
        }
          return criticalMachinesRef.current;
    }

    useEffect(() => {
        console.log("dkdk", criticalMachinesRef)
    }, [IPs])

    if (!enabled) {
        return (
            <div className={`modal-background disabled`}>
                <div className={`popup-modal-content disabled`}></div>
            </div>
        )
    }
    // console.log(criticalMachineElements)

    function compareIPAddresses(a, b) {
        const numA = Number(
          a.split('.')
            .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
            .reduce((a, v) => ((a += v), a), 0)
        );
        const numB = Number(
          b.split('.')
            .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
            .reduce((a, v) => ((a += v), a), 0)
        );
        return numA - numB;
    }


   
    IPs?.sort((a,b) => compareIPAddresses(a.ipAddress, b.ipAddress));

    return (
        <div className={`modal-background`} onClick={() => setPopupSiteName(null)}>
            <div className={`popup-modal-content`} onClick={(e) => e.stopPropagation()}>
				{new Array(getCriticalMachines()?.keys()).map((node) =>
					<StatusCriticalIcon className="sticky-offline"/>
				)}
                <span className="close" onClick={() => setPopupSiteName(null)}>&times;</span>
                <table>
                    <thead>
                        <tr>
                            <th>IP Address</th>
                            <th>Asset Number</th>
                            <th>Machine Name</th>
                            <th>Time Since Last Ping</th>
                            <th>Ping IP</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {IPs.map((IP, i) => 
                            <tr 
                                ref={(node) => {
									const map = getCriticalMachines();
									if (!criticalMachineLookup) return null
                                    if (getIPStatus(IP).status == "critical" && node) {
                                        map.set(criticalMachineLookup.indexOf(IP), node)
                                    }
									else {
										map.delete(criticalMachineLookup.indexOf(IP))
									}
                                    return null
                                }}
                                key={i} style={{"--status-color": getIPStatus(IP).color} as React.CSSProperties}
                            >
                                <td>{IP.ipAddress}</td>
                                <td>{IP.assetNumber}</td>
                                <td>{IP.machineName}</td>
                                <td><Timestamp style={{fontSize: "14px"}} time={IP.lastPingTime !== undefined ? IP.lastPingTime : new Date(0)}/></td>
                                <td><PingButton
                                    update={(response) => setIP(IP.site, response as IP)}
                                    apiPath={`ping_machine/${siteName}/${IP.ipAddress}`}
                                >Ping IP</PingButton></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

