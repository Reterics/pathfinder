import RouterConfig from "./components/RouterConfig.tsx";
import {BrowserProvider} from "./components/BrowserProvider.tsx";

function App() {
    return (
      <BrowserProvider>
          <RouterConfig />
      </BrowserProvider>
  )
}

export default App
