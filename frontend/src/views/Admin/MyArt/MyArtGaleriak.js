import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { serializer } from "@organw/wysiwyg-editor";
import { Wysiwyg } from "../../../commons/Wysiwyg";
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const MyArtGaleriak = (props) => {

    const defaultMyArtGaleriakObj = {
        azonosito: '',
        nev: '',
        muveszNev: '',
        muveszTelefon: '',
        muveszEmail: '',
        muveszUrl: '',
        kepek: [],
        leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>'),
        isActive: false
    }

    const [ myArtGaleriakJson, setMyArtGaleriakJson ] = useState([]);
    const [ myArtGaleriakObj, setMyArtGaleriakObj ] = useState(defaultMyArtGaleriakObj);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const { addNotification } = props;

    const listGaleriak= () => {
        Services.listGaleriak().then((res) => {
            if (!res.err) {
                setMyArtGaleriakJson(res);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    useEffect(() => {
        listGaleriak();
    }, []);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
    };

    const grid = 2;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        // padding: grid * 2,
        // margin: `0 ${grid}px 0 0`,
        
      
        // change background colour if dragging
        // background: isDragging ? 'lightgreen' : 'grey',
      
        // styles we need to apply on draggables
        ...draggableStyle,
    });

    const getListStyle = (isDraggingOver) => ({
        display: 'flex',
        overflow: 'auto',
        flexWrap: 'wrap'
    });

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const items = reorder(
            myArtGaleriakObj.kepek,
            result.source.index,
            result.destination.index
        );
    
        setMyArtGaleriakObj({
            ...myArtGaleriakObj,
            kepek: items
        })
    }

    const deleteImage = (filename) => {
        let kepek = myArtGaleriakObj.kepek;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setMyArtGaleriakObj({
            ...myArtGaleriakObj,
            kepek: filtered
        })
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
        
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
              // Do whatever you want with the file contents
              base64 = event.target.result;
                kep = {
                    preview: base64,
                    src: base64,
                    file: file,
                    filename: file.name,
                    title: file.name,
                    isCover: false
                }
                
                setMyArtGaleriakObj({
                    ...myArtGaleriakObj,
                    kepek: [...myArtGaleriakObj.kepek, kep]
                })
              }
              reader.readAsDataURL(file)
            })
          }, [])
          const {getRootProps, getInputProps} = useDropzone({onDrop})
          return (
            <React.Fragment>
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <div className='row'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                        
                        >
                        {myArtGaleriakObj.kepek.map((item, index) => (
                            <Draggable key={item.title} draggableId={index.toString()} index={index} isDragDisabled={item.isCover}>
                            {(provided, snapshot) => (
                                <div
                                className='col-md-3'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}
                                >
                                <Card key={index.toString()}>
                                    <CardTitle>{item.nev}</CardTitle>
                                    <CardBody>
                                        <img style={imageStyle} src={item.src || item.preview} alt={item.nev} />
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={() => deleteImage(item.filename)}>T??rl??s</Button>
                                    </CardFooter>
                                </Card>
                                </div>
                            )}
                            </Draggable>
                            
                        ))}
                        {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </DragDropContext>
            </div>
        </React.Fragment>
          )
      }

    const getGaleria = (id) => {
        Services.getGaleria(id).then((res) => {
            if (!res.err) {
                setMyArtGaleriakObj({
                    azonosito:res.azonosito,
                    nev: res.nev,
                    muveszNev: res.muveszNev,
                    muveszTelefon: res.muveszTelefon,
                    muveszEmail: res.muveszEmail,
                    muveszUrl: res.muveszUrl,
                    kepek: res.kepek,
                    leiras: serializer.deserialize(res.leiras),
                    isActive: res.isActive
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
        setMyArtGaleriakObj(defaultMyArtGaleriakObj);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getGaleria(id);
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
                dataField: 'muveszNev',
                text: 'M??v??sz neve'
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
                data={myArtGaleriakJson}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjelen??thet?? adat! :('
            />
        );
    }

    const onSave = () => {
        let kuldObj = {
            azonosito:myArtGaleriakObj.azonosito,
            nev: myArtGaleriakObj.nev,
            muveszNev: myArtGaleriakObj.muveszNev,
            muveszTelefon: myArtGaleriakObj.muveszTelefon,
            muveszEmail: myArtGaleriakObj.muveszEmail,
            muveszUrl: myArtGaleriakObj.muveszUrl,
            kepek: myArtGaleriakObj.kepek,
            leiras: serializer.serialize(myArtGaleriakObj.leiras),
            isActive: myArtGaleriakObj.isActive
        };
        if (!currentId) {
            Services.addGaleria(kuldObj).then((res) => {
                if (!res.err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editGaleria(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    listGaleriak();
                    toggleModal();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const onDelete = () => {
        Services.deleteGaleria(currentId).then((res) => {
            if (!res.err) {
                listGaleriak();
                toggleDeleteModal();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const onChangeEditor = ({ value }) => {
        setMyArtGaleriakObj({
          ...myArtGaleriakObj,
          leiras: value,
        });
    };

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size='lg' backdrop='static'>
                <ModalHeader>
                    {!currentId ? 'MyArt gal??ria hozz??ad??sa' : 'MyArt gal??ria m??dos??t??sa'} 
                </ModalHeader>
                <ModalBody>
                    <div className='row'>
                        <div className='col-md-4'>
                            <Label>
                                Azonos??t??:
                            </Label>
                            <Input
                                type='text'
                                name='azonosito'
                                id='azonosito'
                                value={myArtGaleriakObj.azonosito}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Label>
                                N??v:
                            </Label>
                            <Input
                                type='text'
                                name='nev'
                                id='nev'
                                value={myArtGaleriakObj.nev}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Label>
                                M??v??sz neve:
                            </Label>
                            <Input
                                type='text'
                                name='muveszNev'
                                id='muveszNev'
                                value={myArtGaleriakObj.muveszNev}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-12'/>
                        <br />
                        <div className='col-md-4'>
                            <Label>
                                M??v??sz telefonsz??ma:
                            </Label>
                            <Input
                                type='text'
                                name='muveszTelefon'
                                id='muveszTelefon'
                                value={myArtGaleriakObj.muveszTelefon}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Label>
                                M??v??sz e-mail c??me:
                            </Label>
                            <Input
                                type='email'
                                name='muveszEmail'
                                id='muveszEmail'
                                value={myArtGaleriakObj.muveszEmail}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Label>
                                M??v??sz weblapja:
                            </Label>
                            <Input
                                type='text'
                                name='muveszUrl'
                                id='muveszUrl'
                                value={myArtGaleriakObj.muveszUrl}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-12'/>
                        <br />
                        <div className='col-md-12'>
                            <Label>K??pek: *</Label>
                            <MyDropzone multiple  />
                        </div>
                        <div className='col-md-12'/>
                        <br />
                        <div className='col-md-4'>
                            <Label>
                                Publikus:
                            </Label>
                            <Input
                                type='checkbox'
                                name='isActive'
                                id='isActive'
                                checked={myArtGaleriakObj.isActive}
                                onChange={(e) => handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)}
                            />
                        </div>
                        <div className='col-md-12'/>
                        <br />
                        <div className='col-md-12'>
                            <Label>
                                Leiras:
                            </Label>
                            <Wysiwyg fontId='myArtGaleria' onChange={onChangeEditor} value={myArtGaleriakObj.leiras} />
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
                <Button color='success' onClick={() => handleNewClick()}>+ MyArt gal??ria hozz??ad??sa</Button>
                <br /><br />
                {myArtGaleriakJson && myArtGaleriakJson.length !== 0 && renderTable()}
                {renderModal()}
                {renderDeleteModal()}
            </div>
        </div>
    );
}

export default MyArtGaleriak;