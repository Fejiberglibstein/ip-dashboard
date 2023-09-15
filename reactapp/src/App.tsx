import React from "react";

import { Site, SiteStatus } from "./components/site-card";
import { BannerProps, IP } from "./types";
import { PopupModal } from "./components/modal";
import { getSiteStatus } from "./status-colors"
import "./App.css";

// called from main.jsx
function App() {
    // states here, when state changes it rerenders the component. state is like a variable
    // site is variable, setSites is function to set (get and setters here)
    // site is an array of sites
    const [sites, setSites] = React.useState<{ [id: string] : Array<IP> } | null>(null);

    // state to see if a popup is being displayed rather than having states on each site and cluttering it up
    const[popupSiteName, setPopupSiteName] = React.useState<string | null>(null);

    const popupSite = (siteName: string) => {
        if (popupSiteName == null) {
            setPopupSiteName(siteName);
        }
    }

    // returning an object because of the braces and ..sites copies the entire array and [siteName] is setting the key to be IPs
    // setSites(sites[siteName] = IP) but cant do this in react because it will think the value is the same even though we are changing the IP content
    const setSite = (siteName: string, IPs: Array<IP>) => {
        console.log(IPs)
        setSites({
            ...sites,
            [siteName]: IPs
        })
    }
    
    const setIP = (siteName: string, IP: IP) => {
        if (sites !== null) {
            const IPs = sites[siteName]
            setSites({
                ...sites,
                [siteName]: IPs.map((oldIP) => 
                    oldIP.ipAddress == IP.ipAddress ? IP : oldIP
                )
            })
        }
    }

    // how you make API calls. useEffect is like step out of the normal flow of rendering
    // useEffect is called after the page finishes rendering the first time and then rerenders the page (as long as there is a dependency) (array of states as second parameter)
    // when this function is finished it rerenders the page (APi gets request it rerenders)
	React.useEffect(() => {
		fetch(`/api/get_sites`)
			.then((res) => res.json())
            .then((data) => setSites(data))
	}, []);

    // returns the html that is required for react 
    return ( (sites !== null) ?
        <>
        <div className="app">
            <Banner sites={sites}/>
            <div className="site-card-container">
                {                   // maps each site (EA, TOR) to a new site card that contains its site name and all the IPs it has listed
                    Object.keys(sites).map((siteName, i) => <Site siteName={siteName} key={i} IPs={sites[siteName]} setSite={setSite} popupSite={popupSite}></Site>)       // mapping the siteList from IpTracker to components IPs object
                }
            </div>
        </div>
        {(popupSiteName !== null)
            ? <PopupModal setIP={setIP} enabled={true} siteName={popupSiteName} IPs={sites[popupSiteName]} setPopupSiteName={setPopupSiteName} setSite={setSite} />
            : <PopupModal enabled={false}/>
        }
        </>
        :
        <div>Loading...</div>
    );
}

const Banner = ({ sites }: BannerProps): React.JSX.Element => {
    const companyWideStatus = {machinesOnline: 0, machinesOffline: 0, machinesCritical: 0}
    for(const site of Object.keys(sites)) {
        const temp = getSiteStatus(sites[site])
        companyWideStatus.machinesCritical += (temp.machinesCritical) ? temp.machinesCritical : 0;
        companyWideStatus.machinesOffline += (temp.machinesOffline) ? temp.machinesOffline : 0;
        companyWideStatus.machinesOnline += (temp.machinesOnline) ? temp.machinesOnline : 0;
    }

    const pingMachine = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`api/ping_random/${event.target[0].value}`, {
                body: JSON.stringify(event.target[0].value),
                method: "POST",
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
            })
            const result = await response.json()
            if (!JSON.parse(result)) alert("That IP is off")
            else alert("That IP is online")
        }
        catch {
            alert("Insert has failed")
        }
    }

    return (
        <div className="banner">
            <div className="app-name">IP Dashboard Thing</div>
            <SiteStatus style={{flexDirection: "row-reverse", gap: "10px", "--text-color":"white"} as React.CSSProperties} {...companyWideStatus}></SiteStatus>
            <div className="solo-ping">
                <form autoComplete="off" autoCorrect="off" onSubmit={(e) => {
                    e.preventDefault();
                    pingMachine(e)
                }}>
                    <input type="text" placeholder="Type IP here"/>
                    <input type="submit" value={"Ping IP"}/>
                </form>
            </div>
        </div>
    );
}

export default App;