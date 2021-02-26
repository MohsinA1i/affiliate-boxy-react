import './Modal.sass'
import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSpring, useTransition, animated } from 'react-spring'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import IconButton from '../../Buttons/IconButton'

interface Properties {
    heading: string
    children: ReactNode
    shown: Boolean
    show: (shown: boolean) => void
}

const modalRoot = document.getElementById('modal')

const Modal = ({ heading, children, shown, show }: Properties) => {
    const containerTransition = useTransition(shown, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    const modalSpring = useSpring({ transform: shown ? 'translateY(0%)' : 'translateY(-25%)' })

    return createPortal(
        <React.Fragment>
            {containerTransition.map(({ item, key, props }) => 
                item && <animated.div key={key} style={props} className='modal-container' onClick={() => { show(false) }}>
                <animated.div style={modalSpring} className='modal' onClick={(event) => { event.stopPropagation() }}>
                    <div className='modal-header'>
                        <div className='modal-heading'>{heading}</div>
                        <IconButton 
                            icon={faTimes} 
                            onClick={() => { show(false) }} className='modal-close' />
                    </div>
                    <div className='modal-body'>
                        {children}
                    </div>
                </animated.div>
            </animated.div>
            )}
        </React.Fragment>, modalRoot!)
}

export default Modal