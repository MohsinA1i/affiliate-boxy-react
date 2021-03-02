import './FlatButton.sass'

const FlatButton = ({ children, className, ...properties}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className={className ? className + ' flat-button' : 'flat-button'} {...properties}>{children}</button>
    )
}

export default FlatButton