import './IconButton.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

interface Properties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IconDefinition
}

const IconButton = ({icon, className, ...properties}: Properties) => {
    return (
        <button className={className ? className + ' icon-button' : 'icon-button'} {...properties}>
            <FontAwesomeIcon icon={icon} />
        </button>
    )
}

export default IconButton