using System.Globalization;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Text;
using CsvHelper;
using IPClass;

namespace IpAddressTracker {

    public class IPAddressTracker {
        public static string csvLocation = @"../site_csvs/";

        public static Dictionary<string, List<IP>> siteList = new Dictionary<string, List<IP>>();

        public static void MainMethod() {
            string[] files = Directory.GetFiles(csvLocation, "*.csv", SearchOption.TopDirectoryOnly);

            foreach(string file in files) {
                string path = Path.GetFileNameWithoutExtension(file);
                siteList[path] = new List<IP>();
                InitialCsvRead(path);
                UpdateSite(path);
                WriteToCsv(path);
            }
        }

        public static List<IP> UpdateSite(string site) {
            Parallel.ForEach(siteList[site], ipAddress => {
                UpdateMachine(site, ipAddress.IpAddress);
            });
            return siteList[site];
        }

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
            IP machine = siteList[site].Find(c => c.IpAddress == ip)!; // ?? throw new ArgumentException();
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

        public static void WriteToCsv(string site) {
            using (var writer = new StreamWriter(csvLocation + site + ".csv"))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(siteList[site]);
            }
        }

        public static void OnShutdown() {
            foreach(string site in siteList.Keys) {
                WriteToCsv(site);
            }
        }

        // This function is called when adding a new machine from the site card table
        // It checks to make sure that the IP address is valid to make sure there was not an error when entering the form on the table
        public static List<IP> AddMachine(string site, IP retval) {
            // taken from online, way better than I could've done
            var octets = retval.IpAddress.Split('.');
            bool isValid = octets.Length == 4
               && !octets.Any(
                   x =>
                   {
                       int y;
                       return Int32.TryParse(x, out y) && y > 255 || y < 1;
                   });
            
            if (isValid && siteList[site].Find(c => retval.IpAddress == c.IpAddress) == null) {
                siteList[site].Add(retval);
                UpdateMachine(site, retval.IpAddress);
            }
            return siteList[site];
        }

        public static List<IP> RemoveMachine(string site, int i) {
            siteList[site].RemoveAt(i);
            return siteList[site];
        }

        public static void InitialCsvRead(string site) {
            using (StreamReader reader = new StreamReader(csvLocation + site + ".csv"))
            using (CsvReader csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
                csv.Read();
                csv.ReadHeader();
                while(csv.Read()) {
                    IPClass.IP address = new IPClass.IP { 
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