import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Supports weights 100-900
import "@fontsource-variable/inter";
import "./index.css";
import { Web3Provider } from "./components/Web3Provider.tsx";

createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <App />
  </Web3Provider>
);
