import type {
  EpiphanyCodeRef,
  NornGraphEdge,
  NornGraphLink,
  NornGraphNode,
  NornGraphsState,
} from "@gamecult/norn-viewer";

export type AuthorityOwner =
  | "godot-client"
  | "protocol"
  | "world-host"
  | "cultlib"
  | "verification"
  | "developer-tooling"
  | "modeling"
  | "norn";

export type ControlEdgeKind =
  | "calls"
  | "constructs"
  | "signals"
  | "discovers"
  | "opens-session"
  | "sends-intent"
  | "dispatches"
  | "validates"
  | "reads"
  | "writes"
  | "flushes"
  | "returns-receipt"
  | "branches"
  | "replays"
  | "rejects"
  | "waits-for"
  | "terminates"
  | "verifies"
  | "renders";

export interface OwnedGraphNode extends NornGraphNode {
  owner: AuthorityOwner;
  runtime: "godot" | "world-host" | "shared" | "tooling" | "external-library";
  code_refs: EpiphanyCodeRef[];
}

export interface TypedControlEdge extends NornGraphEdge {
  id: string;
  kind: ControlEdgeKind;
  code_refs: EpiphanyCodeRef[];
}

export interface SourceSurface {
  path: string;
  normalizedSha256: string;
  responsibility: string;
}

const refs = {
  client: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "client/Main.cs", symbol, note }),
  scene: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "client/Main.tscn", symbol, note }),
  project: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "client/project.godot", symbol, note }),
  protocol: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "src/Delvehold.Protocol/WorldContracts.cs", symbol, note }),
  host: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "src/Delvehold.WorldHost/Program.cs", symbol, note }),
  world: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "src/Delvehold.WorldHost/WorldState.cs", symbol, note }),
  meshClient: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "@cultlib/src/GameCult.Mesh/CultMeshClient.cs", symbol, note }),
  operationServer: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "@cultlib/src/GameCult.Networking/CultNetOperationServer.cs", symbol, note }),
  tcp: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "@cultlib/src/GameCult.Networking/CultNetTcpSchemaTransport.cs", symbol, note }),
  cache: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "@cultlib/src/GameCult.Mesh/CultMesh.cs", symbol, note }),
  verify: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "scripts/verify-runtime.ps1", symbol, note }),
  controlFlow: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "scripts/control-flow.ps1", symbol, note }),
  openGodot: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "scripts/open-godot.ps1", symbol, note }),
  solution: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "Delvehold.sln", symbol, note }),
  buildProps: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "Directory.Build.props", symbol, note }),
  buildTargets: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "Directory.Build.targets", symbol, note }),
  clientProject: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "client/Delvehold.Client.csproj", symbol, note }),
  protocolProject: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "src/Delvehold.Protocol/Delvehold.Protocol.csproj", symbol, note }),
  hostProject: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "src/Delvehold.WorldHost/Delvehold.WorldHost.csproj", symbol, note }),
  graph: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "modeling/control-flow/graph.ts", symbol, note }),
  graphVerify: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "modeling/control-flow/verify.ts", symbol, note }),
  norn: (symbol: string, note?: string): EpiphanyCodeRef => ({ path: "@norn/web/norn-viewer/src/lib/NornViewer.tsx", symbol, note }),
};

