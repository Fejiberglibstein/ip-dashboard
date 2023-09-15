using IPClass;
using IpAddressTracker;
using Microsoft.AspNetCore.Mvc;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("https://localhost:5173");
                      });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors(MyAllowSpecificOrigins);

app.Services.GetRequiredService<IHostApplicationLifetime>().ApplicationStarted.Register(IPAddressTracker.MainMethod);

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
// You probably need to add a body to the request in frontend
app.MapGet("/api/ping_site/{site}", (string site) => {
    List<IP> machine = IPAddressTracker.UpdateSite(site);
    return machine;
});

// this is a Post request but I'm too stupid to figure out why I can't post it. Maybe cause it needs to be a JSON or something (actually need to post something)?? ?
app.MapGet("/api/ping_machine/{site}/{ip}", (string site, string ip) => {
    IP machine = IPAddressTracker.UpdateMachine(site, ip);
    IPAddressTracker.WriteToCsv(site);
    return machine;
});

app.MapPost("/api/add_machine/{site}", (string site, [FromBody] IP request) => {
    List<IP> response = IPAddressTracker.AddMachine(site, request);
    return response;
});

app.MapDelete("/api/remove_machine/{site}/{index}", (string site, int index) => {
    List<IP> response = IPAddressTracker.RemoveMachine(site, index);
    return response;
});

app.MapPut("/api/change_machine/{site}/{index}", (string site, int index, [FromBody] IP request) => {
    List<IP> response = IPAddressTracker.ChangeMachine(site, index, request);
    return response;
});

app.Run();