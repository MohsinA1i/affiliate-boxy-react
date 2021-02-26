import 'react-router-dom'

declare module 'react-router-dom' {
    export interface LocationState {
        pathname: string
        search: string,
        hash:  string,
        state: {[key: string]: any}
    }
}