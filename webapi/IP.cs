namespace IPClass;

public class IP {
    public required string IpAddress { get; set; }
    public string? AssetNumber { get; set; }
    public required string MachineName { get; set; }
    public bool? IsOnline { get; set; }
    public DateTime? LastPingTime { get; set; }
    public DateTime? CurrentTime { get; set; }
    public double? TimeSinceLastPing { get; set; }
    public bool? CheckThis { get; set; }
}