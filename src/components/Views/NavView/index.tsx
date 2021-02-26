import './NavView.sass'
import { Switch, Route } from 'react-router-dom'

import { LinksContextProvider } from '../../../contexts/LinksContext'
import SideBar from '../../SideBar'
import UserView from '../UserView'
import AuthenticationView from '../AuthenticationView'
import LinksView from '../LinksView'

const NavView = () => {
  return (
    <div className='nav-view'>
      <SideBar/>
      <div className='content-container'>
        <Switch>
          <Route path='/signin'>
            <AuthenticationView />
          </Route>
          <Route path='/user'>
            <UserView />
          </Route>
          <Route path='/links'>
            <LinksContextProvider>
              <LinksView />
            </LinksContextProvider>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default NavView
