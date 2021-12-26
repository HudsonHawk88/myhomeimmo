import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDropzone } from 'react-dropzone';
import { serializer } from "@organw/wysiwyg-editor";
import { Wysiwyg } from "../../../commons/Wysiwyg";
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const IngatlanSzolgaltatasok = (props) => {

    const { addNotification } = props;

    const defaultIngalanSzolgObj = {
        azonosito: '',
        kep: [],
        leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>')
    }

    const [ ingatlanSzolgJson, setIngatlanSzolgJson ] = useState([]);
    const [ ingatlanSzolgObj, setIngatlanSzolgObj ] = useState(defaultIngalanSzolgObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const listIngatlanSzolgaltatasok = () => {
        Services.listIngatlanSzolgaltatasok().then((res) => {
            if (!res.err) {
                setIngatlanSzolgJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listIngatlanSzolgaltatasok();
    }, []);


    const getIngatlanSzolgaltatasok = (id) => {
        Services.getIngatlanSzolgaltatas(id).then((res) => {
            if (!res.err) {
                setIngatlanSzolgObj({
                    azonosito:res.azonosito,
                    kep: res.kep,
                    leiras: serializer.deserialize(res.leiras)
                });
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const onChangeEditor = ({ value }) => {
        setIngatlanSzolgObj({
          ...ingatlanSzolgObj,
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
        setIngatlanSzolgObj(defaultIngalanSzolgObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getIngatlanSzolgaltatasok(id);
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
                
                setIngatlanSzolgObj({
                    ...ingatlanSzolgObj,
                    kep: [...ingatlanSzolgObj.kep, kep]
                })
              }
              reader.readAsDataURL(file)
            })
          }, [])
          const {getRootProps, getInputProps} = useDropzone({onDrop})
          return (
            <React.Fragment>
                <div hidden={ingatlanSzolgObj.kep.length > 0} {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Kattintson ide a kép feltöltéséhez...</p>
                </div>
                <div className='row'>
                    {ingatlanSzolgObj.kep.map((kep, index) => {
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
        let kepek = ingatlanSzolgObj.kep;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setIngatlanSzolgObj({
            ...ingatlanSzolgObj,
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
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'Műveletek'
            },
        ];

        return (
            <BootstrapTable
                wrapperClasses='table-responsive'
                columns={columns}
                data={ingatlanSzolgJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjeleníthető adat! :('
            />
        );
    }

    const onSave = () => {
        let kuldObj = {
            azonosito: ingatlanSzolgObj.azonosito,
            kep: ingatlanSzolgObj.kep,
            leiras: serializer.serialize(ingatlanSzolgObj.leiras)
        };
        if (!currentId) {
            Services.addIngatlanSzolgaltatas(kuldObj).then((res) => {
                if (!res.err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editIngatlanSzolgaltatas(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listIngatlanSzolgaltatasok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteIngatlanSzolgaltatas(currentId).then((res) => {
            if (!res.err) {
                listIngatlanSzolgaltatasok();
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
                    {!currentId ? 'Ingatlan szolgáltatás hozzáadása' : 'Ingatlan szolgaltatas módosítása'} 
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
                            value={ingatlanSzolgObj.azonosito}
                            onChange={(e) => handleInputChange(e, ingatlanSzolgObj, setIngatlanSzolgObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>
                            Kép:
                        </Label>
                        <MyDropzone />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>
                            Leiras:
                        </Label>
                        <Wysiwyg fontId='ingszolg' onChange={onChangeEditor} value={ingatlanSzolgObj.leiras} />
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
                    Ingatlan szolgáltatás törlése
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
                <Button color='success' onClick={() => handleNewClick()}>+ Ingatlan szolgáltatás hozzáadása</Button>
                <br /><br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default IngatlanSzolgaltatasok;