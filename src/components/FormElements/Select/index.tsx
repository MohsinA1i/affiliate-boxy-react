import './Select.sass'
import { forwardRef } from 'react'

interface Properties {
    heading: string
    options: string[]
    placeholder?: string
    className?: string
}

const Select = forwardRef<HTMLSelectElement, Properties>(({ heading, options, placeholder, className }, ref) => {
    return (
        <div className={className ? className + ' select-group' : 'select-group'}>
            {heading && <div className='select-heading'>{heading}</div>}
            <select className='select' placeholder={placeholder} ref={ref}>
                {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    )
})

export default Select