import { ModuleLoader } from "~/moduleLoader";
import Flow from "~/components/flow";

// @ts-ignore
import { getReactFlowRenderer } from "../../esm-module";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4", height: "90vh", width: "90vw"}}>
      <h1>Remix ESM modules workaround</h1>
      <ModuleLoader imports={{ "react-flow-renderer": getReactFlowRenderer }}>
        <Flow />
      </ModuleLoader>
    </div>
  );
}
