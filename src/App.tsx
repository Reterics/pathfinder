import './App.css'
import logoBackground from './assets/logo_background.png'

function App() {
  return (
      <div className="text-slate-500 dark:text-slate-800 bg-white dark:bg-slate-200 h-full">
          <img src={logoBackground} className="absolute w-full pointer-events-none z-0"
               style={{
                   height: '-webkit-fill-available'
               }} alt="Background"/>

          <div className="absolute z-50 w-full text-center text-white m-4 flex flex-col gap-y-2 bottom-px">
              <h1 className="text-xl font-bold pb-4">
                  How can we start the journey?
              </h1>
              <button type="button"
                      className="w-28 self-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-3">
                  Let's start
              </button>

          </div>
      </div>
  )
}

export default App
