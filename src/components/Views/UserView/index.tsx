import { Redirect } from 'react-router-dom'
import { Auth } from 'aws-amplify'

import { useUser } from '../../../contexts/UserContext'
import Button from '../../Buttons/Button'

const UserView = () => {
    const { state: user, update: setUser } = useUser()

    if (user) {
        return (
            <Button onClick={() => {
                    Auth.signOut()
                    setUser(null)
            }}>
                Sign Out
            </Button>
        )
    } return <Redirect to='/signin'/>
}

export default UserView