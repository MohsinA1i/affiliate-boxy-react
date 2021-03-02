import './Button.sass'
import { createRef, forwardRef, useEffect, useRef } from 'react'

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({children, className, ...properties}, ref) => {
    const button = ref as React.RefObject<HTMLButtonElement> || createRef()
    const ripple = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const buttonElement = button.current!
        const rippleElement = ripple.current!

        const positionRipple = (x: number, y: number) => {
            const buttonRect = buttonElement.getBoundingClientRect()
            const rippleRadius = Math.sqrt(Math.pow(buttonRect.width, 2) + Math.pow(buttonRect.height, 2))
            const rippleDiameter = rippleRadius * 2
            rippleElement.style.width = rippleDiameter + 'px'
            rippleElement.style.height = rippleDiameter + 'px'
            rippleElement.style.left = x - buttonRect.left - rippleRadius + 'px'
            rippleElement.style.top = y - buttonRect.top - rippleRadius + 'px'
        }

        const fillButton = (event: MouseEvent) => {
            positionRipple(event.clientX, event.clientY)
            buttonElement.classList.add('fill-button')
        }

        if (window.matchMedia('(hover: hover)').matches) {
            buttonElement.addEventListener('mouseenter', fillButton)
            buttonElement.addEventListener('mouseleave', (event: MouseEvent) => {
                positionRipple(event.clientX, event.clientY)
                buttonElement.classList.remove('fill-button')
            })
        } else {
            buttonElement.addEventListener('mousedown', fillButton)
            rippleElement.addEventListener('transitionend', () => {
                buttonElement.classList.remove('fill-button')
            })
        }
    }, [button])

    return (
        <button className={className ? className + ' button' : 'button'} {...properties} ref={button}>
            <div className='button-content'>{children}</div>
            <div className='button-ripple' ref={ripple} />
        </button>
    )
})

export default Button