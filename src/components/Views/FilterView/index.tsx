import './FilterView.sass'
import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import VisibilityFilterModal from '../../Modals/VisibilityFilterModal'
import SearchFilterModal from '../../Modals/SearchFilterModal'
import IconButton from '../../Buttons/IconButton'

interface SearchFilter {
    name: string
    value: string
}

interface Properties {
    searchFilters: SearchFilter[]
    setSearchFilters: (searchFilters: SearchFilter[]) => void
    visibilityFilters: string[]
    setVisibilityFilters: (visibilityFilters: string[]) => void
}

const FilterView = ({ searchFilters, setSearchFilters, visibilityFilters, setVisibilityFilters }: Properties) => {
    const [visibiltyFilterModalShown, showVisibilityFilterModal] = useState(false)
    const [searchFilterModalShown, showSearchFilterModal] = useState(false)

    const searchFiltersTransition = useTransition(searchFilters, filter => filter.name, {
        from: { opacity: 0, maxWidth: '0px' },
        enter: { opacity: 1, maxWidth: '400px' },
        leave: { opacity: 0, maxWidth: '0px' }
    })

    const visibilityFiltersTransition = useTransition(visibilityFilters, filter => filter, {
        from: { opacity: 0, maxWidth: '0px' },
        enter: { opacity: 1, maxWidth: '200px' },
        leave: { opacity: 0, maxWidth: '0px' }
    })

    return (
        <React.Fragment>
            <h2 className='filter-heading'>Search Filters</h2>
            <div className='filter-group'>
                {searchFiltersTransition.map(({ item, props, key }, index) =>
                    <animated.div key={key} style={props}>
                        <div className='filter-tag'>
                            <div className='filter-tag-text' >{item.name}</div>
                            <FontAwesomeIcon className='filter-tag-icon' icon={faChevronRight} />
                            <div className='filter-tag-text'>{item.value}</div>
                            <IconButton className='filter-tag-icon' icon={faTimes} onClick={() => {
                                const _searchFilters = Array.from(searchFilters)
                                _searchFilters.splice(index, 1)
                                setSearchFilters(_searchFilters)
                            }} />
                        </div>
                    </animated.div>
                )}
                <IconButton className='filter-add-tag' icon={faPlus}
                    onClick={() => { showSearchFilterModal(true) }} />
            </div>
            <h2 className='filter-heading'>Visibility Filters</h2>
            <div className='filter-group'>
                {visibilityFiltersTransition.map(({ item, props, key }, index) =>
                    <animated.div key={key} style={props}>
                        <div className='filter-tag'>
                            <span className='filter-tag-text'>{item}</span>
                            {visibilityFilters.length > 1 && <IconButton className='filter-tag-icon' icon={faTimes} onClick={() => {
                                const _visibilityFilters = Array.from(visibilityFilters)
                                _visibilityFilters.splice(index, 1)
                                setVisibilityFilters(_visibilityFilters)
                            }} />}
                        </div>
                    </animated.div>
                )}
                <IconButton className='filter-add-tag' icon={faPlus}
                    onClick={() => { showVisibilityFilterModal(true) }} />
            </div>
            <VisibilityFilterModal shown={visibiltyFilterModalShown} show={showVisibilityFilterModal} />
            <SearchFilterModal shown={searchFilterModalShown} show={showSearchFilterModal} />
        </React.Fragment>
    )
}

export default FilterView