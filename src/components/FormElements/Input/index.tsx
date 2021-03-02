import './Input.sass'
import { forwardRef } from 'react'

interface Properties {
    heading: string
    placeholder?: string
    className?: string
}

const Input = forwardRef<HTMLInputElement, Properties>(({ heading, placeholder, className }, ref) => {
    return (
        <div className={className ? className + ' input-group' : 'input-group'}>
            {heading && <div className='input-heading'>{heading}</div>}
            <input className='input' placeholder={placeholder} ref={ref} />
        </div>
    )
})

export default Input