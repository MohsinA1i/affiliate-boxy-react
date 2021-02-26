import './ConnectedElements.sass'
import { cloneElement } from 'react'

interface ReactElementWithRef<T> extends React.ReactElement {
    ref: React.RefObject<T>
}

interface Properties {
    children: React.ReactElement[]
}

const ConnectedElements = ({ children }: Properties) => {

    return (
        <div className='connected-elements'>
            {(children as ReactElementWithRef<HTMLElement>[]).map((element, index) => {
                const properties: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> = {
                    key: index,
                    className: element.props.className || ''
                }
                if (index === children.length - 1) properties.className += ' connected-element-right'
                else if (index === 0) properties.className += ' connected-element-left'
                else properties.className += ' connected-element-center'
                return cloneElement(element, properties)
            })}
        </div>
    )
}

export default ConnectedElements