import React from "react";

import "./modal.css";
import { IP, PopupModalProps } from "./types";
import moment from "moment";

export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName}: PopupModalProps): React.JSX.Element => {
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
                    <tr>
                        <th>IP Address</th>
                        <th>Asset Number</th>
                        <th>Machine Name</th>
                        <th>Last Ping Time</th>
                        <th>Time Since Last Ping</th>
                    </tr>
                    {IPs.map((IP, i) => 
                        <tr key={i}>
                            <td>{IP.ipAddress}</td>
                            <td>{IP.assetNumber}</td>
                            <td>{IP.machineName}</td>
                            <td>{moment(IP.lastPingTime).format("dddd, MMMM D, h:mm A")}</td>
                            {/* <td><Timestamp time={IP.lastPingTime}/></td> */}
                            <td>{moment(IP.lastPingTime).fromNow()}</td>
                        </tr>
                    )}
                </table>
            </div>
        </div>
    );
}