const architectureNodes: OwnedGraphNode[] = [
  { id: "arch-godot-project", title: "Godot application", purpose: "Own the one DELVE/HOLD presentation process and scene lifetime.", mechanism: "Godot loads Main.tscn and attaches Main.cs to the root Control.", status: "verified", owner: "godot-client", runtime: "godot", code_refs: [refs.project("run/main_scene"), refs.scene("script = ExtResource")] },
  { id: "arch-main-control", title: "Main projection controller", purpose: "Build the current interface, select DELVE or HOLD presentation, and coordinate world entry.", mechanism: "One Godot Control owns local mode widgets and one application-lifetime CultMesh client.", status: "verified", owner: "godot-client", runtime: "godot", code_refs: [refs.client("public partial class Main")] },
  { id: "arch-cultmesh-client", title: "CultMesh client session owner", purpose: "Discover the stable world authority and reuse its typed operation session.", mechanism: "CultMeshClient owns discovery, transport connectors, reconnection, correlation, and response decoding.", status: "verified", owner: "cultlib", runtime: "external-library", code_refs: [refs.meshClient("public sealed class CultMeshClient")] },
  { id: "arch-world-contract", title: "World-entry wire contract", purpose: "Name the Verse, authority runtime, operation, and typed intent/receipt schemas without owning world state.", mechanism: "Protocol DTOs cross CultMesh; they contain no persistence or simulation authority.", status: "verified", owner: "protocol", runtime: "shared", code_refs: [refs.protocol("public static class DelveholdWorldContract"), refs.protocol("public sealed class WorldEnterIntent"), refs.protocol("public sealed class WorldEnterReceipt")] },
  { id: "arch-world-host", title: "Central world host", purpose: "Own the canonical Delvehold world process, admission boundary, and local persistence lifetime.", mechanism: "A single C# process composes CultMesh storage, TCP ingress, discovery, identity, and typed operations.", status: "verified", owner: "world-host", runtime: "world-host", code_refs: [refs.host("var settings = HostSettings.Parse(args)")] },
  { id: "arch-cultmesh-ingress", title: "CultMesh ingress", purpose: "Bind loopback transport, stable authority identity, Verse catalog, and typed operation dispatch.", mechanism: "TCP schema server carries discovery, session identity, and operation envelopes without owning domain admission.", status: "verified", owner: "cultlib", runtime: "world-host", code_refs: [refs.host("TcpFramedCultNetSchemaServer"), refs.host("CultMeshSessionIdentityServer"), refs.host("CultNetOperationServer")] },
  { id: "arch-entry-admission", title: "World-entry admission", purpose: "Validate projection, serialize idempotency decisions, and author accepted or rejected operation results.", mechanism: "One semaphore protects receipt lookup and creation; the host admits only DELVE or HOLD.", status: "verified", owner: "world-host", runtime: "world-host", code_refs: [refs.host("operationGate"), refs.host("invalid-world-entry"), refs.host("idempotency-key-collision")] },
  { id: "arch-world-state", title: "Canonical first-world state", purpose: "Own the first world identity, revision, and initial fixture identifiers.", mechanism: "WorldHost alone defines and seeds DelveholdWorldState when the canonical record is absent.", status: "verified", owner: "world-host", runtime: "world-host", code_refs: [refs.world("public sealed class DelveholdWorldState"), refs.world("FirstWorld()")] },
  { id: "arch-cultcache", title: "CultCache persistence", purpose: "Persist canonical world state and entry receipts across host lifetimes.", mechanism: "CultMeshNode exposes the typed database/cache; explicit flushes make admitted records durable.", status: "verified", owner: "cultlib", runtime: "world-host", code_refs: [refs.cache("CreateNodeAsync"), refs.host("node.Database.PutAsync"), refs.host("node.FlushAsync")] },
  { id: "arch-runtime-verifier", title: "Verification harness", purpose: "Falsify source-map integrity, connection, rejection, forbidden-writer, and restart-persistence claims.", mechanism: "A bounded PowerShell harness validates the typed map, builds three projects, and drives headless Godot against disposable host state.", status: "verified", owner: "verification", runtime: "tooling", code_refs: [refs.verify("control-flow.ps1"), refs.verify("Invoke-GodotSmoke"), refs.verify("forbiddenClientWriters"), refs.controlFlow("run build"), refs.graphVerify("DELVEHOLD_CONTROL_FLOW_INVALID")] },
  { id: "arch-developer-tooling", title: "Build and launch tooling", purpose: "Give Rider, command-line verification, and the Godot editor one admitted project graph and dependency path.", mechanism: "The conventional solution selects three projects; shared MSBuild files pin CultLib; bounded launchers start the editor and focused checks.", status: "verified", owner: "developer-tooling", runtime: "tooling", code_refs: [refs.solution("Delvehold.Client"), refs.buildProps("CultLibRevision"), refs.buildTargets("VerifyCultLibRevision"), refs.openGodot("Start-Process")] },
  { id: "arch-control-flow-map", title: "Typed control-flow map", purpose: "Publish the admitted, source-addressed semantic graph for review and rendering.", mechanism: "TypeScript narrows owners and edge kinds while carrying source witnesses and the admitted executable-source inventory.", status: "active", owner: "modeling", runtime: "tooling", code_refs: [refs.graph("export const controlFlowMap"), refs.graph("sourceInventory")] },
  { id: "arch-norn-viewer", title: "Norn inspection view", purpose: "Render authority and execution graphs for human inspection without gaining command authority.", mechanism: "The React NornViewer consumes the typed projection and owns layout, motion, selection, and detail presentation only.", status: "verified", owner: "norn", runtime: "tooling", code_refs: [refs.norn("export function NornViewer"), refs.graph("nornState")] },
];

