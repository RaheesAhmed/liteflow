import { LiteFlowProvider } from "@liteflow/core";
import { Routes } from "./routes";
import { Layout } from "./components/Layout";

function App() {
  return (
    <LiteFlowProvider>
      <Layout>
        <Routes />
      </Layout>
    </LiteFlowProvider>
  );
}

export default App;
