import './LinkActionBar.sass'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCopy, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { useTransition, animated } from 'react-spring'

import { useLinks } from '../../../contexts/LinksContext'
import { ViewLink } from '../../Views/LinksView'
import ActionBar from '../ActionBar'
import Checkbox from '../../FormElements/Checkbox'
import IconButton from '../../Buttons/IconButton'

const LinkActionBar = () => {
    const { state: links, update: setLinks } = useLinks()
    const selectedCount = links.filter(link => (link as ViewLink).selected).length

    const actions = []
    if (selectedCount > 0) {
        actions.push('delete')
        actions.push('copy')
        if (selectedCount === 1) actions.push('edit')
    }
    const transition = useTransition(actions, action => action, {
        from: { opacity: 0, maxWidth: '0px' },
        enter: { opacity: 1, maxWidth: '46px' },
        leave: { opacity: 0, maxWidth: '0px' },
    })
    transition.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    return (
        <ActionBar shown={selectedCount > 0}>
            <div className='link-selector'>
                <Checkbox selected={selectedCount === links.length} select={(selected) => {
                    const _links = (links as ViewLink[]).map(link => {
                        link.selected = selected
                        return link
                    })
                    setLinks(_links)
                }} />
                <span>{selectedCount} of {links.length} Selected</span>
            </div>
            <div className='link-actions'>
                {transition.map(({ item, props, key }) => {
                    let icon, onClick
                    if (item === 'edit') {
                        icon = faPencilAlt
                        onClick = () => {  }
                    } else if (item === 'copy') {
                        icon = faCopy
                    } else if (item === 'delete') {
                        icon = faTrash
                        onClick = () => {
                            const _links = (links as ViewLink[]).filter(link => !link.selected)
                            setLinks(_links)
                        }
                    }

                    return <animated.div key={key} style={props} className='link-action'>
                        <IconButton icon={icon as IconDefinition} onClick={onClick} />
                    </animated.div>
                })}
            </div>
        </ActionBar>
    )
}

export default LinkActionBar