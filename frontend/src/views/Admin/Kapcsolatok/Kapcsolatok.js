import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDropzone } from 'react-dropzone';
import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Kapcsolatok = (props) => {

    const defaultKapcsolatObj = {
        azonosito: '',
        kep: [],
        nev: '',
        cim: '',
        email: '',
        telefon: '',
        kapcsolatcim: '',
        kapcsolatleiras: ''
    }

    const [ kapcsolatokJson, setKapcsolatokJson ] = useState([]);
    const [ kapcsolatObj, setKapcsolatObj ] = useState(defaultKapcsolatObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const { addNotification } = props;

    const listKapcsolatok= () => {
        Services.listKapcsolatok().then((res) => {
            if (!res.err) {
                setKapcsolatokJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listKapcsolatok();
    }, []);

    const getKapcsolat = (id) => {
        Services.getKapcsolat(id).then((res) => {
            if (!res.err) {
                setKapcsolatObj(res);
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
        setKapcsolatObj(defaultKapcsolatObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getKapcsolat(id);
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
                
                setKapcsolatObj({
                    ...kapcsolatObj,
                    kep: [...kapcsolatObj.kep, kep]
                })
              }
              reader.readAsDataURL(file)
            })
          }, [])
          const {getRootProps, getInputProps} = useDropzone({onDrop})
          return (
            <React.Fragment>
                <div hidden={kapcsolatObj.kep.length > 0} {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Kattintson ide a k??p felt??lt??s??hez...</p>
                </div>
                <div className='row'>
                    {kapcsolatObj.kep.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className='col-md-12'>
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onClick={() => deleteImage(kep.src)}>T??rl??s</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </React.Fragment>
          )
      }

    const deleteImage = (src) => {
        let kepek = kapcsolatObj.kep;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setKapcsolatObj({
            ...kapcsolatObj,
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
                text: 'Azonos??t??'
            },
            {
                dataField: 'nev',
                text: 'N??v'
            },
            {
                dataField: 'cim',
                text: 'C??m'
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
                text: 'M??veletek'
            },
        ];

        return (
            <BootstrapTable
                wrapperClasses='table-responsive'
                columns={columns}
                data={kapcsolatokJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjelen??thet?? adat! :('
            />
        );
    }

    const onSave = () => {
        if (!currentId) {
            Services.addKapcsolat(kapcsolatObj).then((res) => {
                if (!res.err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editKapcsolat(kapcsolatObj, currentId).then((res) => {
                if (!res.err) {
                    listKapcsolatok();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteKapcsolat(currentId).then((res) => {
            if (!res.err) {
                listKapcsolatok();
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
                    {!currentId ? 'Kapcsolati bejegyz??s hozz??ad??sa' : 'Kapcsolati bejegyz??s m??dos??t??sa'} 
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
                            value={kapcsolatObj.azonosito}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            K??p:
                        </Label>
                        <MyDropzone />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            N??v:
                        </Label>
                        <Input
                            type='text'
                            name='nev'
                            id='nev'
                            value={kapcsolatObj.nev}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            C??m:
                        </Label>
                        <Input
                            type='text'
                            name='cim'
                            id='cim'
                            value={kapcsolatObj.cim}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            E-mail:
                        </Label>
                        <Input
                            type='email'
                            name='email'
                            id='email'
                            value={kapcsolatObj.email}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
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
                            value={kapcsolatObj.telefon}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Kapcsolat c??msor:
                        </Label>
                        <Input
                            type='text'
                            name='kapcsolatcim'
                            id='kapcsolatcim'
                            value={kapcsolatObj.kapcsolatcim}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>
                            Kapcsolati leiras:
                        </Label>
                        <Input
                            type='textarea'
                            name='kapcsolatleiras'
                            id='kapcsolatleiras'
                            rows="7"
                            value={kapcsolatObj.kapcsolatleiras}
                            onChange={(e) => handleInputChange(e, kapcsolatObj, setKapcsolatObj)}
                        />
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
                    R??lunk bejegyz??s t??rl??se
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
                <Button color='success' onClick={() => handleNewClick()}>+ Kapcsolati bejegyz??s hozz??ad??sa</Button>
                <br /><br />
                {renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default Kapcsolatok;