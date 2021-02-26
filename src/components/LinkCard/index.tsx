import './LinkCard.sass'
import { useState } from 'react'
import { useTransition, animated } from 'react-spring'

import { ViewLink } from '../Views/LinksView'
import LinkAttribute from '../LinkAttribute'
import FlatButton from '../Buttons/FlatButton'

interface Properties {
    link: ViewLink
    visibilityFilter: string[]
}

const LinkCard = ({
    link,
    visibilityFilter
}: Properties) => {
    const [showAttributes, setShowAttributes] = useState(false)

    const attributes = Object.keys(link.attributes).map((name) => {
        return {
            name: name,
            value: link.attributes[name]
        }
    })
    const visibleAttributes = showAttributes ? attributes : attributes.filter(attribute => visibilityFilter.includes(attribute.name))
    const transition = useTransition(visibleAttributes, attribute => attribute.name, {
        from: { maxHeight: '0px', opacity: 0 },
        enter: { maxHeight: '72px', opacity: 1 },
        leave: { maxHeight: '0px', opacity: 0 }
    })
    transition.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    return (
        <div className={'link-card' + (link.selected ? ' link-card-selected' : '')}>
            <div className='attributes'>
                {transition.map(({ item, props, key }) =>
                    <animated.div key={key} style={props}>
                        <LinkAttribute name={item.name} value={item.value} />
                    </animated.div>
                )}
            </div>
            <div className='link-card-footer'>
                <FlatButton className='link-card-attribute-info' onClick={() => {
                    setShowAttributes(!showAttributes)
                }}>
                    {`Showing ${visibleAttributes.length} of ${attributes.length} attributes`}
                </FlatButton>
            </div>
        </div>
    )
}

export default LinkCard