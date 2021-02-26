import './SideBar.sass'
import { useState } from 'react'
import { Link, useLocation, LocationState } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faSearch, faUser, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { faAccusoft } from '@fortawesome/free-brands-svg-icons'

import { useUser } from '../../contexts/UserContext'

const SideBar = () => {
    const [collapsed, collapse] = useState(true)
    const { state: user } = useUser()
    const { pathname } = useLocation<LocationState>()

    return (
        <div className={'side-bar' + (collapsed ? ' side-bar-collapsed' : '')}>
            <div className='side-bar-header' onClick={() => { collapse(!collapsed) }}>
                <FontAwesomeIcon icon={faAccusoft} className='side-menu-icon' />
                <span className='side-menu-text'><strong>Affiliate</strong>Boxy</span>
            </div>
            <Link className='side-menu-item-container' to='/links'>
                <div className={'side-menu-item' + (pathname === '/links' ? ' side-menu-item-selected' : '')}>
                    <FontAwesomeIcon icon={faList} className='side-menu-icon' />
                    <span className='side-menu-text'>Links</span>
                </div>
            </Link>
            <Link className='side-menu-item-container' to='/search'>
                <div className={'side-menu-item' + (pathname === '/search' ? ' side-menu-item-selected' : '')}>
                    <FontAwesomeIcon icon={faSearch} className='side-menu-icon' />
                    <span className='side-menu-text'>Product Search</span>
                </div>
            </Link>
            {user ? <Link className='side-menu-item-container' to='/user'>
                <div className={'side-menu-item' + ( pathname === '/user' ? ' side-menu-item-selected' : '')}>
                    <FontAwesomeIcon icon={faUser} className='side-menu-icon' />
                    <span className='side-menu-text'>{user.username}</span>
                </div>
            </Link> : <Link className='side-menu-item-container' to='/signin'>
                <div className={'side-menu-item' + ( pathname === '/signin' ? ' side-menu-item-selected' : '')}>
                    <FontAwesomeIcon icon={faSignInAlt} className='side-menu-icon' />
                    <span className='side-menu-text'>Sign In</span>
                </div>
            </Link>}
        </div>
    )
}

export default SideBar