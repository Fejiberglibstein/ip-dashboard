import React, { useEffect, useRef, useState } from "react";

import "./modal.css";
import { FormProps, IP, PopupModalProps } from "../types";
import { PingButton, Timestamp, Tooltip } from "./components"
import { getIPStatus } from "../status-colors";
import { ChangeIcon, CriticalStickyIcon, OptionsIcon, RemoveIcon, AddIcon, CloseIcon } from "../assets/icons";

var hasPassword: boolean = false;
const officialPasswords: string[] = ["cimcous2023", "cimcouk2023", "cimcoph2023"]

export const PopupModal = ({ enabled, siteName, IPs, setPopupSiteName, setIP, setSite}: PopupModalProps): React.JSX.Element => {
	
	// List of the critical machines
    const [menuIndex, setMenuIndex] = useState<number | null>(null)
    const [formIndex, setFormIndex] = useState<number | "add" | null>(null)
    const [form, setForm] = React.useState<IP | null>(null);
    
    let criticalMachineLookup = IPs?.filter((IP) => IP.checkThis) 
    const criticalIconRefs = useRef<Array<HTMLDivElement>>(Array(0))        // List of all the icons on the side
    const criticalRowRefs =  useRef<Array<HTMLTableRowElement>>(Array(0))   // List of all table rows that are critical
	const modalContentRef =  useRef<HTMLDivElement | null>(null)            // The modal
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
			const iconHeight = 35;    // Height of the icon
			const scrollMargin = 0;  // Margin from the top/bottom of the screen

			// Top and bottom of the viewport/modal. The 65 subtracted on scrollBottom is 
			// an arbitrary number I got from guess and check to match the margin on the top
			const scrollTop = modalContentRef.current.scrollTop + scrollMargin;
			const scrollBottom = modalContentRef.current.scrollTop + modalContentRef.current.clientHeight - scrollMargin - 40;

            const containerTop = scrollMargin + 18
            const containerBottom = modalContentRef.current.clientHeight - scrollMargin - 22
			
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
				let iconData = {top: 0, left: 0, cursor: ""};          // Create the top and left margin
				const row = criticalRowRefs.current[i];    // Get the row that's critical at index i
				const rowPosition = row.offsetTop - (iconHeight / 2 ); // The center of the row
				
				let leftShift = 0; // The slight offset to smoothly transition 
				if (!(rowPosition > scrollTop)) { // Icon is above Viewport (vp)
					
					// Set the alert icon to be at top of screen
					iconData.top = containerTop
					// Offset the current icon based on the amount of alert icons above vp
					iconData.left = (iconsAbove - 1 - Number(i)) * -8;
                    icon.onclick = () => onStickyClick(iconsAbove-1)
                    iconData.cursor = "pointer"

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
					iconData.top = containerBottom
					// Offset the current icon based on the amount of alert icons below vp
					iconData.left = (Number(i) - (iconsTotal - iconsBelow)) * -8;
                    icon.onclick = () => onStickyClick(iconsTotal - iconsBelow)
                    iconData.cursor = "pointer"

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
					iconData.top = rowPosition - modalContentRef.current.scrollTop + ((iconHeight + 6 )/ 2 )  // Position the icon's y at the y of the row
				}
				// Unhide element and position it
				icon.hidden = false
				icon.setAttribute('style', `top: ${iconData.top}px; left: ${80 + iconData.left - leftShift}px; cursor: ${iconData.cursor}`)	
			}
		}
	}

    function onStickyClick(index: number) {
        criticalRowRefs.current[index].scrollIntoView({behavior: "smooth", block:"nearest"})
    }

    function onAddMachine() {
        modalContentRef.current?.scrollTo({top: 1000000, behavior: "smooth"})
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

    function checkPassword() {
        if (hasPassword == true) return true;
        for (var i = 0; i < 3; i++) {
            let password = prompt("Enter password to modify machine.")
            if(!password) return false;
            else if (!officialPasswords.includes(password!)) {
                alert("Incorrect password");
                continue;
            }
            hasPassword = true;
            return true;
        }
        return false;
    }

    const insertMachine = async (event) => {
        event.preventDefault()
        if(!checkPassword()) return;
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

    const changeMachine = async (event, i: number) => {
        if(!checkPassword()) return;
        try {
            const response = await fetch(`api/change_machine/${siteName}/${i}`, {
                body: JSON.stringify(form),
                method: "PUT",
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
            })
            const result = await response.json()
            setSite(siteName, result)
        }
        catch {
            alert("Change has failed")
        }
    }

    const updateForm = (event) => {
        setForm({...form, [event.target.name]: event.target.value} as IP)
    }

    return (
        <div className={`modal-background`} onClick={() => { setPopupSiteName(null); setMenuIndex(null); setFormIndex(null) }}>
            <div
				className={`popup-modal-content`}
				onClick={(e) => {e.stopPropagation(); setMenuIndex(null) }}
				onTransitionEnd={handleScroll}
			>
				<div id="icon-container">
					{criticalMachineLookup?.map((_, i) => // Create elements for each critical machine
						<div key={i} hidden={true} ref={(el) => (el) && criticalIconRefs.current.push(el)} className="sticky-offline">
							<CriticalStickyIcon/>
						</div>
					)}
				</div>
                <span className="close" onClick={() => setPopupSiteName(null)}>&times;</span>
                <button className="add-machine" onClick={() => setFormIndex("add") }><AddIcon/>Insert Machine</button>
                <form method="GET" id="my_form" onSubmit={(e) => {
                    e.preventDefault();
                    if(formIndex == null) insertMachine(e);
                    else if(formIndex == "add") insertMachine(e);
                    else changeMachine(e, formIndex as number);
                    setFormIndex(null)
                }} autoComplete="off"/>
                <div className="table-container" ref={modalContentRef} onScroll={handleScroll}>
                    <table>
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Asset Number</th>
                                <th>Machine Name</th>
                                <th>Time Since Last Ping</th>
                                <th>Ping IP</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...IPs].sort((a,b) => compareIPAddresses(a.ipAddress, b.ipAddress)).map((IP, i) => 
                                 (formIndex == i)
                                    ? <Form key={i} updateForm={updateForm} IP={IP} setForm={setForm} formIndex={formIndex} onAddMachine={onAddMachine} setFormIndex={setFormIndex}/>
                                    : <tr    // Create Reference for all the machines that are critical
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
                                    <td style={{position: "relative"}}>
                                        <button title="Options" className="options-button" onClick={e => { e.stopPropagation(); setMenuIndex(i) }}><OptionsIcon/></button>
                                        {
                                            (menuIndex == i)
                                            ? <ContextMenu siteName={siteName} indexIP={IPs.indexOf(IP)} setSite={setSite} setFormIndex={setFormIndex} rowIndex={i} checkPassword={checkPassword} ></ContextMenu>
                                            : <></>
                                        }
                                    </td>
                                </tr>
                            )}
                            { (formIndex == "add") 
                                ? <Form IP={{"ipAddress": "", "assetNumber": "", "machineName": ""}} updateForm={updateForm} setForm={setForm} formIndex={formIndex} onAddMachine={onAddMachine} setFormIndex={setFormIndex}></Form>
                                : <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const Form = ({ IP, updateForm, setForm, formIndex, onAddMachine, setFormIndex}: FormProps): React.JSX.Element => {
    // using useEffect because it renders the component, calls setForm, then rerenders the page after that
    // without it we would get brick error because there 
    useEffect(() => {
        setForm(IP) 
    }, [])

    if(formIndex == "add") onAddMachine();

    return (
        <tr style={{"--status-color": "#7861d3"} as React.CSSProperties} className="machine-form">
            <td> <input aria-label="IP Address" type="text" name="ipAddress" form="my_form" defaultValue={IP.ipAddress} onChange={e => updateForm(e)} required/> </td>
            <td> <input aria-label="Asset Number" type="text" name="assetNumber" form="my_form" defaultValue={IP.assetNumber} onChange={e => updateForm(e)} required/> </td>
            <td> <input aria-label="Machine Name"  type="text" name="machineName" form="my_form" defaultValue={IP.machineName} onChange={e => updateForm(e)} required/> </td>
            <td/>
            <td> <input type="submit" form="my_form" value={ (formIndex == "add" ? "Add New Machine" : "Modify Machine") }/> </td>
            <td> <span className="options-button" onClick={() => {setFormIndex(null); console.log(formIndex)}}><CloseIcon/></span> </td>
        </tr>
    )
}

const ContextMenu = ({ siteName, setSite, indexIP, setFormIndex, rowIndex, checkPassword }): React.JSX.Element => {
    
    const removeMachine = async (event, i: number) => {
        if (!confirm("Are you sure you want to delete this machine?")) return;
        if (!checkPassword()) return;
        try {
            const response = await fetch(`api/remove_machine/${siteName}/${i}`, {
                method: "DELETE",
                headers: {'Accept': 'application/json', 'Content-Type': 'text/plain'}
            })
            const result = await response.json()
            setSite(siteName, result)
        }
        catch {
            alert("Remove has failed")
        }
    }
    
    return (
        <ul className="context-menu">
            <li> <button onClick={(e) => removeMachine(e, indexIP)}>
                <RemoveIcon/> Remove
            </button> </li>
            <li> <button onClick={(e) => { e.stopPropagation(); setFormIndex(rowIndex) }}>
                <ChangeIcon/> Change
            </button> </li>
        </ul>
    )
}

/* TODO:
- [x] Change and remove require a password one time preferrably
- [x] Insert new IP button on a site card
- [ ] Complete company site card w/ stats of all sites and a ping any IP address textbox
- [x] 'X' in a row where there is a form 
- [x] Remove machine has a confirmation box
- [?] ! are not centered in the table
- [ ] table header is sticky
- [/] backend writing to the CSVs and backing up every X hours
- [ ] stylize the form so that it doesnt ruin the table like it currently does
*/