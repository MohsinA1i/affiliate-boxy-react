import './ActionBar.sass'

interface Properties {
    children: React.ReactNode
    shown: boolean
}

const ActionBar = ({ children, shown }: Properties) => {
    return <div className={'action-bar' + (shown ? '' : ' action-bar-hide')}>
        {children}
    </div>
}

export default ActionBar