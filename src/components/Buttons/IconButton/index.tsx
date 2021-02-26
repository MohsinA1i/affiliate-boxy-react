import './IconButton.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

interface Properties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IconDefinition
}

const IconButton = ({icon, ...properties}: Properties) => {
    const newProperties = {...properties}
    newProperties.className = newProperties.className ? newProperties.className + ' icon-button' : 'icon-button'
    return (
        <button {...newProperties}>
            <FontAwesomeIcon icon={icon} />
        </button>
    )
}

export default IconButton