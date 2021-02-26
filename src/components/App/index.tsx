import { BrowserRouter } from 'react-router-dom'

import { UserContextProvider } from '../../contexts/UserContext'
import NavView from '../Views/NavView'

const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <NavView />
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
