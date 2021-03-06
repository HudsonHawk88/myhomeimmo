import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { serializer } from "@organw/wysiwyg-editor";
import { Wysiwyg } from "../../../commons/Wysiwyg";
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Gdpr = (props) => {

    const { addNotification } = props;

    const defaultGdprObj = {
        azonosito: '',
        tipus: '',
        leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>')
    }

    const [ gdprJson, setGdprJson ] = useState([]);
    const [ gdprObj, setGdprObj ] = useState(defaultGdprObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const listGdpr = () => {
        Services.listGdpr().then((res) => {
            if (!res.err) {
                setGdprJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listGdpr();
    }, []);


    const getGdpr = (id) => {
        Services.getGdpr(id).then((res) => {
            if (!res.err) {
                setGdprObj({
                    azonosito:res.azonosito,
                    tipus: res.tipus,
                    leiras: serializer.deserialize(res.leiras)
                });
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const onChangeEditor = ({ value }) => {
        setGdprObj({
          ...gdprObj,
          leiras: value,
        });
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }
    
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }

    const handleNewClick = () => {
        setCurrentId(null);
        setGdprObj(defaultGdprObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getGdpr(id);
        toggleModal();
    }

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    }

    const tableIconFormatter = (cell, row, rowIndex) => {
        return (
          <React.Fragment>
            {/* <Button
              key={rowIndex}
              color="link"
              onClick={() => handleViewClick(cell)}
            >
              <i key={rowIndex + 1} className="fas fa-eye" />
            </Button> */}
            <Button
              key={rowIndex + 2}
              color="link"
              onClick={() => handleEditClick(cell)}
            >
              <i key={rowIndex + 3} className="fas fa-pencil-alt" />
            </Button>
            <Button
              key={rowIndex + 4}
              color="link"
              onClick={() => handleDeleteClick(cell)}
            >
              <i key={rowIndex + 5} className="fas fa-trash" />
            </Button>
          </React.Fragment>
        );
    };

    const renderTable = () => {
        const columns = [
            {
                dataField: 'azonosito',
                text: 'Azonos??t??'
            },
            {
                dataField: 'tipus',
                text: 'T??pus'
            },
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'M??veletek'
            },
        ];

        return (
            <BootstrapTable
                wrapperClasses='table-responsive'
                columns={columns}
                data={gdprJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjelen??thet?? adat! :('
            />
        );
    }

    const onSave = () => {
        let kuldObj = {
            azonosito: gdprObj.azonosito,
            tipus: gdprObj.tipus,
            leiras: serializer.serialize(gdprObj.leiras)
        };
        if (!currentId) {
            Services.addGdpr(kuldObj).then((res) => {
                if (!res.err) {
                    listGdpr();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editGdpr(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listGdpr();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteIGdpr(currentId).then((res) => {
            if (!res.err) {
                listGdpr();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size='lg' backdrop='static'>
                <ModalHeader>
                    {!currentId ? 'GDPR hozz??ad??sa' : 'GDPR m??dos??t??sa'} 
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        <Label>
                            Azonos??t??:
                        </Label>
                        <Input
                            type='text'
                            name='azonosito'
                            id='azonosito'
                            value={gdprObj.azonosito}
                            onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>
                            T??pus:
                        </Label>
                        <Input
                            type='select'
                            name='tipus'
                            id='tipus'
                            value={gdprObj.tipus}
                            onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
                        >
                            <option key='' value=''>K??rj??k v??lasszon GDPR t??pust...</option>
                            <option key='adatkezelesi_nyilatkozat' value='Adatkezel??si nyilatkozat'>Adatkezel??si nyilatkozat</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>
                            Le??ras:
                        </Label>
                        <Wysiwyg fontId='gdpr' onChange={onChangeEditor} value={gdprObj.leiras} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={() => onSave()}>Ment??s</Button>
                    <Button color='secondary' onClick={() => toggleModal()}>M??gsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>
                    GDPR t??rl??se
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

    return (
        <div className='row'>
            <div className='col-md-12'>
                <Button color='success' onClick={() => handleNewClick()}>+ GDPR hozz??ad??sa</Button>
                <br /><br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default Gdpr;