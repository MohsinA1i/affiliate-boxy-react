import './LinkAttribute.sass'

import { LinkAttributeValue, LongLink, ShortLink, Product } from '../../contexts/LinksContext'
import FlatButton from '../Buttons/FlatButton'

interface Properties {
    name: string
    value: LinkAttributeValue
}

const LinkAttribute = ({ name, value }: Properties) => {
    let status
    if (name === 'Short Link') {
        const link = value as ShortLink
        value = link.domain + link.path
        if (link.broken) status = 'error'
    } else if (name === 'Long Link') {
        const link = value as LongLink
        value = link.link
        if (link.broken) status = 'error'
    } else if (name === 'Product') {
        const product = value as Product
        value = product.name
        if (product.availability === 'unavailable') status = 'error'
        else if (product.availability === 'backorder') status = 'warning'
    }

    return (
        <div key={name} className={'attribute' + (status ? ' attribute-' + status : '')}>
            <span className='attribute-name'>{name}</span>
            <span className='attribute-value'>{value}</span>
            {name === 'Product' && <FlatButton className='attribute-button'>
                View Product
            </FlatButton>}
        </div>
    )
}

export default LinkAttribute