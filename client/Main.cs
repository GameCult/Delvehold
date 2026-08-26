using Delvehold.Protocol;
using GameCult.Mesh;
using Godot;

namespace Delvehold.Client;

public partial class Main : Control
{
    private Label _mode = null!;
    private Label _status = null!;
    private Button _delve = null!;
    private Button _hold = null!;
    private CultMeshClient? _mesh;
    private string _projection = "hold";

    public override void _Ready()
    {
        BuildInterface();
        _ = EnterWorldAsync();
    }

    public override void _ExitTree()
    {
        _mesh?.Dispose();
    }

    private void BuildInterface()
    {
        var margin = new MarginContainer();
        margin.SetAnchorsAndOffsetsPreset(LayoutPreset.FullRect);
        margin.AddThemeConstantOverride("margin_left", 48);
        margin.AddThemeConstantOverride("margin_top", 42);
        margin.AddThemeConstantOverride("margin_right", 48);
        margin.AddThemeConstantOverride("margin_bottom", 42);
        AddChild(margin);

        var column = new VBoxContainer();
        column.AddThemeConstantOverride("separation", 18);
        margin.AddChild(column);

        var title = new Label { Text = "DELVE / HOLD" };
        title.AddThemeFontSizeOverride("font_size", 42);
        column.AddChild(title);

        _mode = new Label { Text = "HOLD projection" };
        _mode.AddThemeFontSizeOverride("font_size", 24);
        column.AddChild(_mode);

        var modes = new HBoxContainer();
        modes.AddThemeConstantOverride("separation", 12);
        column.AddChild(modes);
        _delve = new Button { Text = "DELVE", CustomMinimumSize = new Vector2(160, 48) };
        _hold = new Button { Text = "HOLD", CustomMinimumSize = new Vector2(160, 48), Disabled = true };
        _delve.Pressed += () => SelectProjection("delve");
        _hold.Pressed += () => SelectProjection("hold");
        modes.AddChild(_delve);
        modes.AddChild(_hold);

        _status = new Label { Text = "Finding the Greathold world host…", AutowrapMode = TextServer.AutowrapMode.WordSmart };
        column.AddChild(_status);
    }

    private void SelectProjection(string projection)
    {
        _projection = projection;
        _mode.Text = projection.ToUpperInvariant() + " projection";
        _delve.Disabled = projection == "delve";
        _hold.Disabled = projection == "hold";
    }

    private async Task EnterWorldAsync()
    {
        var options = ClientArguments.Parse(OS.GetCmdlineUserArgs());
        SelectProjection(options.Projection);
        try
        {
            _mesh = new CultMeshClient(new CultMeshClientOptions
            {
                RendezvousEndpoints = [options.Endpoint],
                Discovery = new CultMeshVerseDiscoveryClientOptions { TransportVersion = "cultmesh.v0" },
                Sessions = new CultMeshSessionManagerOptions
                {
                    Trust = new CultMeshAuthorityTrustPolicy(CultMeshAuthorityTrustMode.LocalDevelopment)
                },
                OperationResponseTimeout = TimeSpan.FromSeconds(8)
            });
            var receipt = await _mesh.InvokeAsync<WorldEnterIntent, WorldEnterReceipt>(
                new CultMeshSessionTarget(
                    DelveholdWorldContract.VerseId,
                    DelveholdWorldContract.AuthorityRuntimeId),
                DelveholdWorldContract.ServiceId,
                DelveholdWorldContract.EnterOperation,
                DelveholdWorldContract.EnterIntentSchema,
                DelveholdWorldContract.EnterReceiptSchema,
                new WorldEnterIntent
                {
                    Projection = _projection
                },
                options.ClientRuntimeId,
                options.SmokeId);

            var line = $"{receipt.Status} {receipt.Value.IdempotencyKey} world={receipt.Value.WorldId} revision={receipt.Value.WorldRevision} effective={receipt.Value.EffectiveAtUtc:O}";
            var admittedAsExpected = receipt.Status == options.ExpectedStatus;
            CallDeferred(MethodName.ShowResult, line, admittedAsExpected, options.HeadlessSmoke);
        }
        catch (Exception error)
        {
            CallDeferred(MethodName.ShowResult, error.Message, false, options.HeadlessSmoke);
        }
    }

    private void ShowResult(string message, bool succeeded, bool quit)
    {
        _status.Text = succeeded ? message : "Connection failed: " + message;
        GD.Print($"DELVEHOLD_SMOKE {(succeeded ? "PASS" : "FAIL")} {message}");
        if (quit) GetTree().Quit(succeeded ? 0 : 1);
    }

    private sealed record ClientArguments(
        string Endpoint,
        string ClientRuntimeId,
        string SmokeId,
        string Projection,
        string ExpectedStatus,
        bool HeadlessSmoke)
    {
        public static ClientArguments Parse(string[] args)
        {
            var endpoint = "cultnet+tcp://127.0.0.1:4075";
            var clientId = "delvehold.godot.local";
            var smokeId = Guid.NewGuid().ToString("N");
            var projection = "hold";
            var expectedStatus = "accepted";
            var headless = false;
            for (var index = 0; index < args.Length; index++)
            {
                switch (args[index])
                {
                    case "--endpoint" when index + 1 < args.Length:
                        endpoint = args[++index];
                        break;
                    case "--client-id" when index + 1 < args.Length:
                        clientId = args[++index];
                        break;
                    case "--smoke-id" when index + 1 < args.Length:
                        smokeId = args[++index];
                        headless = true;
                        break;
                    case "--projection" when index + 1 < args.Length:
                        projection = args[++index].ToLowerInvariant();
                        break;
                    case "--expect-status" when index + 1 < args.Length:
                        expectedStatus = args[++index].ToLowerInvariant();
                        break;
                }
            }
            return new ClientArguments(endpoint, clientId, smokeId, projection, expectedStatus, headless);
        }
    }
}
