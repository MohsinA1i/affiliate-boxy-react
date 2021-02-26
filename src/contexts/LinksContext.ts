import { createContextProvider } from './Contexts'

export interface ShortLink {
    domain: string
    path: string
    broken: boolean
}

export interface LongLink {
    link: string
    broken: boolean
}

export interface Product {
    image: string
    name: string
    link: string
    price: string
    availability: 'available' | 'unavailable' | 'backorder'
}

export type LinkAttributeValue = string | LongLink | ShortLink | Product | undefined

export interface LinkAttributes {
    'Short Link': ShortLink
    'Long Link': LongLink
    'Product'?: Product
    [key: string]: LinkAttributeValue
}

export interface Link {
    id: string
    attributes: LinkAttributes
}

export const [useLinks, LinksContextProvider] = createContextProvider<Link[]>([])