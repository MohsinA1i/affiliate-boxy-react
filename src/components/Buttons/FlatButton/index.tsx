import './FlatButton.sass'

const FlatButton = ({ children, ...properties}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const _properties = {...properties}
    _properties.className = _properties.className ? _properties.className + ' flat-button' : 'flat-button'
    return (
        <button {..._properties}>{children}</button>
    )
}

export default FlatButton