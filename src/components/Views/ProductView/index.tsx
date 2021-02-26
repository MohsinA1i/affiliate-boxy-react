import './ProductView.sass'

import { Product } from '../../../contexts/LinksContext'

const ProductView = ({ image, name, link, price, availability }: Product) => {
    return (
        <div className='product-container'>
            <img className='product-image' src={image} alt='' />
            <div className='product-details'>
                <div className='product-title'>{name}</div>
                <a className='product-link' href={link}  target='_blank' rel='noreferrer'>{link}</a>
                <div className='product-row'>
                    <div className='product-price'>{price}</div>
                    <div className={`product-availability product-${availability}`}>{availability}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductView