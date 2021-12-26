import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDropzone } from 'react-dropzone';
import { serializer } from "@organw/wysiwyg-editor";
import { Wysiwyg } from "../../../commons/Wysiwyg";
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Rolunk = (props) => {

    const defaultRolunkObj = {
        azonosito: '',
        kep: [],
        nev: '',
        beosztas: '',
        email: '',
        telefon: '',
        leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>')
    }

    const [ rolunkJson, setRolunkJson ] = useState([]);
    const [ rolunkObj, setRolunkObj ] = useState(defaultRolunkObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const listRolunk= () => {
        Services.listRolunk().then((res) => {
            if (!res.err) {
                setRolunkJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listRolunk();
    }, []);

    const getRolunk = (id) => {
        Services.getRolunk(id).then((res) => {
            if (!res.err) {
                setRolunkObj({
                    azonosito: res.azonosito,
                    kep: res.kep,
                    nev: res.nev,
                    beosztas: res.beosztas,
                    email: res.email,
                    telefon: res.telefon,
                    leiras: serializer.deserialize(res.leiras)
                });
            } else {
                addNotification('error', res.err);
            }
        });
    }


    const onChangeEditor = ({ value }) => {
        setRolunkObj({
          ...rolunkObj,
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
        setRolunkObj(defaultRolunkObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getRolunk(id);
        toggleModal();
    }

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        toggleDeleteModal();
    }

    const MyDropzone = () => {
        const imageStyle = {
            // maxHeight: '100%',
            maxWidth: '50%'
        }
        let kep = {}
        const onDrop = useCallback((acceptedFiles) => {
            acceptedFiles.forEach((file) => {
            let base64 = ''
              const reader = new FileReader()
        
              reader.onabort = () => console.log('file reading was aborted')
              reader.onerror = () => console.log('file reading has failed')
              reader.onload = (event) => {
              // Do whatever you want with the file contents
              base64 = event.target.result;
                kep = {
                    src: base64,
                    title: file.name,
                    isCover: false
                }
                
                setRolunkObj({
                    ...rolunkObj,
                    kep: [...rolunkObj.kep, kep]
                })
              }
              reader.readAsDataURL(file)
            })
          }, [])
          const {getRootProps, getInputProps} = useDropzone({onDrop})
          return (
            <React.Fragment>
                <div hidden={rolunkObj.kep.length > 0} {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Kattintson ide a kép feltöltéséhez...</p>
                </div>
                <div className='row'>
                    {rolunkObj.kep.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className='col-md-12'>
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onClick={() => deleteImage(kep.src)}>Törlés</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </React.Fragment>
          )
      }

    const deleteImage = (src) => {
        let kepek = rolunkObj.kep;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setRolunkObj({
            ...rolunkObj,
            kep: filtered
        })
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
                text: 'Azonosító'
            },
            {
                dataField: 'nev',
                text: 'Név'
            },
            {
                dataField: 'beosztas',
                text: 'Beosztás'
            },
            {
                dataField: 'email',
                text: 'Email'
            },
            {
                dataField: 'telefon',
                text: 'Telefon'
            },
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'Műveletek'
            },
        ];

        return (
            <BootstrapTable
                wrapperClasses='table-responsive'
                columns={columns}
                data={rolunkJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjeleníthető adat! :('
            />
        );
    }

    const onSave = () => {
        const kuldObj = {
            azonosito: rolunkObj.azonosito,
            kep: rolunkObj.kep,
            nev: rolunkObj.nev,
            beosztas: rolunkObj.beosztas,
            email: rolunkObj.email,
            telefon: rolunkObj.telefon,
            leiras: serializer.serialize(rolunkObj.leiras)
        };
        if (!currentId) {
            Services.addRolunk(kuldObj).then((res) => {
                if (!res.err) {
                    listRolunk();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editRolunk(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listRolunk();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteRolunk(currentId).then((res) => {
            if (!res.err) {
                listRolunk();
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
                    {!currentId ? 'Rólunk bejegyzés hozzáadása' : 'Rólunk bejegyzés módosítása'} 
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        <Label>
                            Azonosító:
                        </Label>
                        <Input
                            type='text'
                            name='azonosito'
                            id='azonosito'
                            value={rolunkObj.azonosito}
                            onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Kép:
                        </Label>
                        <MyDropzone />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Név:
                        </Label>
                        <Input
                            type='text'
                            name='nev'
                            id='nev'
                            value={rolunkObj.nev}
                            onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Beosztás:
                        </Label>
                        <Input
                            type='text'
                            name='beosztas'
                            id='beosztas'
                            value={rolunkObj.beosztas}
                            onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Email:
                        </Label>
                        <Input
                            type='email'
                            name='email'
                            id='email'
                            value={rolunkObj.email}
                            onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Telefon:
                        </Label>
                        <Input
                            type='text'
                            name='telefon'
                            id='telefon'
                            value={rolunkObj.telefon}
                            onChange={(e) => handleInputChange(e, rolunkObj, setRolunkObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Leiras:
                        </Label>
                        <Wysiwyg fontId='rolunk' onChange={onChangeEditor} value={rolunkObj.leiras} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={() => onSave()}>Mentés</Button>
                    <Button color='secondary' onClick={() => toggleModal()}>Mégsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    const renderDeleteModal = () => {
        return (
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>
                    Rólunk bejegyzés törlése
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        {'Valóban törölni kívánja az adott tételt?'}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='danger' onClick={() => onDelete()}>Igen</Button>
                    <Button color='secondary' onClick={() => toggleDeleteModal()}>Mégsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    return (
        <div className='row'>
            <div className='col-md-12'>
                <Button color='success' onClick={() => handleNewClick()}>+ Rólunk bejegyzés hozzáadása</Button>
                <br /><br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default Rolunk;