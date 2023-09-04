import React, { useEffect, useRef } from "react";

import "./modal.css";
import { IP, PopupModalProps } from "../types";
import { PingButton, Timestamp } from "./components"
import { getIPStatus } from "../status-colors";
import { CriticalStickyIcon } from "../assets/icons";
export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP}: PopupModalProps): React.JSX.Element => {
	
	// List of the critical machines
    let criticalMachineLookup = IPs?.filter((IP) => IP.checkThis)
	// List of all table elements that are critical    
    const criticalIconRefs = useRef<Array<HTMLDivElement>>(Array(0))
    const criticalRowRefs =  useRef<Array<HTMLTableRowElement>>(Array(0))
	const modalContentRef =  useRef<HTMLDivElement | null>(null)
	criticalIconRefs.current = []
	criticalRowRefs.current = []

    if (!enabled) {
		
        return (
            <div className={`modal-background disabled`}>
                <div className={`popup-modal-content disabled`}></div>
            </div>
        )
    }

	function handleScroll() {
		if (modalContentRef.current) {
			const iconHeight = 35;
			const scrollMargin = 10;
			const scrollTop = modalContentRef.current.scrollTop + scrollMargin;
			const scrollBottom = modalContentRef.current.scrollTop + modalContentRef.current.clientHeight - scrollMargin - 65;
			
			// Cache the amount of icons that are offscreen
			let iconsAbove = 0;
			let iconsBelow = 0;
			const iconsTotal = criticalRowRefs.current.length;
			for(const ref of criticalRowRefs.current) {
				const refYPosition = ref.offsetTop - (iconHeight / 2);
				if (!(refYPosition >= scrollTop)) { // Icon is above Viewport
					iconsAbove ++;

				} else if (!(refYPosition <= scrollBottom)) { // Icon is underneath Viewport
					iconsBelow ++;

				}
			}

			for(let i in criticalRowRefs.current) {
				const icon = criticalIconRefs.current[i];
				let iconData : {top: number, opacity: number, left: number} = {top: 0, opacity: 0, left: 0}
				const ref = criticalRowRefs.current[i]
				const refPosition = ref.offsetTop - (iconHeight / 2 )
				
				let shift = 0;
				if (!(refPosition > scrollTop)) { // Icon is above Viewport
					iconData.top = scrollTop
					iconData.left = (iconsAbove - 1 - Number(i)) * -8;

					// Check the distance from the next alert icon to scrollTop
					if (iconsAbove < iconsTotal) {
						const closestRowPosition = criticalRowRefs.current[iconsAbove].offsetTop - (iconHeight / 2);
						shift = Math.abs(scrollTop - closestRowPosition)
						shift = (shift/4 < 8) ? 8-shift/4 : 0			

					}
					

				} else if (!(refPosition < scrollBottom)) { // Icon is underneath Viewport
					iconData.top = scrollBottom
					iconData.left = (Number(i) - (iconsTotal - iconsBelow)) * -8;

					// Check the distance from the next alert icon to scrollBottom
					if (iconsTotal - iconsBelow > 0) {
						const closestRowPosition = criticalRowRefs.current[iconsTotal - iconsBelow - 1].offsetTop - (iconHeight / 2);
						shift = Math.abs(scrollBottom - closestRowPosition)
						console.log(shift)
						shift = (shift/4 < 8) ? (8-shift/4) : 0			

					}

				} else { // Icon is inside viewport
					iconData.top = refPosition
				}
				icon.hidden = false
				icon.setAttribute('style', `top: ${iconData.top}px; left: ${-50 + iconData.left - shift}px`)	
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
                            <tr    // Create Reference for all the machines that are critical
                                ref={(el) => (criticalMachineLookup && el && getIPStatus(IP).status == "critical")
									? criticalRowRefs.current.push(el)
									: null
								}
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

