import { createContext, useContext, useEffect, useState } from 'react'

export function createContextProvider<T>(initial: T | ((update: React.Dispatch<React.SetStateAction<T>>) => void)) {
  const defaultValue = (typeof initial === 'function' ? null : initial) as T
  const defaultUpdate: React.Dispatch<React.SetStateAction<T>> = () => { }
  const Context = createContext({
    state: defaultValue,
    update: defaultUpdate,
  })

  const Provider = (properties: React.PropsWithChildren<{}>) => {
    const [state, update] = useState(defaultValue)
    useEffect(() => {
      if (typeof initial === 'function') 
        (initial as (update: React.Dispatch<React.SetStateAction<T>>) => void)(update)
    }, [])
    return <Context.Provider value={{ state, update }} {...properties} />
  }

  const UseContext = () => useContext(Context)

  return [UseContext, Provider] as const
}
