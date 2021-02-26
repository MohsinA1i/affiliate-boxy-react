import './LinksView.sass'
import { useEffect, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { faTimes, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useLinks, Link } from '../../../contexts/LinksContext'
import LinkCard from '../../LinkCard'
import Checkbox from '../../FormElements/Checkbox'
import IconButton from '../../Buttons/IconButton'
import LinkActionBar from '../../ActionBars/LinkActionBar'
import VisibilityFilterModal from '../../Modals/VisibilityFilterModal'

export interface ViewLink extends Link {
    sortId: number
    selected: boolean
}

const LinksView = () => {
    const [largeScreen, setLargeScreen] = useState(false)
    const [rightViewShown, showRightView] = useState(false)

    const { state: links, update: setLinks } = useLinks()
    const [searchFilter, setSearchFilter] = useState([
        { name: 'Long Link', value: 'iphone' },
        { name: 'Product Availability', value: 'unavailable' }
    ])
    const [visibilityFilter, setVisibilityFilter] = useState(['Short Link', 'Long Link', 'Product', 'Page'])

    const [visibiltyFilterModalShown, showVisibilityFilterModal] = useState(false)

    const linksTransition = useTransition((links as ViewLink[]), link => link.id, {
        from: { opacity: 0, maxHeight: '0px' },
        enter: { opacity: 1, maxHeight: '300px' },
        leave: { opacity: 0, maxHeight: '0px' }
    })
    linksTransition.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    const searchFiltersTransition = useTransition(searchFilter, filter => filter.name, {
        from: { opacity: 0, maxWidth: '0px' },
        enter: { opacity: 1, maxWidth: '200px' },
        leave: { opacity: 0, maxWidth: '0px' }
    })

    const visibilityFiltersTransition = useTransition(visibilityFilter, filter => filter, {
        from: { opacity: 0, maxWidth: '0px' },
        enter: { opacity: 1, maxWidth: '200px' },
        leave: { opacity: 0, maxWidth: '0px' }
    })

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(min-width: 576px)')
        const handleResize = (event: MediaQueryListEvent) => { setLargeScreen(event.matches) }
        mediaQueryList.addEventListener('change', handleResize)
        setLargeScreen(mediaQueryList.matches)
        return () => { mediaQueryList.removeEventListener('change', handleResize) }
    }, [])

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
                {!largeScreen && <IconButton className='filter-button' icon={faFilter}
                    onClick={() => { showRightView(true) }} />}
                <div className='links-container'>
                    {linksTransition.map(({ item, props, key }, index) =>
                        <animated.div key={key} style={props} className='link-container'>
                            <div className='link-check-container'>
                                <Checkbox selected={item.selected} select={(selected) => {
                                    const _links = Array.from(links as ViewLink[])
                                    _links[index].selected = selected
                                    setLinks(_links)
                                }} />
                            </div>
                            <LinkCard link={item} visibilityFilter={visibilityFilter} />
                        </animated.div>
                    )}
                </div>
                <LinkActionBar />
            </div>
            <div className='right-view'>
                <h2 className='filter-heading'>Search Filters</h2>
                <div className='filter-group'>
                    {searchFiltersTransition.map(({ item, props, key }) => {
                        <animated.div key={key} style={props}>
                            <div className='filter'>
                                <div className='filter-properties'>
                                    <div className='filter-name' >{item.name}</div>
                                    <div>{item.value}</div>
                                </div>
                                <IconButton icon={faTimes} />
                            </div>
                        </animated.div>
                    })}
                </div>
                <h2 className='filter-heading'>Visibility Filters</h2>
                <div className='filter-group'>
                    {visibilityFiltersTransition.map(({ item, props, key }) =>
                        <animated.div key={key} style={props}>
                            <div className='filter'>
                                <span>{item}</span>
                                {visibilityFilter.length > 1 && <IconButton icon={faTimes} onClick={() => {
                                    const _visibilityFilter = visibilityFilter.filter(filter => filter !== item)
                                    setVisibilityFilter(_visibilityFilter)
                                }} />}
                            </div>
                        </animated.div>
                    )}
                    <IconButton className='filter-add' icon={faPlus}
                        onClick={() => { showVisibilityFilterModal(true) }} />
                </div>
            </div>
            <VisibilityFilterModal shown={visibiltyFilterModalShown} show={showVisibilityFilterModal} />
        </div>
    )
}

export default LinksView