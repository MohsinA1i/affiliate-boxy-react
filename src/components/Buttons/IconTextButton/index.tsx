import './IconTextButton.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface Properties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IconDefinition
    text: string
}

const IconTextButton = ({ icon, text, className, ...properties }: Properties) => {

    return (
        <button className={className ? className + ' icon-text-button' : 'icon-text-button'} {...properties}>
            <FontAwesomeIcon className='button-icon' icon={icon} />
            <span>{text}</span>
        </button>
    )
}

export default IconTextButton