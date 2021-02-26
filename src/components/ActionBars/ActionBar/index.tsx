import './ActionBar.sass'

interface Properties {
    children: React.ReactNode
}

const ActionBar = ({children}: Properties) => {
    return <div className='action-bar'>
        {children}
    </div>
}

export default ActionBar