import './Select.sass'
import { forwardRef } from 'react'

interface Properties extends React.SelectHTMLAttributes<HTMLSelectElement> {
    heading: string
    options: string[]
    className?: string
}

const Select = forwardRef<HTMLSelectElement, Properties>(({ heading, options, className }, ref) => {
    return (
        <div className={className}>
            {heading && <div className='select-heading'>{heading}</div>}
            <select className='select' ref={ref}>
                {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    )
})

export default Select