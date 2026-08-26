import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { controlFlowMap } from "./graph";

const mapRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(mapRoot, "../..");
const failures: string[] = [];
const witnessedLocalPaths = new Set<string>();
const nornRoot = process.env.DELVEHOLD_NORN_ROOT ?? resolve(repoRoot, "../Norn");
const cultLibRoot = process.env.DELVEHOLD_CULTLIB_ROOT ?? resolve(repoRoot, "../CultLib-aetheria-authority");

validateDependency("Norn", nornRoot, controlFlowMap.nornRevision);
validateDependency("CultLib", cultLibRoot, controlFlowMap.cultLibRevision);
const buildProps = readFileSync(resolve(repoRoot, "Directory.Build.props"), "utf8");
if (!buildProps.includes(`<CultLibRevision>${controlFlowMap.cultLibRevision}</CultLibRevision>`)) {
  failures.push("The control-flow CultLib pin disagrees with Directory.Build.props.");
}

const architectureIds = validateGraph("architecture", controlFlowMap.architecture);
const dataflowIds = validateGraph("dataflow", controlFlowMap.dataflow);
const linkKeys = new Set<string>();
for (const link of controlFlowMap.links) {
  const key = `${link.dataflow_node_id}::${link.architecture_node_id}`;
  if (linkKeys.has(key)) failures.push(`Duplicate cross-link '${key}'.`);
  linkKeys.add(key);
  if (!dataflowIds.has(link.dataflow_node_id)) failures.push(`Cross-link '${key}' has no dataflow node.`);
  if (!architectureIds.has(link.architecture_node_id)) failures.push(`Cross-link '${key}' has no architecture node.`);
  validateRefs(`cross-link '${key}'`, link.code_refs ?? []);
}

const expectedSources = collectExecutableSources();
const inventoriedSources = new Set(controlFlowMap.sourceInventory.map((source) => normalize(source.path)));
for (const path of expectedSources) {
  if (!inventoriedSources.has(path)) failures.push(`Executable source '${path}' is missing from sourceInventory.`);
}
for (const path of inventoriedSources) {
  if (!expectedSources.has(path)) failures.push(`sourceInventory contains stale or out-of-scope path '${path}'.`);
  if (!witnessedLocalPaths.has(path)) failures.push(`Inventoried source '${path}' is not cited by any graph node, edge, or cross-link.`);
}

for (const source of controlFlowMap.sourceInventory) {
  const absolute = resolve(repoRoot, source.path);
  if (!existsSync(absolute)) {
    failures.push(`Inventoried source '${source.path}' does not exist.`);
    continue;
  }
  const actual = normalizedSha256(readFileSync(absolute, "utf8"));
  if (actual !== source.normalizedSha256) {
    failures.push(`Source drift '${source.path}': expected ${source.normalizedSha256}, actual ${actual}. Review the graph, then admit the new hash.`);
  }
}

if (failures.length > 0) {
  console.error("DELVEHOLD_CONTROL_FLOW_INVALID");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`DELVEHOLD_CONTROL_FLOW_VALID architecture=${architectureIds.size}/${controlFlowMap.architecture.edges.length} dataflow=${dataflowIds.size}/${controlFlowMap.dataflow.edges.length} links=${controlFlowMap.links.length} sources=${expectedSources.size}`);

function validateGraph(
  name: string,
  graph: typeof controlFlowMap.architecture,
): Set<string> {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  for (const node of graph.nodes) {
    if (!node.id.trim() || !node.title.trim() || !node.purpose.trim() || !node.owner) {
      failures.push(`${name} node '${node.id || "<missing>"}' lacks required typed identity, title, purpose, or owner.`);
    }
    if (nodeIds.has(node.id)) failures.push(`Duplicate ${name} node '${node.id}'.`);
    nodeIds.add(node.id);
    validateRefs(`${name} node '${node.id}'`, node.code_refs);
  }
  for (const edge of graph.edges) {
    if (edgeIds.has(edge.id)) failures.push(`Duplicate ${name} edge '${edge.id}'.`);
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source_id)) failures.push(`${name} edge '${edge.id}' has missing source '${edge.source_id}'.`);
    if (!nodeIds.has(edge.target_id)) failures.push(`${name} edge '${edge.id}' has missing target '${edge.target_id}'.`);
    validateRefs(`${name} edge '${edge.id}'`, edge.code_refs);
  }
  return nodeIds;
}

function validateRefs(scope: string, refs: readonly { path: string; symbol?: string | null }[]) {
  if (refs.length === 0) failures.push(`${scope} has no source witness.`);
  for (const ref of refs) {
    const normalizedPath = normalize(ref.path);
    if (!normalizedPath.startsWith("../") && !normalizedPath.startsWith("@")) witnessedLocalPaths.add(normalizedPath);
    const absolute = resolveWitnessPath(normalizedPath);
    if (!existsSync(absolute)) {
      failures.push(`${scope} references missing source '${ref.path}'.`);
      continue;
    }
    if (ref.symbol && !readFileSync(absolute, "utf8").includes(ref.symbol)) {
      failures.push(`${scope} cannot find witness '${ref.symbol}' in '${ref.path}'.`);
    }
  }
}

function collectExecutableSources(): Set<string> {
  const paths = new Set<string>();
  collect(resolve(repoRoot, "client"), new Set([".cs", ".csproj", ".godot", ".tscn"]), paths);
  collect(resolve(repoRoot, "src"), new Set([".cs", ".csproj"]), paths);
  collectTopLevel(resolve(repoRoot, "scripts"), new Set([".ps1"]), paths);
  collectTopLevel(repoRoot, new Set([".sln", ".props", ".targets"]), paths);
  return paths;
}

function collect(directory: string, extensions: Set<string>, output: Set<string>) {
  for (const name of readdirSync(directory)) {
    if (["bin", "obj", ".godot"].includes(name)) continue;
    const absolute = resolve(directory, name);
    if (statSync(absolute).isDirectory()) collect(absolute, extensions, output);
    else if (extensions.has(name.slice(name.lastIndexOf(".")))) output.add(normalize(relative(repoRoot, absolute)));
  }
}

function normalizedSha256(content: string): string {
  return createHash("sha256").update(content.replace(/\r\n/g, "\n")).digest("hex");
}

function collectTopLevel(directory: string, extensions: Set<string>, output: Set<string>) {
  for (const name of readdirSync(directory)) {
    const absolute = resolve(directory, name);
    if (statSync(absolute).isFile() && extensions.has(name.slice(name.lastIndexOf(".")))) {
      output.add(normalize(relative(repoRoot, absolute)));
    }
  }
}

function resolveWitnessPath(path: string): string {
  if (path.startsWith("@cultlib/")) return resolve(cultLibRoot, path.slice("@cultlib/".length));
  if (path.startsWith("@norn/")) return resolve(nornRoot, path.slice("@norn/".length));
  return resolve(repoRoot, path);
}

function validateDependency(name: string, root: string, expectedRevision: string) {
  const git = process.env.DELVEHOLD_GIT ?? "git";
  try {
    const actual = execFileSync(git, ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    if (actual !== expectedRevision) failures.push(`${name} revision '${actual}' is not admitted '${expectedRevision}'.`);
    const status = execFileSync(git, ["-C", root, "status", "--porcelain", "--untracked-files=normal"], { encoding: "utf8" }).trim();
    if (status) failures.push(`${name} worktree '${root}' is dirty.`);
  } catch (error) {
    failures.push(`Cannot verify ${name} worktree '${root}': ${error instanceof Error ? error.message : String(error)}.`);
  }
}

function normalize(path: string): string {
  return path.replaceAll("\\", "/");
}
