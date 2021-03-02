import './LinksView.sass'
import { useEffect, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { faChevronLeft, faFilter, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'

import { useLinks, Link } from '../../../contexts/LinksContext'
import LinkCard from '../../LinkCard'
import Checkbox from '../../FormElements/Checkbox'
import LinkActionBar from '../../ActionBars/LinkActionBar'
import FilterView from '../FilterView'
import IconTextButton from '../../Buttons/IconTextButton'

export interface ViewLink extends Link {
    sortId: number
    selected: boolean
}

const LinksView = () => {
    const [rightViewShown, showRightView] = useState(false)
    const { state: links, update: setLinks } = useLinks()
    const [searchFilters, setSearchFilters] = useState([
        { name: 'Long Link', value: 'iphone' },
        { name: 'Product Availability', value: 'unavailable' }
    ])
    const [visibilityFilters, setVisibilityFilters] = useState(['Short Link', 'Long Link', 'Product', 'Page'])

    const linksTransition = useTransition((links as ViewLink[]), link => link.id, {
        from: { opacity: 0, maxHeight: '0px' },
        enter: { opacity: 1, maxHeight: '300px' },
        leave: { opacity: 0, maxHeight: '0px' }
    })
    linksTransition.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    useEffect(() => {
        const links: Link[] = []
        for (let i = 0; i < 5; i++)
            links.push({
                id: i.toString(),
                attributes: {
                    'Short Link': {
                        domain: 'amzn.to',
                        path: '/w4ry',
                        broken: false
                    },
                    'Long Link': {
                        link: 'https://www.amazon.com/Acer-SB220Q-Ultra-Thin-Frame-Monitor/dp/B07CVL2D2S',
                        broken: false
                    },
                    'Page': 'testsite.com/home',
                    'Product': {
                        image: 'https://dummyimage.com/1024x768/ffffff/000000.png',
                        name: 'Acer SB220Q bi 21.5 Inches Full HD (1920 x 1080) IPS Ultra-Thin Zero Frame Monitor (HDMI & VGA Port), Black',
                        link: 'https://www.amazon.com/Acer-SB220Q-Ultra-Thin-Frame-Monitor/dp/B07CVL2D2S',
                        price: '$93.99',
                        availability: 'unavailable'
                    }
                }
            })
        setLinks(links)
    }, [setLinks])

    return (
        <div className={'links-view' + (rightViewShown ? ' slide' : '')}>
            <div className='left-view'>
                <div className='links-container'>
                    <div className='link-buttons'>
                        <IconTextButton icon={faSortAmountDown} text='Sort' />
                        <IconTextButton className='filter-button' icon={faFilter} text='Filter' 
                            onClick={() => { showRightView(true) }} />
                    </div>
                    {linksTransition.map(({ item, props, key }, index) =>
                        <animated.div key={key} style={props} className='link-container'>
                            <div className='link-check-container'>
                                <Checkbox selected={item.selected} select={(selected) => {
                                    const _links = Array.from(links as ViewLink[])
                                    _links[index].selected = selected
                                    setLinks(_links)
                                }} />
                            </div>
                            <LinkCard link={item} visibilityFilter={visibilityFilters} />
                        </animated.div>
                    )}
                </div>
                <LinkActionBar />
            </div>
            <div className='right-view'>
                <IconTextButton className='right-view-close' icon={faChevronLeft} text='Back' onClick={() => { showRightView(false) }} />
                <FilterView searchFilters={searchFilters} setSearchFilters={setSearchFilters}
                    visibilityFilters={visibilityFilters} setVisibilityFilters={setVisibilityFilters} />
            </div>
        </div>
    )
}

export default LinksView