import React from "react";

type Module = any;
type ModuleArray = { name: string; content: any }[];
type ModuleMap = { [moduleName: string]: Module };
type ModuleImporter = () => Promise<Module>;

const ModuleLoaderContext = React.createContext<ModuleMap | null>(null);

function moduleArrayToMap(modules: ModuleArray) {
  return modules.reduce<ModuleMap>(
    (moduleMap, module) => ({
      ...moduleMap,
      [module.name]: module.content,
    }),
    {}
  );
}

function ModuleLoader({
  imports,
  children,
}: {
  imports: {
    // noinspection JSUnusedLocalSymbols (jetbrains bug)
    [name: string]: ModuleImporter;
  };
  children: React.ReactNode;
}) {
  const [modules, setModules] = React.useState<ModuleMap | null>(null);

  React.useEffect(() => {
    Promise.all(
      Object.keys(imports).map(async (importName) => ({
        name: "react-flow-renderer",
        content: await imports[importName](),
      }))
    ).then(
      (modules) => setModules(moduleArrayToMap(modules)),
      (err) => {
        throw err;
      }
    );
    return () => setModules(null);
  }, [imports]);

  return (
    <ModuleLoaderContext.Provider value={modules}>
      {modules != null ? children : "Loading modules"}
    </ModuleLoaderContext.Provider>
  );
}

function useModuleLoader(importName: string) {
  console.log("useModuleLoader called");
  const imports = React.useContext(ModuleLoaderContext);
  if (imports == null) {
    throw new Error(
      "Be sure to use useModuleLoader in a component wrapped in ModuleLoader"
    );
  }
  if (imports[importName] == null) {
    throw new Error(
      `Cannot find ${importName}, is it declared in the 'imports' prop of the ModuleLoader ?`
    );
  }
  return imports[importName];
}

export { ModuleLoader, useModuleLoader };
