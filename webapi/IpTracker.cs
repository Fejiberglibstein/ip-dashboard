using System.Globalization;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Text;
using CsvHelper;
using IPClass;
using System.Timers;
using IpAddressTracker;

namespace IpAddressTracker {

    public class IPAddressTracker {
        public static string csvLocation = @"../site_csvs/";

        public static Dictionary<string, List<IP>> siteList = new Dictionary<string, List<IP>>();

        private static System.Timers.Timer aTimer;

        private static int intervals = 0;

        public static void MainMethod() {
            string[] files = Directory.GetFiles(csvLocation, "*.csv", SearchOption.TopDirectoryOnly);

            foreach(string file in files) {
                string path = Path.GetFileNameWithoutExtension(file);
                siteList[path] = new List<IP>();
                InitialCsvRead(path);
                UpdateSite(path);
                WriteToCsv(path);
            }

             aTimer = new System.Timers.Timer();
             aTimer.Interval = 10000;

             aTimer.Elapsed += OnTimedEvent;

             aTimer.AutoReset = true;

             aTimer.Enabled = true;
        }

        private static void OnTimedEvent(Object source, System.Timers.ElapsedEventArgs e) {
            UpdateSite("baguio");
            intervals++;

            if (intervals % 3 == 0) {
                System.Diagnostics.Debug.WriteLine("is this working?");
            }
        }

        /*  Called when a user clicks on the ping button on a specific site with a fetch to "/api/ping_site/{site}"
         *  Also called within IpTracker.cs at program startup so that the site is updated
         *  Want to be able to run this at intervals like every X hours so that it is continuously updating but right now only way I know to do it is as a scheduled task
         */
        public static List<IP> UpdateSite(string site) {
            Parallel.ForEach(siteList[site], ipAddress => {
                UpdateMachine(site, ipAddress.IpAddress);
            });
            return siteList[site];
        }

        /*  Called when a user clicks on the ping button on a specific machine with a fetch to "/api/ping_machine/{site}/{ip}"
         *  Also called within IpTracker.cs when a new machine is inserted or when a machine is changed with a new IP address
         */
        public static IP UpdateMachine(string site, string ip) {
            Ping ping = new Ping();
            DateTime currentTime = DateTime.Now;
            PingReply reply;
            reply = ping.Send(ip, 2000);
            // Don't think that I need the try catch anymore since I am checking if the IP is valid in AddMachine
            // try {
            //     reply = ping.Send(ip, 2000);
            // }
            // catch (PingException) {
            //     return new IP {IpAddress = "null", MachineName = "null"};
            // }
            IP machine = siteList[site].Find(c => c.IpAddress == ip)!;
            machine.CurrentTime = currentTime;
            machine.IsOnline = reply.Status == IPStatus.Success;
            if (machine.IsOnline == true) {
                machine.LastPingTime = currentTime;
                machine.TimeSinceLastPing = 0;
                machine.CheckThis = false;
            }
            else {
                if (!machine.LastPingTime.HasValue) {
                    machine.LastPingTime = currentTime.AddDays(-3);
                    machine.TimeSinceLastPing = currentTime.Subtract((DateTime)machine.LastPingTime).TotalHours;
                    machine.CheckThis = false;
                }

                else {
                    machine.TimeSinceLastPing = currentTime.Subtract((DateTime)machine.LastPingTime).TotalHours;
                    machine.CheckThis = machine.TimeSinceLastPing > 168;
                }
            }
            return machine;
        }

        // Writes to a site's csv file all at once, does not go row by row if one machine was pinged or updated
        public static void WriteToCsv(string site) {
            using (var writer = new StreamWriter(csvLocation + site + ".csv"))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(siteList[site]);
            }
        }

        // Hopefully, when the app is closing down this function runs so that each csv file is up to date when it ends
        public static void OnShutdown() {
            foreach(string site in siteList.Keys) {
                WriteToCsv(site);
            }
        }

        // Checks a string IP to see if it is valid, taken from online since it's way cleaner than I would've done
        static bool CheckIP(string IP) {
            var octets = IP.Split('.');
            bool isValid = octets.Length == 4
               && !octets.Any(
                   x =>
                   {
                       int y;
                       return Int32.TryParse(x, out y) && y > 255 || y < 1;
                   });
            return isValid;
        }
        // Called when user enters a new machine in the table form with a fetch to "/api/add_machine/{site}"
        public static List<IP> AddMachine(string site, IP retval) {
            // first, checks to see if the given IP address is valid, and if it is adds the machine to the siteList variable
            bool isValid = CheckIP(retval.IpAddress);
            
            if (isValid && siteList[site].Find(c => retval.IpAddress == c.IpAddress) == null) {
                siteList[site].Add(retval);
                UpdateMachine(site, retval.IpAddress);
            }
            else {
                throw new Exception("Invalid IP");
            }
            return siteList[site];
        }

        // Called when user clicks on Remove button in Options Menu with a fetch to "/api/remove_machine/{site}/{index}"
        public static List<IP> RemoveMachine(string site, int i) {
            siteList[site].RemoveAt(i);
            return siteList[site];
        }

        /*  Called when user clicks on Change button in Options Menu with a fetch to "/api/change_machine/{site}/{index}"
         *  site = the site card it was clicked from (east_aurora, torrance, etc.)
         *  i = index of the IP in siteList, retval = the IP from the frontend form
         */ 
        public static List<IP> ChangeMachine(string site, int i, IP retval) {
            // if the IP addresses are the same, then we don't have to update the ping data since asset or name was the only thing changed
            if (siteList[site][i].IpAddress == retval.IpAddress) {  
                siteList[site][i].AssetNumber = retval.AssetNumber;
                siteList[site][i].MachineName = retval.MachineName;
            }
            // if the IP addresses are different, then we need to ping the new IP address to generate new data
            else {
                if (!CheckIP(retval.IpAddress)) {
                    throw new Exception("Invalid IP Address");
                }
                siteList[site][i].IpAddress = retval.IpAddress;
                siteList[site][i].AssetNumber = retval.AssetNumber;
                siteList[site][i].MachineName = retval.MachineName;
                UpdateMachine(site, siteList[site][i].IpAddress);
            }
            return siteList[site];
        }
    
        // Called at startup of the app, reads the site's csv and creates a list of IP's 
        public static void InitialCsvRead(string site) {
            using (StreamReader reader = new StreamReader(csvLocation + site + ".csv"))
            using (CsvReader csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
                csv.Read();
                csv.ReadHeader();
                while(csv.Read()) {
                    IP address = new IP { 
                        IpAddress = csv.GetField<string>("IpAddress")!,
                        MachineName = csv.GetField<string>("MachineName")!
                    };
                    if (csv.GetField<string>("AssetNumber") != "") { address.AssetNumber = csv.GetField<string>("AssetNumber"); }
                    if (csv.GetField<string>("IsOnline") != "") { address.IsOnline = csv.GetField<bool>("IsOnline"); }
                    if (csv.GetField<string>("LastPingTime") != "") { address.LastPingTime = csv.GetField<DateTime>("LastPingTime"); }
                    if (csv.GetField<string>("CurrentTime") != "") { address.CurrentTime = csv.GetField<DateTime>("CurrentTime"); }
                    if (csv.GetField<string>("TimeSinceLastPing") != "") { address.TimeSinceLastPing = csv.GetField<double>("TimeSinceLastPing"); }
                    if (csv.GetField<string>("CheckThis") != "") { address.CheckThis = csv.GetField<bool>("CheckThis"); }
                    siteList[site].Add(address);
                }
            }
        }
    }
}
