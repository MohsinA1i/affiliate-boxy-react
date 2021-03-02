import Modal from '../Modal'
import Select from '../../FormElements/Select'
import Button from '../../Buttons/Button'
import Input from '../../FormElements/Input'

interface Properties {
    shown: boolean
    show: (hide: boolean) => void
}

const SearchFilterModal = ({ shown, show }: Properties) => {
    return (
        <Modal heading='Search Links' shown={shown} show={show}>
            <Select heading='Attribute Name' options={[ 'Short Link' ]} />
            <Input heading='Attribute Value' placeholder='Text or Regex'/>
            <Button onClick={()=> { show(false) }}>Search</Button>
        </Modal>
    )
}

export default SearchFilterModal