const architectureEdges: TypedControlEdge[] = [
  { id: "arch-edge-project-main", source_id: "arch-godot-project", target_id: "arch-main-control", kind: "constructs", label: "root scene", code_refs: [refs.scene("script = ExtResource")] },
  { id: "arch-edge-main-client", source_id: "arch-main-control", target_id: "arch-cultmesh-client", kind: "constructs", label: "application lifetime", code_refs: [refs.client("new CultMeshClient")] },
  { id: "arch-edge-main-contract", source_id: "arch-main-control", target_id: "arch-world-contract", kind: "sends-intent", label: "typed entry", code_refs: [refs.client("InvokeAsync<WorldEnterIntent, WorldEnterReceipt>")] },
  { id: "arch-edge-client-ingress", source_id: "arch-cultmesh-client", target_id: "arch-cultmesh-ingress", kind: "opens-session", label: "CultNet TCP", code_refs: [refs.meshClient("ConnectAsync"), refs.tcp("TcpFramedCultNetSchemaServer")] },
  { id: "arch-edge-ingress-admission", source_id: "arch-cultmesh-ingress", target_id: "arch-entry-admission", kind: "dispatches", label: "delvehold.world/enter", code_refs: [refs.host("Register<WorldEnterIntent, WorldEnterReceipt>")] },
  { id: "arch-edge-admission-world", source_id: "arch-entry-admission", target_id: "arch-world-state", kind: "reads", label: "world identity/revision", code_refs: [refs.host("node.Cache.Get<DelveholdWorldState>")] },
  { id: "arch-edge-admission-cache", source_id: "arch-entry-admission", target_id: "arch-cultcache", kind: "writes", label: "accepted receipts only", code_refs: [refs.host("node.Database.PutAsync(receiptKey, receipt)")] },
  { id: "arch-edge-host-ingress", source_id: "arch-world-host", target_id: "arch-cultmesh-ingress", kind: "constructs", label: "one host lifetime", code_refs: [refs.host("using var server") ] },
  { id: "arch-edge-host-world", source_id: "arch-world-host", target_id: "arch-world-state", kind: "constructs", label: "seed if absent", code_refs: [refs.host("DelveholdWorldState.FirstWorld()")] },
  { id: "arch-edge-host-cache", source_id: "arch-world-host", target_id: "arch-cultcache", kind: "constructs", label: "typed store", code_refs: [refs.host("CultMesh.CreateNodeAsync")] },
  { id: "arch-edge-verifier-app", source_id: "arch-runtime-verifier", target_id: "arch-godot-project", kind: "verifies", label: "headless path", code_refs: [refs.verify("$godot --headless")] },
  { id: "arch-edge-verifier-host", source_id: "arch-runtime-verifier", target_id: "arch-world-host", kind: "verifies", label: "restart and replay", code_refs: [refs.verify("Start-WorldHost 'restart'")] },
  { id: "arch-edge-tooling-client", source_id: "arch-developer-tooling", target_id: "arch-godot-project", kind: "constructs", label: "Godot build and editor", code_refs: [refs.clientProject("Godot.NET.Sdk/4.7.2"), refs.openGodot("--editor")] },
  { id: "arch-edge-tooling-host", source_id: "arch-developer-tooling", target_id: "arch-world-host", kind: "constructs", label: "focused .NET build", code_refs: [refs.hostProject("Delvehold.Protocol"), refs.solution("Delvehold.WorldHost")] },
  { id: "arch-edge-tooling-contract", source_id: "arch-developer-tooling", target_id: "arch-world-contract", kind: "constructs", label: "shared protocol build", code_refs: [refs.protocolProject("GameCult.Caching"), refs.solution("Delvehold.Protocol")] },
  { id: "arch-edge-verifier-map", source_id: "arch-runtime-verifier", target_id: "arch-control-flow-map", kind: "verifies", label: "typed graph and source-inventory integrity", code_refs: [refs.verify("control-flow.ps1') validate"), refs.graphVerify("normalizedSha256")] },
  { id: "arch-edge-norn-map", source_id: "arch-norn-viewer", target_id: "arch-control-flow-map", kind: "renders", label: "non-mutating projection", code_refs: [refs.graph("nornState")] },
];

