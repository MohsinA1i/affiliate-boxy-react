import './EditAttributeModal.sass'

import Modal from '../Modal'
import { LinkAttributeValue  } from '../../../contexts/LinksContext'
import Button from '../../Buttons/Button'

interface Properties {
    name: string
    value: LinkAttributeValue
    shown: boolean
    show: (hide: boolean) => void
}

const EditAttributeModal = ({  shown, show }: Properties) => {
    return (
        <Modal heading='Edit Attribute' shown={shown} show={show}>
            
            <Button className='add-attribute' onClick={()=> { show(false) }}>Confirm</Button>
        </Modal>
    )
}

export default EditAttributeModal