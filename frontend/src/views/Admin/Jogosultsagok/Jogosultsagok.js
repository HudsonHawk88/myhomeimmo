import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Jogosultsagok = (props) => {

    const defaultRole = {
        label: '',
        leiras: '',
        value: ''
    }

    const [ rolesJson, setRolesJson ] = useState([]);
    const [ role, setRole ] = useState(defaultRole);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const { addNotification } = props;


    const listRoles = () => {
        Services.listRoles().then((res) => {
            if (!res.err) {
                setRolesJson(res);
            } else {
                addNotification(res.err)
            }
        });
    }

    const init = () => {
        listRoles();
    }

    useEffect(() => {
        init();
    }, []);
    

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    }

    const getRole = (id) => {
        Services.getRole(id).then((res) => {
            if (!res.err) {
                setRole(res)
            } else {
                addNotification(res.err);
            }
        })
    }

    const handleNewClick = () => {
        setCurrentId(null);
        setRole(defaultRole);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getRole(id);
        toggleModal();
    }

    const onSave = () => {
        if (!currentId) {
            Services.addRole(role).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listRoles();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editRole(role, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listRoles();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size='xl' backdrop='static'>
                <ModalHeader>
                    {!currentId ? 'Jogosults??g hozz??ad??sa' : 'Jogosults??g m??dos??t??sa'}
                </ModalHeader>
                <ModalBody>
                    <h4>Alapadatok:</h4>
                    <br />
                    <div className="row">
                        <div className="col-md-4">
                            <Label>Jogosults??g neve: *</Label>
                            <Input
                                name="label"
                                id='label'
                                type="text"
                                onChange={(e) => handleInputChange(e, role, setRole)}
                                value={role.label}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>Le??r??s: </Label>
                            <Input
                                name="leiras"
                                id='leiras'
                                type="text"
                                onChange={(e) => handleInputChange(e, role, setRole)}
                                value={role.leiras}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>Jogosults??g: *</Label>
                            <Input
                                name="value"
                                id='value'
                                type="text"
                                onChange={(e) => handleInputChange(e, role, setRole)}
                                value={role.value}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={() => onSave()}>Ment??s</Button>
                    <Button color='secondary' onClick={() => toggleModal()}>M??gsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    const handleDeleteClick = (id) => {
        setCurrentId(id)
        toggleDeleteModal();
    }

    const onDelete = () => {
        Services.deleteRole(currentId).then((res) => {
            if (!res.err) {
                listRoles();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>
                    Jogosults??g t??rl??se
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        {'Val??ban t??r??lni k??v??nja az adott t??telt?'}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='danger' onClick={() => onDelete()}>Igen</Button>
                    <Button color='secondary' onClick={() => toggleDeleteModal()}>M??gsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    const tableIconFormatter = (cell, row, rowIndex) => {
        return (
          <React.Fragment>
            <Button
              key={rowIndex + 2}
              color="link"
              onClick={() => handleEditClick(cell)}
              hidden={row.value === 'SZUPER_ADMIN'}
            >
              <i key={rowIndex + 3} className="fas fa-pencil-alt" />
            </Button>
            <Button
              key={rowIndex + 4}
              color="link"
              hidden={row.value === 'SZUPER_ADMIN'}
              onClick={() => handleDeleteClick(cell)}
            >
              <i key={rowIndex + 5} className="fas fa-trash" />
            </Button>
          </React.Fragment>
        );
    };

    const renderTable = () =>{
        const columns = [
            {
                dataField: 'label',
                text: 'Jogosults??g neve'
            },
            {
                dataField: 'leiras',
                text: 'Le??r??s'
            },
            {
                dataField: 'value',
                text: 'Jogosults??g',
            },
            {
                dataField: 'id',
                text: 'M??veletek',
                formatter: tableIconFormatter
            }
        ];

        return (
            <BootstrapTable 
                bootstrap4
                data={rolesJson}
                columns={columns}
                keyField='id'
            />
        );
    }

    return (
        <div className='row'>
            <div className='col-md-12'>
                <Button type='button' color='success' onClick={() => handleNewClick()}> + Jogosults??g hozz??ad??sa </Button><br /><br />
                {renderModal()}
                {renderDeleteModal()}
                {renderTable()}
            </div>
        </div>
    );
}

export default Jogosultsagok;