import React, { useLayoutEffect, useRef } from 'react'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Checkbox.sass'

interface Properties {
    selected: boolean
    select: (selected: boolean) => void
    className?: string
}

const Checkbox = ({selected, select, className}: Properties) => {
    const checkbox = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
        checkbox.current!.checked = selected
    }, [selected])

    return (
        <div className='checkbox-container'>
            <input type='checkbox' onChange={(event => {
                select(event.currentTarget.checked)
            })} className='checkbox' ref={checkbox} />
            <div className={'custom-checkbox' + (className ? ' ' + className : '')}>
                <FontAwesomeIcon className='custom-checkbox-icon' icon={faCheck}/>
            </div>
        </div>
    )
}

export default Checkbox