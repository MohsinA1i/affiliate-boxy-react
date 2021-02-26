import { useEffect, useRef } from 'react'

export function useForwardedRef<T>(ref: ((instance: T | null) => void) | React.MutableRefObject<T | null> | null) {
    const innerRef = useRef<T>(null)
    useEffect(() => {
        if (!ref) return
        if (typeof ref === 'function') ref(innerRef.current)
        else ref.current = innerRef.current
    }, [ref])
    return innerRef;
}