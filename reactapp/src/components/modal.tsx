import React, { useEffect, useRef } from "react";

import "./modal.css";
import { IP, PopupModalProps } from "../types";
import { PingButton, Timestamp, Tooltip } from "./components"
import { getIPStatus } from "../status-colors";
import { CriticalStickyIcon } from "../assets/icons";
export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP, setSite}: PopupModalProps): React.JSX.Element => {
	
	// List of the critical machines
    let criticalMachineLookup = IPs?.filter((IP) => IP.checkThis) 
    const criticalIconRefs = useRef<Array<HTMLDivElement>>(Array(0))        // List of all the icons on the side
    const criticalRowRefs =  useRef<Array<HTMLTableRowElement>>(Array(0))   // List of all table rows that are critical
	const modalContentRef =  useRef<HTMLDivElement | null>(null)            // The modal
	criticalIconRefs.current = []
	criticalRowRefs.current = []

    const [form, setForm] = React.useState<IP | null>(null);
    
    if (!enabled) {
        return (
            <div className={`modal-background disabled`}>
                <div className={`popup-modal-content disabled`}></div>
            </div>
        )
    }

	function handleScroll() {
		if (modalContentRef.current) {
			const iconHeight = 35;    // Height of the icon
			const scrollMargin = 10;  // Margin from the top/bottom of the screen

			// Top and bottom of the viewport/modal. The 65 subtracted on scrollBottom is 
			// an arbitrary number I got from guess and check to match the margin on the top
			const scrollTop = modalContentRef.current.scrollTop + scrollMargin;
			const scrollBottom = modalContentRef.current.scrollTop + modalContentRef.current.clientHeight - scrollMargin - 80;
			
			// Cache the amount of icons that are offscreen
			let iconsAbove = 0;
			let iconsBelow = 0;
			const iconsTotal = criticalRowRefs.current.length;
			for(const ref of criticalRowRefs.current) {
				const refYPosition = ref.offsetTop - (iconHeight / 2);
				if (!(refYPosition >= scrollTop)) { // Icon is above Viewport (vp)
					iconsAbove ++;

				} else if (!(refYPosition <= scrollBottom)) { // Icon is underneath Viewport (vp)
					iconsBelow ++;

				}
			}

			for(let i in criticalRowRefs.current) {
				const icon = criticalIconRefs.current[i];  // Get the alert icon at index i
				let iconData = {top: 0, left: 0};          // Create the top and left margin
				const row = criticalRowRefs.current[i];    // Get the row that's critical at index i
				const rowPosition = row.offsetTop - (iconHeight / 2 ); // The center of the row
				
				let leftShift = 0; // The slight offset to smoothly transition 
				if (!(rowPosition > scrollTop)) { // Icon is above Viewport (vp)
					
					// Set the alert icon to be at top of screen
					iconData.top = scrollTop
					// Offset the current icon based on the amount of alert icons above vp
					iconData.left = (iconsAbove - 1 - Number(i)) * -8;


					if (iconsAbove < iconsTotal) {  // Add a slight animation only when there is >1 alert icon above vp

						// The animation only takes place when 1 icon is almost at scrollTop, meaning
						// it's about to be inside the viewport. This icon is `criticalRowRefs.current[iconsAbove]`

						// Since criticalRowrefs is sorted in descending order of y Position, we can get the 
						// difference between the icon closest to vp and scrollTop. If diff < 8 we animate, otherwise
						// we discard the difference (don't shift the icon)
						const closestRowPosition = criticalRowRefs.current[iconsAbove].offsetTop - (iconHeight / 2);
						leftShift = Math.abs(scrollTop - closestRowPosition)
						leftShift = (leftShift/4 < 8) ? 8-leftShift/4 : 0			

					}
					

				} else if (!(rowPosition < scrollBottom)) { // Icon is underneath Viewport (vp)
					// Set the alert icon to be at bottom of screen
					iconData.top = scrollBottom
					// Offset the current icon based on the amount of alert icons below vp
					iconData.left = (Number(i) - (iconsTotal - iconsBelow)) * -8;

					if (iconsTotal - iconsBelow > 0) {
						
						// The animation only takes place when 1 icon is almost at scrollBottom, meaning
						// it's about to be inside the viewport. This icon is `criticalRowRefs.current[iconsTotal - iconsBelow - 1]`

						// Since criticalRowrefs is sorted in descending order of y Position, we can get the 
						// difference between the icon closest to vp and scrollBottom. If diff < 8 we animate, otherwise
						// we discard the difference (don't shift the icon)
						const closestRowPosition = criticalRowRefs.current[iconsTotal - iconsBelow - 1].offsetTop - (iconHeight / 2);
						leftShift = Math.abs(scrollBottom - closestRowPosition)
						leftShift = (leftShift/4 < 8) ? (8-leftShift/4) : 0			

					}
				} else { // Icon is inside viewport
					iconData.top = rowPosition // Position the icon's y at the y of the row
				}
				// Unhide element and position it
				icon.hidden = false
				icon.setAttribute('style', `top: ${iconData.top}px; left: ${-50 + iconData.left - leftShift}px`)	
			}
		}
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
            <div
				className={`popup-modal-content`}
				onClick={(e) => e.stopPropagation()}
				onScroll={handleScroll}
				onTransitionEnd={handleScroll}
				ref={modalContentRef}
			>
				<div id="icon-container">
					{criticalMachineLookup?.map((_, i) => // Create elements for each critical machine
						<div hidden={true} ref={(el) => (el) && criticalIconRefs.current.push(el)} className="sticky-offline">
							<CriticalStickyIcon/>
						</div>
					)}
				</div>
                <span className="close" onClick={() => setPopupSiteName(null)}>&times;</span>
                <form method="GET" id="my_form" onSubmit={insertMachine} autoComplete="off"/>
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
                        <tr className="machine-form">
                            <td> <input type="text" name="ipAddress" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td> <input type="text" name="assetNumber" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td> <input type="text" name="machineName" form="my_form" onChange={e => updateForm(e)} required/> </td>
                            <td colSpan={2}> <input type="submit" form="my_form" value={"Insert New Machine"}/> </td>
                        </tr>
                        {IPs.map((IP, i) => 
                            <tr    // Create Reference for all the machines that are critical
                                ref={(el) => (criticalMachineLookup && el && getIPStatus(IP).status == "critical")
									? criticalRowRefs.current.push(el)
									: null
								}
                                key={i} style={{"--status-color": getIPStatus(IP).color} as React.CSSProperties}
                            >
                                <td>{IP.ipAddress}</td>
                                <td>{IP.assetNumber}</td>
                                <td>
                                    <div style={{ maxWidth: "180px"}}>
                                        <div style={{textOverflow: "ellipsis", overflowX: "clip"}}>{IP.machineName}</div>
                                        <Tooltip>{IP.machineName}</Tooltip>
                                    </div>
                                </td>
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
