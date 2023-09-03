import React from "react";

import { Site } from "./components/site-card";
import { IP } from "./types";
import { PopupModal } from "./components/modal";
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
    // useEffect is called after the page finishes rendering the first time and then rerenders the page
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
            {                   // maps each site (EA, TOR) to a new site card that contains its site name and all the IPs it has listed
                Object.keys(sites).map((siteName, i) => <Site siteName={siteName} key={i} IPs={sites[siteName]} setSite={setSite} popupSite={popupSite}></Site>)       // mapping the siteList from IpTracker to components IPs object
            }
        </div>
        {(popupSiteName !== null)
            ? <PopupModal setIP={setIP} enabled={true} siteName={popupSiteName} IPs={sites[popupSiteName]} setPopupSiteName={setPopupSiteName}/>
            : <PopupModal enabled={false}/>
        }
        </>
        :
        <div>Loading...</div>
    );
}

export default App;