import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { serializer } from "@organw/wysiwyg-editor";
import { Wysiwyg } from "../../../commons/Wysiwyg";

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const MyArtAltalanos = (props) => {

    const defaultMyArtAltalanosObj = {
        azonosito: '',
        nev: '',
        leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>')
    }

    const [ myArtAltalanosJson, setMyArtAltalanosJson ] = useState([]);
    const [ myArtAltalanosObj, setMyArtAltalanosObj ] = useState(defaultMyArtAltalanosObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const { addNotification } = props;

    const listAltalanos= () => {
        Services.listAltalanos().then((res) => {
            if (!res.err) {
                setMyArtAltalanosJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listAltalanos();
    }, []);

    const getAltalanos = (id) => {
        Services.getAltalanos(id).then((res) => {
            if (!res.err) {
                setMyArtAltalanosObj({
                    azonosito:res.azonosito,
                    nev: res.nev,
                    leiras: serializer.deserialize(res.leiras)
                });
            } else {
                addNotification('error', res.err);
            }
        });
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }
    
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }

    const handleNewClick = () => {
        setCurrentId(null);
        setMyArtAltalanosObj(defaultMyArtAltalanosObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getAltalanos(id);
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
                dataField: 'nev',
                text: 'N??v'
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
                data={myArtAltalanosJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjelen??thet?? adat! :('
            />
        );
    }

    const onSave = () => {
        let kuldObj = {
            azonosito: myArtAltalanosObj.azonosito,
            nev: myArtAltalanosObj.nev,
            leiras: serializer.serialize(myArtAltalanosObj.leiras)
        };
        if (!currentId) {
            Services.addAltalanos(kuldObj).then((res) => {
                if (!res.err) {
                    listAltalanos();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editAltalanos(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listAltalanos();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteAltalanos(currentId).then((res) => {
            if (!res.err) {
                listAltalanos();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const onChangeEditor = ({ value }) => {
        setMyArtAltalanosObj({
          ...myArtAltalanosObj,
          leiras: value,
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size='lg' backdrop='static'>
                <ModalHeader>
                    {!currentId ? 'MyArt ??ltal??nos bejegyz??s hozz??ad??sa' : 'MyArt ??ltal??nos bejegyz??s m??dos??t??sa'} 
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
                            value={myArtAltalanosObj.azonosito}
                            onChange={(e) => handleInputChange(e, myArtAltalanosObj, setMyArtAltalanosObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            N??v:
                        </Label>
                        <Input
                            type='text'
                            name='nev'
                            id='nev'
                            value={myArtAltalanosObj.nev}
                            onChange={(e) => handleInputChange(e, myArtAltalanosObj, setMyArtAltalanosObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Leiras:
                        </Label>
                        <Wysiwyg fontId='myArtAltalanos' onChange={onChangeEditor} value={myArtAltalanosObj.leiras} />
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
                    MyArt ??ltal??nos bejegyz??s t??rl??se
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
                <Button color='success' onClick={() => handleNewClick()}>+ MyArt ??ltal??nos bejegyz??s hozz??ad??sa</Button>
                <br /><br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default MyArtAltalanos;