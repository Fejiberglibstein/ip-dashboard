using IPClass;
using IpAddressTracker;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

IPAddressTracker.MainMethod();

app.MapGet("/api/get_sites", () => {
    return IPAddressTracker.siteList;
});

app.MapGet("/api/get_site/{site}", (string site) => {
    return IPAddressTracker.siteList[site];
});

app.MapGet("/api/get_machine/{site}/{ip}", (string site, string ip) => {
    return IPAddressTracker.siteList[site].Find(c => c.IpAddress == ip);
});

// this is a Post request but I'm too stupid to figure out why I can't post it. Maybe cause it needs to be a JSON or something (actually need to post something)?? ?
app.MapGet("/api/ping_site/{site}", (string site) => {
    List<IP> machine = IPAddressTracker.UpdateSite(site);
    return machine;
});

// this is a Post request but I'm too stupid to figure out why I can't post it. Maybe cause it needs to be a JSON or something (actually need to post something)?? ?
app.MapGet("/api/ping_machine/{site}/{ip}", (string site, string ip) => {
    IP machine = IPAddressTracker.UpdateMachine(site, ip);
    return machine;
});

app.Run();