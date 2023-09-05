import React from "react";

import "./modal.css";
import { IP, PopupModalProps } from "../types";
import { PingButton, Timestamp } from "./components"
import { getIPStatus } from "../status-colors";
export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP}: PopupModalProps): React.JSX.Element => {
    if (!enabled) {
        return (
            <div className={`modal-background disabled`}>
                <div className={`popup-modal-content disabled`}></div>
            </div>
        )
    }

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
                            <tr key={i} style={{"--status-color": getIPStatus(IP).color} as React.CSSProperties}>
                                <td>{IP.ipAddress}</td>
                                <td>{IP.assetNumber}</td>
                                <td>{IP.machineName}</td>
                                <td><Timestamp style={{fontSize: "14px"}} time={IP.lastPingTime !== undefined ? IP.lastPingTime : new Date(0)}/></td>
                                <td><PingButton
                                    update={(response) => setIP(siteName, response as IP)}
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
