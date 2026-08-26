using GameCult.Caching;
using MessagePack;

namespace Delvehold.Protocol;

public static class DelveholdWorldContract
{
    public const string VerseId = "delvehold.shared-world";
    public const string AuthorityRuntimeId = "delvehold.world-host";
    public const string ServiceId = "delvehold.world";
    public const string EnterOperation = "enter";
    public const string EnterIntentSchema = "delvehold.world_enter_intent.v0";
    public const string EnterReceiptSchema = "delvehold.world_enter_receipt.v0";
}

[MessagePackObject]
public sealed class WorldEnterIntent
{
    [Key(0)] public string Projection { get; set; } = "hold";
}

[MessagePackObject]
[CultDocument("delvehold.world_enter_receipt", DelveholdWorldContract.EnterReceiptSchema)]
public sealed class WorldEnterReceipt
{
    [Key(0), CultName] public string IdempotencyKey { get; set; } = "";
    [Key(1)] public string ClientRuntimeId { get; set; } = "";
    [Key(2)] public string Projection { get; set; } = "hold";
    [Key(3)] public long WorldRevision { get; set; }
    [Key(4)] public string WorldId { get; set; } = "";
    [Key(5)] public string Message { get; set; } = "";
    [Key(6)] public DateTime EffectiveAtUtc { get; set; }
}
