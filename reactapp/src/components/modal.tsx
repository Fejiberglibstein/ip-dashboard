import React from "react";

import "./modal.css";
import { IP, PopupModalProps } from "./types";
import moment from "moment";

export const PopupModal = ({siteName, IPs, setPopupSiteName}: PopupModalProps): React.JSX.Element => {

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


    // What the he will is this Sir

    // function customComparator(a: string, b: string){
     
    //     // Breaking into the octets   
    //     let octetsA = a.split(".");
    //     let octetsB = b.split(".");
         
    //     // Condition if the IP Address
    //     // is same then return 0
    //     if(octetsA == octetsB)
    //         return 0
    //     else if(octetsA[0] > octetsB[0])
    //         return 1
    //     else if(octetsA[0] < octetsB[0])
    //         return -1
    //     else if(octetsA[1] > octetsB[1])
    //         return 1
    //     else if(octetsA[1] < octetsB[1])
    //         return -1
    //     else if(octetsA[2] > octetsB[2])
    //         return 1
    //     else if(octetsA[2] < octetsB[2])
    //         return -1
    //     else if(octetsA[3] > octetsB[3])
    //         return 1
    //     else if(octetsA[3] < octetsB[3])
    //         return -1
     
    // }

    IPs.sort((a,b) => compareIPAddresses(a.ipAddress, b.ipAddress));

    return (
        <div className="modal-background" onClick={() => setPopupSiteName(null)}>
            <div className="popup-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={() => setPopupSiteName(null)}>&times;</span>
                <table>
                    <tr>
                        <th>IP Address</th>
                        <th>Asset Number</th>
                        <th>Machine Name</th>
                        <th>Last Ping Time</th>
                        <th>Time Since Last Ping</th>
                    </tr>
                    {IPs.map(IP => 
                        <tr>
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
