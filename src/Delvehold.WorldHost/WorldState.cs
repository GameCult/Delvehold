using GameCult.Caching;
using MessagePack;

namespace Delvehold.WorldHost;

internal static class WorldStateContract
{
    public const string Schema = "delvehold.world_state.v0";
    public const string RecordKey = "delvehold:world:canonical";
}

[MessagePackObject]
[CultDocument("delvehold.world_state", WorldStateContract.Schema)]
public sealed class DelveholdWorldState
{
    [Key(0), CultName] public string WorldId { get; set; } = "";
    [Key(1)] public long Revision { get; set; }
    [Key(2)] public string WorkshopId { get; set; } = "";
    [Key(3)] public string CommonsId { get; set; } = "";
    [Key(4)] public string DungeonCoreId { get; set; } = "";
    [Key(5)] public string ContractId { get; set; } = "";
    [Key(6)] public string MaterialId { get; set; } = "";

    public static DelveholdWorldState FirstWorld() => new()
    {
        WorldId = "greathold-first-world",
        Revision = 1,
        WorkshopId = "workshop-emberbench",
        CommonsId = "commons-deepmarket",
        DungeonCoreId = "core-cinderwake",
        ContractId = "contract-first-light",
        MaterialId = "material-wardstone"
    };
}
