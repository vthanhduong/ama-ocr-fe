import { ToastContainer } from 'react-toastify'
import './App.css'

function App({Children}) {
  return (
    <div className="App bg-white text-black">
      <Children/>
      <ToastContainer/>
    </div>
  )
}

export default App
