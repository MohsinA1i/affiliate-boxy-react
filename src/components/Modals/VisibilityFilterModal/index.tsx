import './VisibilityFilterModal.sass'

import Modal from '../Modal'
import Select from '../../FormElements/Select'
import Button from '../../Buttons/Button'

interface Properties {
    shown: boolean
    show: (hide: boolean) => void
}

const VisibilityFilterModal = ({ shown, show }: Properties) => {
    return (
        <Modal heading='Show Attribute' shown={shown} show={show}>
            <Select heading='Attribute Name' className='visibility-filter-select' options={[ 'Short Link' ]} />
            <Button className='visibility-filter-confirm' onClick={()=> { show(false) }}>Show</Button>
        </Modal>
    )
}

export default VisibilityFilterModal