import logoBackground from './assets/logo_background.png'
import RouterConfig from "./components/RouterConfig.tsx";

function App() {
  return (
      <div className="text-slate-500 dark:text-slate-800 bg-white dark:bg-slate-200 h-full">
          <img src={logoBackground} className="absolute w-full pointer-events-none z-0 mt-[66px]"
               style={{
                   height: '-webkit-fill-available'
               }} alt="Background"/>
          <RouterConfig />
      </div>
  )
}

export default App