const dataflowNodes: OwnedGraphNode[] = [
  { id: "flow-client-start", title: "Godot loads Main", purpose: "Instantiate the one client root and begin its scene lifetime.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.scene("[node name=\"Delvehold\"")] },
  { id: "flow-ready", title: "Ready", purpose: "Build local presentation and begin asynchronous world entry.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("public override void _Ready()")] },
  { id: "flow-build-ui", title: "Build interface", purpose: "Construct title, mode controls, and connection status without touching world truth.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("private void BuildInterface()")] },
  { id: "flow-mode-select", title: "Select local projection", purpose: "Switch visible DELVE/HOLD mode labels and buttons only.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("private void SelectProjection") ] },
  { id: "flow-enter", title: "Begin world entry", purpose: "Parse launch arguments, construct the application client, and invoke typed entry.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("private async Task EnterWorldAsync()")] },
  { id: "flow-discovery", title: "Discover authority", purpose: "Resolve the stable Verse and world-host runtime to the current physical route.", owner: "cultlib", runtime: "external-library", status: "verified", code_refs: [refs.meshClient("RendezvousEndpoints"), refs.meshClient("ConnectOnlineAsync")] },
  { id: "flow-catalog-response", title: "Return Verse catalog", purpose: "Publish the host route and supported document protocol to discovery callers.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("CreateCatalogResponse")] },
  { id: "flow-session-open", title: "Open identity-bound session", purpose: "Establish the reusable CultMesh documents session to the world host.", owner: "cultlib", runtime: "shared", status: "verified", code_refs: [refs.meshClient("ConnectAsync(target, CultMeshProtocols.Documents") ] },
  { id: "flow-send-entry", title: "Send entry intent", purpose: "Correlate one typed WorldEnterIntent under the caller idempotency key.", owner: "cultlib", runtime: "godot", status: "verified", code_refs: [refs.client("InvokeAsync<WorldEnterIntent, WorldEnterReceipt>"), refs.meshClient("CultNetOperationRequestMessage")] },
  { id: "flow-host-start", title: "Start world host", purpose: "Parse state/port settings and assemble the authoritative process.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("HostSettings.Parse(args)")] },
  { id: "flow-open-state", title: "Open typed state", purpose: "Create the CultMesh node over the configured CultCache path and registries.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("CreateCultCacheDocumentRegistry"), refs.host("CultMesh.CreateNodeAsync")] },
  { id: "flow-seed-world", title: "Seed world if absent", purpose: "Create the explicit first-world record once, then flush it.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("if (node.Cache.Get<DelveholdWorldState>(worldKey) is null)"), refs.world("FirstWorld()")] },
  { id: "flow-bind-ingress", title: "Bind CultMesh ingress", purpose: "Start TCP, identity, catalog, and operation handlers before readiness.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("DELVEHOLD_HOST_READY")] },
  { id: "flow-dispatch-entry", title: "Dispatch entry operation", purpose: "Decode the typed payload and route it to host-owned admission.", owner: "cultlib", runtime: "world-host", status: "verified", code_refs: [refs.operationServer("Register<TRequest, TResponse>"), refs.host("Register<WorldEnterIntent, WorldEnterReceipt>")] },
  { id: "flow-acquire-gate", title: "Serialize admission", purpose: "Prevent concurrent receipt lookup and creation from splitting idempotency authority.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("await operationGate.WaitAsync()")] },
  { id: "flow-validate-entry", title: "Validate entry", purpose: "Normalize the caller identity and admit only DELVE or HOLD projections.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("projection != \"delve\" && projection != \"hold\"")] },
  { id: "flow-invalid-reject", title: "Reject invalid entry", purpose: "Return typed rejection without persisting a receipt.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("invalid-world-entry")] },
  { id: "flow-receipt-lookup", title: "Lookup receipt", purpose: "Read the canonical receipt record for this idempotency key.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("node.Cache.Get<WorldEnterReceipt>(receiptKey)")] },
  { id: "flow-replay-accept", title: "Accept exact replay", purpose: "Return the original receipt when caller and projection match.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("Accepted(existing)")] },
  { id: "flow-collision-reject", title: "Reject key collision", purpose: "Return rejection evidence without replacing the original receipt.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("idempotency-key-collision")] },
  { id: "flow-create-receipt", title: "Create entry receipt", purpose: "Author the first accepted receipt from host-owned world identity and revision.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("var receipt = new WorldEnterReceipt")] },
  { id: "flow-persist-receipt", title: "Persist and flush receipt", purpose: "Commit the accepted receipt before reporting acceptance.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("node.Database.PutAsync(receiptKey, receipt)"), refs.host("await node.FlushAsync()")] },
  { id: "flow-return-response", title: "Return operation response", purpose: "Carry provider-authored status and typed receipt back over the reusable session.", owner: "cultlib", runtime: "shared", status: "verified", code_refs: [refs.operationServer("CultNetOperationReply<TResponse>"), refs.meshClient("CultMeshOperationResult<TResponse>")] },
  { id: "flow-show-result", title: "Show result", purpose: "Project the expected provider status into UI text or smoke exit code.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("private void ShowResult")] },
  { id: "flow-client-error", title: "Project client failure", purpose: "Convert discovery, session, or invocation exceptions into a failed local result without inventing world state.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("catch (Exception error)"), refs.client("error.Message, false")] },
  { id: "flow-client-exit", title: "Dispose client", purpose: "Release the application-lifetime CultMesh client with the scene.", owner: "godot-client", runtime: "godot", status: "verified", code_refs: [refs.client("public override void _ExitTree()")] },
  { id: "flow-host-wait", title: "Wait for stop or failure", purpose: "Keep authority alive until Ctrl+C or ingress failure terminates the process.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("Task.WhenAny(stopped.Task, server.BackgroundFailure)")] },
  { id: "flow-host-cancel", title: "Handle operator cancellation", purpose: "Convert Ctrl+C into orderly completion of the host lifetime.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("Console.CancelKeyPress"), refs.host("stopped.TrySetResult()")] },
  { id: "flow-host-failure", title: "Propagate ingress failure", purpose: "Terminate the host by throwing the captured background listener failure.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("if (server.BackgroundFailure.IsCompleted)"), refs.host("throw await server.BackgroundFailure")] },
  { id: "flow-host-terminated", title: "Host process terminates", purpose: "Dispose host-owned resources after orderly cancellation or propagate a fatal ingress error to the process boundary.", owner: "world-host", runtime: "world-host", status: "verified", code_refs: [refs.host("using var node"), refs.host("throw await server.BackgroundFailure")] },
  { id: "flow-smoke", title: "Runtime smoke sequence", purpose: "Drive accepted entry, collision rejection, invalid rejection, restart, and exact receipt replay.", owner: "verification", runtime: "tooling", status: "verified", code_refs: [refs.verify("Invoke-GodotSmoke 'first'"), refs.verify("Invoke-GodotSmoke 'collision'"), refs.verify("Invoke-GodotSmoke 'restart'")] },
  { id: "flow-map-validation", title: "Validate typed map", purpose: "Reject graph, witness, dependency-pin, inventory, or source-digest drift before compiling the runtime.", owner: "verification", runtime: "tooling", status: "verified", code_refs: [refs.verify("control-flow.ps1') validate"), refs.graphVerify("DELVEHOLD_CONTROL_FLOW_INVALID")] },
  { id: "flow-focused-build", title: "Build focused solution", purpose: "Compile the Godot client, protocol, and world host under the admitted CultLib revision.", owner: "developer-tooling", runtime: "tooling", status: "verified", code_refs: [refs.verify("dotnet build"), refs.solution("Delvehold.Client"), refs.buildProps("CultLibRoot"), refs.buildTargets("CultLib must be revision")] },
  { id: "flow-cultlib-admission", title: "Admit CultLib dependency", purpose: "Require the exact CultLib revision and a clean worktree before project references resolve.", owner: "developer-tooling", runtime: "tooling", status: "verified", code_refs: [refs.buildTargets("VerifyCultLibRevision"), refs.buildProps("CultLibRevision")] },
  { id: "flow-revision-reject", title: "Reject CultLib revision", purpose: "Fail the build when the selected CultLib checkout is not the admitted revision.", owner: "developer-tooling", runtime: "tooling", status: "verified", code_refs: [refs.buildTargets("CultLib must be revision")] },
  { id: "flow-dirty-reject", title: "Reject dirty CultLib", purpose: "Fail the build when the selected CultLib worktree contains unadmitted changes.", owner: "developer-tooling", runtime: "tooling", status: "verified", code_refs: [refs.buildTargets("CultLibRoot must be clean")] },
  { id: "flow-open-editor", title: "Open Godot editor", purpose: "Launch the admitted Godot executable against the client project with the selected CultLib worktree.", owner: "developer-tooling", runtime: "tooling", status: "verified", code_refs: [refs.openGodot("Godot_v4.7.2-stable_mono_win64.exe"), refs.openGodot("Start-Process")] },
];

const e = (id: string, source_id: string, target_id: string, kind: ControlEdgeKind, code_refs: EpiphanyCodeRef[], label?: string): TypedControlEdge => ({ id, source_id, target_id, kind, code_refs, label });

const dataflowEdges: TypedControlEdge[] = [
  e("flow-edge-start-ready", "flow-client-start", "flow-ready", "calls", [refs.client("_Ready")]),
  e("flow-edge-ready-ui", "flow-ready", "flow-build-ui", "calls", [refs.client("BuildInterface();")]),
  e("flow-edge-ready-enter", "flow-ready", "flow-enter", "calls", [refs.client("_ = EnterWorldAsync();")]),
  e("flow-edge-ui-mode", "flow-build-ui", "flow-mode-select", "signals", [refs.client("_delve.Pressed"), refs.client("_hold.Pressed")]),
  e("flow-edge-enter-mode", "flow-enter", "flow-mode-select", "calls", [refs.client("SelectProjection(options.Projection)")]),
  e("flow-edge-enter-discovery", "flow-enter", "flow-discovery", "discovers", [refs.client("RendezvousEndpoints")]),
  e("flow-edge-discovery-catalog", "flow-discovery", "flow-catalog-response", "calls", [refs.host("CultMeshVerseCatalogRequestMessage")]),
  e("flow-edge-catalog-session", "flow-catalog-response", "flow-session-open", "opens-session", [refs.host("authorityRoutes"), refs.meshClient("ConnectAsync")]),
  e("flow-edge-session-send", "flow-session-open", "flow-send-entry", "sends-intent", [refs.meshClient("session.SendCultNet(message)")]),
  e("flow-edge-host-open", "flow-host-start", "flow-open-state", "calls", [refs.host("CultMesh.CreateNodeAsync")]),
  e("flow-edge-open-seed", "flow-open-state", "flow-seed-world", "branches", [refs.host("is null")]),
  e("flow-edge-seed-bind", "flow-seed-world", "flow-bind-ingress", "calls", [refs.host("using var server")]),
  e("flow-edge-bind-catalog", "flow-bind-ingress", "flow-catalog-response", "calls", [refs.host("CreateCatalogResponse")]),
  e("flow-edge-send-dispatch", "flow-send-entry", "flow-dispatch-entry", "dispatches", [refs.operationServer("HandleAsync")]),
  e("flow-edge-dispatch-gate", "flow-dispatch-entry", "flow-acquire-gate", "calls", [refs.host("operationGate.WaitAsync")]),
  e("flow-edge-gate-validate", "flow-acquire-gate", "flow-validate-entry", "validates", [refs.host("sourceRuntimeId"), refs.host("projection")]),
  e("flow-edge-validate-invalid", "flow-validate-entry", "flow-invalid-reject", "rejects", [refs.host("invalid-world-entry")], "invalid caller or projection"),
  e("flow-edge-validate-lookup", "flow-validate-entry", "flow-receipt-lookup", "reads", [refs.host("receiptKey")], "valid entry"),
  e("flow-edge-lookup-replay", "flow-receipt-lookup", "flow-replay-accept", "replays", [refs.host("Accepted(existing)")], "exact match"),
  e("flow-edge-lookup-collision", "flow-receipt-lookup", "flow-collision-reject", "rejects", [refs.host("idempotency-key-collision")], "same key, different input"),
  e("flow-edge-lookup-create", "flow-receipt-lookup", "flow-create-receipt", "branches", [refs.host("var receipt = new WorldEnterReceipt")], "missing receipt"),
  e("flow-edge-create-persist", "flow-create-receipt", "flow-persist-receipt", "writes", [refs.host("PutAsync(receiptKey, receipt)")]),
  e("flow-edge-persist-response", "flow-persist-receipt", "flow-return-response", "returns-receipt", [refs.host("Accepted(receipt)")]),
  e("flow-edge-replay-response", "flow-replay-accept", "flow-return-response", "returns-receipt", [refs.host("Accepted(existing)")]),
  e("flow-edge-collision-response", "flow-collision-reject", "flow-return-response", "returns-receipt", [refs.host("Rejected(")]),
  e("flow-edge-invalid-response", "flow-invalid-reject", "flow-return-response", "returns-receipt", [refs.host("invalid-world-entry")]),
  e("flow-edge-response-show", "flow-return-response", "flow-show-result", "calls", [refs.client("CallDeferred(MethodName.ShowResult")]),
  e("flow-edge-enter-error", "flow-enter", "flow-client-error", "branches", [refs.client("catch (Exception error)")], "discovery, session, or invocation failure"),
  e("flow-edge-error-show", "flow-client-error", "flow-show-result", "calls", [refs.client("error.Message, false")]),
  e("flow-edge-show-exit", "flow-show-result", "flow-client-exit", "terminates", [refs.client("GetTree().Quit")], "headless smoke only"),
  e("flow-edge-scene-exit", "flow-client-start", "flow-client-exit", "terminates", [refs.client("_ExitTree")], "ordinary scene teardown"),
  e("flow-edge-bind-wait", "flow-bind-ingress", "flow-host-wait", "waits-for", [refs.host("Task.WhenAny")]),
  e("flow-edge-wait-cancel", "flow-host-wait", "flow-host-cancel", "branches", [refs.host("stopped.Task")], "Ctrl+C"),
  e("flow-edge-wait-failure", "flow-host-wait", "flow-host-failure", "branches", [refs.host("server.BackgroundFailure")], "listener failure"),
  e("flow-edge-cancel-stop", "flow-host-cancel", "flow-host-terminated", "terminates", [refs.host("stopped.TrySetResult()")], "complete wait and dispose"),
  e("flow-edge-failure-stop", "flow-host-failure", "flow-host-terminated", "terminates", [refs.host("throw await server.BackgroundFailure")], "fatal process exit"),
  e("flow-edge-smoke-start", "flow-smoke", "flow-host-start", "verifies", [refs.verify("Start-WorldHost")]),
  e("flow-edge-smoke-map", "flow-smoke", "flow-map-validation", "calls", [refs.verify("control-flow.ps1') validate")]),
  e("flow-edge-map-build", "flow-map-validation", "flow-focused-build", "calls", [refs.verify("dotnet build")]),
  e("flow-edge-smoke-client", "flow-smoke", "flow-client-start", "verifies", [refs.verify("$godot --headless")]),
  e("flow-edge-smoke-replay", "flow-smoke", "flow-replay-accept", "verifies", [refs.verify("$firstReceipt -ne $restartReceipt")]),
  e("flow-edge-smoke-invalid", "flow-smoke", "flow-invalid-reject", "verifies", [refs.verify("invalid-projection")]),
  e("flow-edge-smoke-collision", "flow-smoke", "flow-collision-reject", "verifies", [refs.verify("collision")]),
  e("flow-edge-build-admission", "flow-focused-build", "flow-cultlib-admission", "validates", [refs.buildTargets("BeforeTargets=\"ResolveProjectReferences\"")]),
  e("flow-edge-admission-revision", "flow-cultlib-admission", "flow-revision-reject", "rejects", [refs.buildTargets("found $([System.String]")], "wrong revision"),
  e("flow-edge-admission-dirty", "flow-cultlib-admission", "flow-dirty-reject", "rejects", [refs.buildTargets("CultLibStatus")], "dirty worktree"),
  e("flow-edge-admission-client", "flow-cultlib-admission", "flow-client-start", "constructs", [refs.clientProject("Godot.NET.Sdk/4.7.2")], "admitted dependency"),
  e("flow-edge-admission-host", "flow-cultlib-admission", "flow-host-start", "constructs", [refs.hostProject("OutputType>Exe")], "admitted dependency"),
  e("flow-edge-editor-client", "flow-open-editor", "flow-client-start", "constructs", [refs.openGodot("--editor")], "interactive editor projection"),
];

const architectureByFlowId: Record<string, string> = {
  "flow-client-start": "arch-godot-project",
  "flow-ready": "arch-main-control",
  "flow-build-ui": "arch-main-control",
  "flow-mode-select": "arch-main-control",
  "flow-enter": "arch-main-control",
  "flow-discovery": "arch-cultmesh-client",
  "flow-catalog-response": "arch-cultmesh-ingress",
  "flow-session-open": "arch-cultmesh-client",
  "flow-send-entry": "arch-world-contract",
  "flow-host-start": "arch-world-host",
  "flow-open-state": "arch-cultcache",
  "flow-seed-world": "arch-world-state",
  "flow-bind-ingress": "arch-cultmesh-ingress",
  "flow-dispatch-entry": "arch-cultmesh-ingress",
  "flow-acquire-gate": "arch-entry-admission",
  "flow-validate-entry": "arch-entry-admission",
  "flow-invalid-reject": "arch-entry-admission",
  "flow-receipt-lookup": "arch-cultcache",
  "flow-replay-accept": "arch-entry-admission",
  "flow-collision-reject": "arch-entry-admission",
  "flow-create-receipt": "arch-entry-admission",
  "flow-persist-receipt": "arch-cultcache",
  "flow-return-response": "arch-cultmesh-ingress",
  "flow-show-result": "arch-main-control",
  "flow-client-error": "arch-main-control",
  "flow-client-exit": "arch-main-control",
  "flow-host-wait": "arch-world-host",
  "flow-host-cancel": "arch-world-host",
  "flow-host-failure": "arch-world-host",
  "flow-host-terminated": "arch-world-host",
  "flow-smoke": "arch-runtime-verifier",
  "flow-map-validation": "arch-runtime-verifier",
  "flow-focused-build": "arch-developer-tooling",
  "flow-cultlib-admission": "arch-developer-tooling",
  "flow-revision-reject": "arch-developer-tooling",
  "flow-dirty-reject": "arch-developer-tooling",
  "flow-open-editor": "arch-developer-tooling",
};

const links: NornGraphLink[] = dataflowNodes.map((node) => ({
  dataflow_node_id: node.id,
  architecture_node_id: architectureByFlowId[node.id] ?? `unmapped:${node.id}`,
  relationship: "owned-by",
  code_refs: node.code_refs,
}));

export const sourceInventory: SourceSurface[] = [
  { path: "Delvehold.sln", normalizedSha256: "19ce0e87a3b8c7d34b957db8fa1c50f25230a849c39de6872afb81746cb1ca65", responsibility: "Rider and focused build project membership" },
  { path: "Directory.Build.props", normalizedSha256: "898df5c1ff8b0bf7110ac2e27aa585d8d241af85b718e53aaefecd9c1fc8098f", responsibility: "shared target and dependency admission defaults" },
  { path: "Directory.Build.targets", normalizedSha256: "fb703044f822d690ff3afdfa82219d43951f740834f533b7988c18e446da41a6", responsibility: "CultLib revision and cleanliness gate" },
  { path: "client/Delvehold.Client.csproj", normalizedSha256: "0a9a92a87761f2a2525a19ac73bad22c621e2640ab91127c17660e111497cf26", responsibility: "Godot client build dependencies" },
  { path: "client/Main.cs", normalizedSha256: "ea636fd09961d93991e28653f237bc1a3f52661101a4311d697b4865ba4ff23f", responsibility: "Godot client control flow" },
  { path: "client/Main.tscn", normalizedSha256: "a1c1d81dfe77e1921a0f42f0c17d7205ca5d0a0e9ec9373382a568a1885c2f55", responsibility: "Godot root scene construction" },
  { path: "client/project.godot", normalizedSha256: "41021e8586c6d4fb0a5412b4cfce3830fb24161605a95c2c31d3db4d663fd1c8", responsibility: "Godot application entry configuration" },
  { path: "scripts/control-flow.ps1", normalizedSha256: "a986cce42706574f97eed37abbc9af073d01d05333e47013e53f1c9c0f8c21e7", responsibility: "typed map validation and Norn viewer lifecycle" },
  { path: "scripts/open-godot.ps1", normalizedSha256: "de789de343d03451d4b203ce9e863cc92754e59ba6251d6581e6f2aebf81b559", responsibility: "interactive Godot editor launch" },
  { path: "scripts/verify-runtime.ps1", normalizedSha256: "5456cef5679644fd2d553a954a04a224a211d6d330f1d2533a2052699a3f7976", responsibility: "executable runtime acceptance flow" },
  { path: "src/Delvehold.Protocol/Delvehold.Protocol.csproj", normalizedSha256: "d7e665c26dedd151551db6285a753034a12bfa616a20420eb1e42225eabe74b6", responsibility: "wire contract dependencies" },
  { path: "src/Delvehold.Protocol/WorldContracts.cs", normalizedSha256: "dfe85fc3ad5ec078a2b8e490284398160fcde46a6f7728d3cbae8b813877cb13", responsibility: "typed world-entry wire contract" },
  { path: "src/Delvehold.WorldHost/Delvehold.WorldHost.csproj", normalizedSha256: "6301967b27a4319dff8631e093a3ed965f64b099222061873949928fe8504693", responsibility: "world-host build dependencies" },
  { path: "src/Delvehold.WorldHost/Program.cs", normalizedSha256: "73933d99fbdad59aa68ab1115426cb63165017201be7206c991c7b3cbf698184", responsibility: "world-host composition and admission control flow" },
  { path: "src/Delvehold.WorldHost/WorldState.cs", normalizedSha256: "fe471c7f22161e96b5a9cf0cd04e87c8f85017bdbcd3836ddf496db1a8dea120", responsibility: "canonical first-world schema and seed" },
];

export const controlFlowMap = {
  schema: "delvehold.control_flow_map.v0" as const,
  nornRevision: "14852a5ee160060e0c76872c7542af233bef7dc7" as const,
  cultLibRevision: "334e60f1928b4212a29dd8b0d19b2c099fe6365e" as const,
  architecture: { nodes: architectureNodes, edges: architectureEdges },
  dataflow: { nodes: dataflowNodes, edges: dataflowEdges },
  links,
  sourceInventory,
};

export const nornState: NornGraphsState = {
  architecture: controlFlowMap.architecture,
  dataflow: controlFlowMap.dataflow,
  links: controlFlowMap.links,
};
