using System.Net;
using System.Net.Sockets;
using Delvehold.Protocol;
using Delvehold.WorldHost;
using GameCult.Caching;
using GameCult.Caching.MessagePack;
using GameCult.Mesh;
using GameCult.Networking;

const string routeGeneration = "delvehold-local-v1";
var settings = HostSettings.Parse(args);
Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(settings.StatePath))!);

var documentTypes = new[] { typeof(DelveholdWorldState), typeof(WorldEnterReceipt) };
var cacheRegistry = CultMesh.CreateCultCacheDocumentRegistry(documentTypes);
var networkRegistry = CultMesh.CreateCultNetDocumentRegistry(documentTypes, cacheRegistry);
using var node = await CultMesh.CreateNodeAsync(settings.StatePath, new CultMeshNodeOptions
{
    StartServer = false,
    CacheOptions = new CultCacheOpenOptions
    {
        Registry = cacheRegistry,
        FlushOnDispose = true,
        StoreFlushOnDispose = true
    },
    DatabaseOptions = new CultNetDatabaseOptions
    {
        RuntimeId = DelveholdWorldContract.AuthorityRuntimeId,
        DocumentRegistry = networkRegistry
    }
});

var worldKey = new CultRecordKey(WorldStateContract.RecordKey);
if (node.Cache.Get<DelveholdWorldState>(worldKey) is null)
    await node.Database.PutAsync(worldKey, DelveholdWorldState.FirstWorld());
await node.FlushAsync();

using var server = new TcpFramedCultNetSchemaServer(
    new TcpListener(IPAddress.Loopback, settings.Port));
var endpoint = $"cultnet+tcp://127.0.0.1:{server.LocalEndPoint.Port}";
using var identity = new CultMeshSessionIdentityServer(
    server,
    DelveholdWorldContract.AuthorityRuntimeId,
    [DelveholdWorldContract.VerseId],
    [CultMeshProtocols.Documents.Value],
    [routeGeneration]);

using var catalog = new CultMeshVerseCatalog();
catalog.Upsert(new CultMeshVerseDescriptor(
    DelveholdWorldContract.VerseId,
    "DELVE/HOLD shared world",
    CultMeshVerseAuthorityModel.OperatorCluster,
    new CultMeshVerseCompatibility("cultmesh.v0", "delvehold-local-rules-v0"),
    authorityRoutes:
    [
        new CultMeshAuthorityRoute(
            DelveholdWorldContract.AuthorityRuntimeId,
            endpoint,
            [CultMeshProtocols.Documents.Value],
            priority: 10,
            generation: routeGeneration)
    ],
    description: "The authoritative DELVE/HOLD world host."));
server.OnCultNet<CultMeshVerseCatalogRequestMessage>((request, peer) =>
{
    peer.SendCultNet(CultMeshVerseMessages.CreateCatalogResponse(catalog, request));
    return Task.CompletedTask;
});

using var operationGate = new SemaphoreSlim(1, 1);
using var operations = new CultNetOperationServer(server, DelveholdWorldContract.AuthorityRuntimeId)
    .Register<WorldEnterIntent, WorldEnterReceipt>(
        DelveholdWorldContract.ServiceId,
        DelveholdWorldContract.EnterOperation,
        DelveholdWorldContract.EnterIntentSchema,
        DelveholdWorldContract.EnterReceiptSchema,
        async context =>
        {
            await operationGate.WaitAsync();
            try
            {
                var sourceRuntimeId = context.SourceRuntimeId?.Trim() ?? "";
                var projection = context.Value.Projection?.Trim().ToLowerInvariant() ?? "";
                if (sourceRuntimeId.Length == 0 || (projection != "delve" && projection != "hold"))
                {
                    var invalidWorld = node.Cache.Get<DelveholdWorldState>(worldKey)
                        ?? throw new InvalidOperationException("Canonical world state is unavailable.");
                    return CultNetOperationReply<WorldEnterReceipt>.Rejected(
                        new WorldEnterReceipt
                        {
                            IdempotencyKey = context.IdempotencyKey,
                            ClientRuntimeId = sourceRuntimeId,
                            Projection = projection,
                            WorldRevision = invalidWorld.Revision,
                            WorldId = invalidWorld.WorldId,
                            Message = "World entry requires a caller identity and the DELVE or HOLD projection.",
                            EffectiveAtUtc = DateTime.UtcNow
                        },
                        "invalid-world-entry");
                }

                var receiptKey = new CultRecordKey("delvehold:receipt:" + context.IdempotencyKey);
                var existing = node.Cache.Get<WorldEnterReceipt>(receiptKey);
                if (existing is not null)
                {
                    var matches = existing.ClientRuntimeId == sourceRuntimeId &&
                                  existing.Projection == projection;
                    return matches
                        ? CultNetOperationReply<WorldEnterReceipt>.Accepted(existing)
                        : CultNetOperationReply<WorldEnterReceipt>.Rejected(
                            existing,
                            "idempotency-key-collision");
                }

                var world = node.Cache.Get<DelveholdWorldState>(worldKey)
                    ?? throw new InvalidOperationException("Canonical world state is unavailable.");
                var receipt = new WorldEnterReceipt
                {
                    IdempotencyKey = context.IdempotencyKey,
                    ClientRuntimeId = sourceRuntimeId,
                    Projection = projection,
                    WorldRevision = world.Revision,
                    WorldId = world.WorldId,
                    Message = $"Entered {world.WorldId} through the {projection.ToUpperInvariant()} projection.",
                    EffectiveAtUtc = DateTime.UtcNow
                };
                await node.Database.PutAsync(receiptKey, receipt);
                await node.FlushAsync();
                return CultNetOperationReply<WorldEnterReceipt>.Accepted(receipt);
            }
            finally
            {
                operationGate.Release();
            }
        });

server.PeerFailed += (peer, error) => Console.Error.WriteLine($"DELVEHOLD_PEER_FAILED {peer} {error.Message}");
Console.WriteLine($"DELVEHOLD_HOST_READY {endpoint}");

var stopped = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
Console.CancelKeyPress += (_, eventArgs) =>
{
    eventArgs.Cancel = true;
    stopped.TrySetResult();
};
await Task.WhenAny(stopped.Task, server.BackgroundFailure);
if (server.BackgroundFailure.IsCompleted)
    throw await server.BackgroundFailure;

internal sealed record HostSettings(string StatePath, int Port)
{
    public static HostSettings Parse(string[] args)
    {
        var state = Path.Combine("artifacts", "host", "delvehold.cc");
        var port = 4075;
        for (var index = 0; index < args.Length; index++)
        {
            switch (args[index])
            {
                case "--state" when index + 1 < args.Length:
                    state = args[++index];
                    break;
                case "--port" when index + 1 < args.Length:
                    port = int.Parse(args[++index]);
                    break;
            }
        }
        return new HostSettings(state, port);
    }
}
