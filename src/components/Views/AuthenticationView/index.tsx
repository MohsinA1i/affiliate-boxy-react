import './AuthenticationView.sass'
import { Redirect } from 'react-router-dom'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'

import { useUser } from '../../../contexts/UserContext'

const AuthenticationView = () => {
    const { state: user } = useUser()

    if (user) return <Redirect to='/user'/>
    else return <AmplifyAuthenticator/>
}

export default AuthenticationView