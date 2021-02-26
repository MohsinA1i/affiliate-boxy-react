import './Input.sass'
import React, { forwardRef } from 'react'

interface Properties extends React.InputHTMLAttributes<HTMLInputElement> {
    heading: string
    className?: string
}

const Input = forwardRef<HTMLInputElement, Properties>(({ heading, className }, ref) => {
    return (
        <div className={className}>
            {heading && <h3 className='input-heading'>{heading}</h3>}
            <input className='input' ref={ref} />
        </div>
    )
})

export default Input