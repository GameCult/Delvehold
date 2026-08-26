import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NornViewer } from "@gamecult/norn-viewer";
import { nornState } from "./graph";
import "./style.css";

function App() {
  return (
    <NornViewer
      state={nornState}
      title="DELVE/HOLD control-flow witness"
      initialGraph="dataflow"
      focusSelection={true}
      selectionFocusMode="preview"
      layoutMode={{ architecture: "combined-force", dataflow: "layered" }}
      performance="balanced"
      motion={{ enabled: true, strength: 0.8, flow: 0.75, orbit: 0.35 }}
      graphLabels={{ architecture: "Authority body", dataflow: "Control flow" }}
      graphDescriptions={{
        architecture: "Owners and runtime organs. This graph explains who may decide or persist each result.",
        dataflow: "Executable paths from process startup through CultMesh admission, persistence, response, and verification.",
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
