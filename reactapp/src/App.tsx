import React from "react";

import { Site } from "./components/components";
import { IP } from "./components/types";
import "./App.css";

// called from main.jsx
function App() {
    // states here, when state changes it rerenders the component. state is like a variable
    // site is variable, setSites is function to set (get and setters here)
    // site is an array of sites
    const [sites, setSites] = React.useState<{ [id: string] : Array<IP>; }  | null>(null);

    // how you make API calls. useEffect is like step out of the normal flow of rendering
    // useEffect is called after the page finishes rendering the first time and then rerenders the page
    // when this function is finished it rerenders the page (APi gets request it rerenders)
	React.useEffect(() => {
		fetch(`https://localhost:7085/api/get_sites`)
			.then((res) => res.json())
            .then((data) => setSites(data))
	}, []);

    // returns the html that is required for react 
    return ( (sites !== null) ?
        <div className="app">
            {
                Object.keys(sites).map((siteName) => <Site siteName={siteName} IPs={sites[siteName]}></Site>)       // mapping the siteList from IpTracker to components IPs object
            }
        </div>
        :
        <div>Loading...</div>
    );
}

export default App;