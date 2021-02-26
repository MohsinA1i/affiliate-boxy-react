import { createContextProvider } from './Contexts'
import { Hub, Auth } from 'aws-amplify'

interface User {
    username: string
}

export const [useUser, UserContextProvider] = createContextProvider<User | null>(async (setUser) => {
    try {
        const { username } = await Auth.currentAuthenticatedUser()
        setUser({ username: username })
    } catch (error) {}

    Hub.listen('auth', async (data) => {
        const event = data.payload.event
        if (event === 'signIn') {
            const { username } = await Auth.currentAuthenticatedUser()
            setUser({ username: username })
        } else if (event === 'signOut') {
            setUser(null)
        }
    })
})