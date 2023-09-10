import React from "react";

import "./modal.css";
import { IP, PopupModalProps } from "../types";
import { PingButton, Timestamp } from "./components"
import { getIPStatus } from "../status-colors";
export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP, setSite}: PopupModalProps): React.JSX.Element => {
    const [form, setForm] = React.useState<IP | null>(null);
    
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

    const insertMachine = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`api/add_machine/${siteName}`, {
                body: JSON.stringify(form),
                method: "POST",
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
            })
            const result = await response.json()
            setSite(siteName, result)
        }
        catch {
            alert("Insert has failed")
        }
    }

    const updateForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value} as IP)
    }
   
    IPs?.sort((a,b) => compareIPAddresses(a.ipAddress, b.ipAddress));

    return (
        <div className={`modal-background`} onClick={() => setPopupSiteName(null)}>
            <div className={`popup-modal-content`} onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={() => setPopupSiteName(null)}>&times;</span>
                <form method="GET" id="my_form" onSubmit={insertMachine}/>
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
                        <tr>
                            <td> <input type="text" name="ipAddress" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td> <input type="text" name="assetNumber" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td> <input type="text" name="machineName" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td colSpan={2}> <input type="submit" form="my_form" value={"Insert New Machine"}/> </td>
                        </tr>
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
