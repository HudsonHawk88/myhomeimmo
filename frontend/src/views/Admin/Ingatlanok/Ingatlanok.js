import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Ingatlanok = (props) => {
    const defaultObj = {
        cim: '',
        leiras: '',
        kepek: [],
        ar: '',
        kaucio: '',
        statusz: '',
        tipus: '',
        allapot: '',
        emelet: '',
        alapterulet: '',
        telek: '',
        telektipus: '',
        beepithetoseg: '',
        viz: '',
        gaz: '',
        villany: '',
        szennyviz: '',
        szobaszam: '',
        felszobaszam: '',
        epitesmod: '',
        futes: '',
        isHirdetheto: false,
        isKiemelt: false,
        isErkely: false,
        isLift: false,
        isAktiv: false,
        isUjEpitesu: false
    }

    const defaultHelyseg = {
        orszag: '',
        irszam: '',
        telepules: ''
    }

    const defaultFelado = {
        feladoNev: '',
        feladoTelefon: '',
        feladoEmail: '',
        feladoAvatar: []
    }

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ currentId, setCurrentId ] = useState(null);
    const [ ingatlanokJson, setIngatlanokJson ] = useState([]);
    const [ ingatlanObj, setIngatlanObj ] = useState(defaultObj);
    const [ helyseg, setHelyseg ] = useState(defaultHelyseg);
    const [ felado, setFelado ] = useState(defaultFelado);
    const [ orszagok, setOrszagok ] = useState([]);
    const [ telepulesek, setTelepulesek ] = useState([]);
    const [ telepulesekOpts, setTelepulesekOpts ] = useState([]);
    const { addNotification, user } = props;

    const isIrszamTyped = () => {
        if (helyseg.irszam && helyseg.irszam.length === 4) {
          return true;
        } else {
          return false;
        }
    };

    const setDefault = (orszagokList) => {
        const lang = navigator.language;
    
        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setHelyseg({
                        ...helyseg,
                        orszag: orsz
                    });
                }
            });
        }
    }

    const listIngatlanok = () => {
        Services.listIngatlanok().then((res) => {
            if (!res.err) {
              setIngatlanokJson(res)
            }
          })
    }

    const listOrszagok = () => {
        Services.listOrszagok().then((res) => {
            if (!res.err) {
              setOrszagok(res);
              setDefault(res);
            }
        });
    }

    const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
              setTelepulesek(res);
            } 
          });
    }

    const nevFormatter = (nev) => {
        if (nev) {
            return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
        }
    }

    const telefonFormatter = (telefon) => {
        if (telefon) {
            return `${telefon.orszaghivo} ${telefon.korzet} ${telefon.telszam}`;
        }
    }

    const init = () => {
        listIngatlanok();
        listOrszagok();
        listTelepulesek();
        setFelado({
            feladoNev: nevFormatter(user.nev),
            feladoTelefon: telefonFormatter(user.telefon),
            feladoEmail: user.email,
            feladoAvatar: user.avatar
        });
    }

    const getIngatlan = (id) => {
        Services.getIngatlan(id).then((res) => {
            if (!res.err) {
                setIngatlanObj(res[0]);
                delete ingatlanObj.helyseg;
                setHelyseg(res[0].helyseg)
            }
        })
    }

    useEffect(() => {
        init();
      }, []);
    
      useEffect(() => {
        if (isIrszamTyped()) {
          const irsz = helyseg.irszam;
          Services.getTelepulesByIrsz(irsz).then((res) => {
            if (!res.err) {
              setTelepulesekOpts(res);
            } else {
                addNotification('error', res.msg)
            }
          });
        }
      }, [isIrszamTyped(), helyseg.irszam]);


      const renderOrszagokOptions = () => {
        if (orszagok.length !== 0) {
          return orszagok.map((orszag) => {
            return (
              <option key={orszag.id} value={orszag.id}>
                {orszag.orszagnev}
              </option>
            );
          });
        }
      };
    
    const renderTelepulesekOptions = () => {
    if (telepulesekOpts.length !== 0) {
        return telepulesekOpts.map((telepules) => {
        return (
            <option key={telepules.id} value={telepules.id}>
            {telepules.telepulesnev}
            </option>
        );
        });
    }
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const handleNewClick = () => {
        setIngatlanObj(defaultObj);
        setHelyseg({
            ...helyseg,
            irszam: '',
            telepules: '',
        })
        setFelado({
            feladoNev: nevFormatter(user.nev),
            feladoTelefon: telefonFormatter(user.telefon),
            feladoEmail: user.email,
            feladoAvatar: user.avatar
        });
        setCurrentId(null);
        toggleModal();
    }

    const handleViewClick = (id) => {
        setCurrentId(id);
        getIngatlan(id);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getIngatlan(id);
        toggleModal();
    }

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        Services.deleteIngatlan(id).then((res) => {
            if(!res.err) {
                // toggleDeleteModal();
                listIngatlanok();
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const tableIconFormatter = (cell, row, rowIndex) => {
        return (
          <React.Fragment>
            <Button
              key={rowIndex}
              color="link"
              onClick={() => handleViewClick(cell)}
            >
              <i key={rowIndex + 1} className="fas fa-eye" />
            </Button>
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
                dataField: 'cim',
                text: 'Ingatlanhirdetés címe',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'telepules',
                text: 'Település',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'statusz',
                text: 'Státusz',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'tipus',
                text: 'Típus',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'allapot',
                text: 'Állapot',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'ar',
                text: 'Ár',
                filter: textFilter({
                    placeholder: 'Keresés...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'Műveletek'
            },
        ];

        const pagination = paginationFactory({
            // page: 2,
            sizePerPage: 5,
            lastPageText: '>>',
            firstPageText: '<<',
            nextPageText: '>',
            prePageText: '<'
          });

        return (
            <BootstrapTable
                wrapperClasses='table-responsive'
                columns={columns}
                data={ingatlanokJson}
                pagination={pagination}
                filter={filterFactory()}
                keyField="id"
                bootstrap4
                noDataIndication='Nincs megjeleníthető adat! :('
            />
        );
    }

    const onSubmit = () => {
        let kuldObj = ingatlanObj;
        kuldObj.helyseg = helyseg;
        if (kuldObj.helyseg.telepules.id) {
            kuldObj.telepules = kuldObj.helyseg.telepules.telepulesnev
        } else {
            telepulesek.map((telepules) => {
                if (telepules.id.toString() === helyseg.telepules) {
                    kuldObj.telepules = telepules.telepulesnev;
                    kuldObj.helyseg.telepules = telepules;
                }
            });
        }
       
        kuldObj.feladoNev = felado.feladoNev;
        kuldObj.feladoEmail = felado.feladoEmail;
        kuldObj.feladoTelefon = felado.feladoTelefon;
        kuldObj.feladoAvatar = felado.feladoAvatar;

        if(!currentId) {
            Services.addEIngatlan(kuldObj).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editIngatlan(kuldObj, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

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
            ingatlanObj.kepek,
            result.source.index,
            result.destination.index
        );
    
        setIngatlanObj({
            ...ingatlanObj,
            kepek: items
        })
    }

    const deleteImage = (src) => {
        let kepek = ingatlanObj.kepek;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setIngatlanObj({
            ...ingatlanObj,
            kepek: filtered
        })
    }

    const setCover = () => {
        let kepek = ingatlanObj.kepek;
        kepek.forEach((kep, index) => {
            if(index === 0) {
                kep.isCover = true;
            } else {
                kep.isCover = false;
            }
        });
        setIngatlanObj({
            ...ingatlanObj,
            kepek: kepek
        })
    }

    useEffect(() => {
        setCover();
    }, [ingatlanObj.kepek])

    const MyDropzone = () => {

        const imageStyle = {
            maxHeight: '100%',
            maxWidth: '100%'
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
                
                setIngatlanObj({
                    ...ingatlanObj,
                    kepek: [...ingatlanObj.kepek, kep]
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
                            {ingatlanObj.kepek.map((item, index) => (
                                <Draggable key={item.src} draggableId={item.src} index={index} isDragDisabled={item.isCover}>
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
                                            <img style={imageStyle} src={item.src} alt={item.nev} />
                                        </CardBody>
                                        <CardFooter>
                                            <Button hidden={!item.isCover} outline={item.isCover ? false : true} color='primary'>Elsődleges kép</Button>
                                            <Button onClick={() => deleteImage(item.src)}>Törlés</Button>
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
                    {/* {ingatlanObj.kepek.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className='col-md-3'>
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter>
                                    <Button outline={kep.isCover ? false : true} color='primary' onClick={() => setCover(kep.src)}>Elsődleges kép</Button>
                                    <Button onClick={() => deleteImage(kep.src)}>Törlés</Button>
                                </CardFooter>
                            </Card>
                        );
                    })} */}
                </div>
            </React.Fragment>
          )
      }

    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} backdrop='static' size='lg'>
                <ModalHeader>
                    {!currentId ? "Ingatlan hirdetés felvitele" : "Ingatlan hirdetés módosítása"}
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        <Label>Feladó neve: *</Label>
                        <Input
                            type='text'
                            name='feladoNev'
                            id='feladoNev'
                            value={felado.feladoNev}
                            onChange={(e) => handleInputChange(e, felado, setFelado)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Feladó e-mail címe: *</Label>
                        <Input
                            type='email'
                            name='feladoEmail'
                            id='feladoEmail'
                            value={felado.feladoEmail}
                            onChange={(e) => handleInputChange(e, felado, setFelado)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Feladó telefonszáma: *</Label>
                        <Input
                            type='text'
                            name='feladoTelefon'
                            id='feladoTelefon'
                            value={felado.feladoTelefon}
                            onChange={(e) => handleInputChange(e, felado, setFelado)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Ingatlan hirdetés címe: *</Label>
                        <Input
                            type='text'
                            name='cim'
                            id='cim'
                            value={ingatlanObj.cim}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Leírás: *</Label>
                        <Input
                            type='textarea'
                            rows="7"
                            name='leiras'
                            id='leiras'
                            value={ingatlanObj.leiras}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Ország: *</Label>
                        <Input
                            type='select'
                            name='orszag'
                            id='orszag'
                            value={helyseg.orszag.id}
                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        >
                            {!currentId && 
                                <option key='' value=''>Kérjük válasszon országot...</option>
                            }
                            {renderOrszagokOptions()}
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Irányítószám: *</Label>
                        <Input
                            type='text'
                            name='irszam'
                            id='irszam'
                            value={helyseg.irszam}
                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Település: *</Label>
                        <Input
                            type='select'
                            name='telepules'
                            id='telepules'
                            value={helyseg.telepules.id}
                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                            // disabled={
                            //     !helyseg.irszam ||
                            //     (helyseg.irszam && helyseg.irszam.length !== 4)
                            // }
                        >
                            {!currentId && 
                                <option key='' value=''>Kérjük válasszon települést...</option>
                            }
                            {renderTelepulesekOptions()}
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Képek: *</Label>
                        <MyDropzone multiple  />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Státusz: *</Label>
                        <Input
                            type='select'
                            name='statusz'
                            id='statusz'
                            value={ingatlanObj.statusz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon státuszt...</option>
                            <option key='elado' value='Eladó'>Eladó</option>
                            <option key='kiadó' value='Kiadó'>Kiadó</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Ár: *</Label>
                        <Input
                            type='text'
                            name='ar'
                            id='ar'
                            value={ingatlanObj.ar}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12' hidden={ingatlanObj.statusz !== 'Kiadó'}>
                        <Label>Kaució: *</Label>
                        <Input
                            type='text'
                            name='kaucio'
                            id='kaucio'
                            value={ingatlanObj.kaucio}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Típus: *</Label>
                        <Input
                            type='select'
                            name='tipus'
                            id='tipus'
                            value={ingatlanObj.tipus}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon típust...</option>
                            <option key='csaladi' value='Családi ház'>Családi ház</option>
                            <option key='ikerhaz' value='Ikerház'>Ikerház</option>
                            <option key='sorhaz' value='Sorház'>Sorház</option>
                            <option key='lakas' value='Lakás'>Lakás</option>
                            <option key='iroda' value='Iroda'>Iroda</option>
                            <option key='irodahaz' value='Irodaház'>Irodaház</option>
                            <option key='uzlet' value='Üzlethelyiség'>Üzlethelyiség</option>
                            <option key='ipari' value='Ipari ingatlan'>Ipari ingatlan</option>
                            <option key='vendeg' value='Vendéglátó hely'>Vendéglátó hely</option>
                            <option key='mezogazd' value='Mezőgazdasági terület'>Mezőgazdasági terület</option>
                            <option key='fejlesztesi' value='Fejlesztési terület'>Fejlesztési terület</option>
                            <option key='garazs' value='Garázs'>Garázs</option>
                            <option key='raktar' value='Raktár'>Raktár</option>
                            <option key='szallas' value='Szálláshely'>Szálláshely</option>
                            <option key='nyaralo' value='Hétvégi ház/Nyaraló'>Hétvégi ház/Nyaraló</option>
                            <option key='telek' value='Telek'>Telek</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Állapot: *</Label>
                        <Input
                            type='select'
                            name='allapot'
                            id='allapot'
                            value={ingatlanObj.allapot}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='atlagos' value='Átlagos'>Átlagos</option>
                            <option key='felujitando' value='Felújítandó'>Felújítandó</option>
                            <option key='felujitott' value='Felújított'>Felújított</option>
                            <option key='jo' value='Jó'>Jó</option>
                            <option key='kivalo' value='Kiváló'>Kiváló</option>
                            <option key='uj' value='Új'>Új</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12' hidden={ingatlanObj.tipus === 'Telek'}>
                        <Label>Emelet:</Label>
                        <Input
                            type='text'
                            name='emelet'
                            id='emelet'
                            value={ingatlanObj.emelet}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Alapterület: *</Label>
                        <Input
                            type='text'
                            name='alapterulet'
                            id='alapterulet'
                            value={ingatlanObj.alapterulet}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Telek mérete: *</Label>
                        <Input
                            type='text'
                            name='telek'
                            id='telek'
                            value={ingatlanObj.telek}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Telek tipus: *</Label>
                        <Input
                            type='select'
                            name='telektipus'
                            id='telektipus'
                            value={ingatlanObj.telektipus}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='kertvarosias' value='Kertvárosias'>Kertvárosias</option>
                            <option key='nagyvarosias' value='Nagyvárosias'>Nagyvárosias</option>
                            <option key='hetvegi_hazas' value='Hétvégi házas'>Hétvégi házas</option>
                            <option key='termeszetkozeli' value='Természetközeli'>Természetközeli</option>
                            <option key='ipari' value='Ipari'>Ipari</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Beépíthetőség: (m2) *</Label>
                        <Input
                            type='text'
                            name='beepithetoseg'
                            id='beepithetoseg'
                            value={ingatlanObj.beepithetoseg}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Víz: *</Label>
                        <Input
                            type='select'
                            name='viz'
                            id='viz'
                            value={ingatlanObj.viz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken belül'>Telken belül</option>
                            <option key='utcaban' value='Utcában'>Utcában</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Gáz: *</Label>
                        <Input
                            type='select'
                            name='gaz'
                            id='gaz'
                            value={ingatlanObj.gaz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken belül'>Telken belül</option>
                            <option key='utcaban' value='Utcában'>Utcában</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Villany: *</Label>
                        <Input
                            type='select'
                            name='villany'
                            id='villany'
                            value={ingatlanObj.villany}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken belül'>Telken belül</option>
                            <option key='utcaban' value='Utcában'>Utcában</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Szennyvíz: *</Label>
                        <Input
                            type='select'
                            name='szennyviz'
                            id='szennyviz'
                            value={ingatlanObj.szennyviz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon állapotot...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken belül'>Telken belül</option>
                            <option key='utcaban' value='Utcában'>Utcában</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Szobaszám: *</Label>
                        <Input
                            type='text'
                            name='szobaszam'
                            id='szobaszam'
                            value={ingatlanObj.szobaszam}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Félszoba száma: *</Label>
                        <Input
                            type='text'
                            name='felszobaszam'
                            id='felszobaszam'
                            value={ingatlanObj.felszobaszam}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Építés módja: *</Label>
                        <Input
                            type='select'
                            name='epitesmod'
                            id='epitesmod'
                            value={ingatlanObj.epitesmod}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon építési módot...</option>
                            <option key='tegla' value='Tégla'>Tégla</option>
                            <option key='konnyu' value='Könnyűszerkezetes'>Könnyűszerkezetes</option>
                            <option key='panel' value='Panel'>Panel</option>
                            <option key='ytong' value='Ytong'>Ytong</option>
                            <option key='fa' value='Fa'>Fa</option>
                            <option key='csúsztatott_zsalu' value='Csúsztatott zsalu'>Csúsztatott zsalu</option>
                            <option key='valyog' value='Vályog'>Vályog</option>
                            <option key='vert_falazat' value='Vert falazat'>Vert falazat</option>
                            <option key='vegyes' value='Vegyes falazatú'>Vegyes falazatú</option>
                            <option key='egyeb' value='Egyéb'>Egyéb</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Fűtés: *</Label>
                        <Input
                            type='select'
                            name='futes'
                            id='futes'
                            value={ingatlanObj.futes}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='' value=''>Kérjük válasszon építési fűtési módot...</option>
                            <option key='cirko' value='Gáz (cirkó)'>Gáz (cirkó)</option>
                            <option key='gaz' value='Gáz'>Gáz</option>
                            <option key='gazkonvektor' value='Gázkonvektor'>Gázkonvektor</option>
                            <option key='gaz_hera' value='Gáz (héra)'>Gáz (héra)</option>
                            <option key='gaz_napkollektor' value='Gáz + napkollektor'>Gáz + napkollektor</option>
                            <option key='gazkazan' value='Gázkazán'>Gázkazán</option>
                            <option key='egyeb_kazan' value='Egyéb kazán'>Egyéb kazán</option>
                            <option key='elektromos' value='Elektromos'>Elektromos</option>
                            <option key='hazkozponti' value='Házközponti'>Házközponti</option>
                            <option key='hazkozponti_egyedi' value='Házközponti egyedi méréssel'>Házközponti egyedi méréssel</option>
                            <option key='geotermikus' value='Geotermikus'>Geotermikus</option>
                            <option key='egyedikozponti' value='Egyedi központi'>Egyedi központi</option>
                            <option key='egyedituzeles' value='Egyedi tüzelésű'>Egyedi tüzelésű</option>
                            <option key='vegyestuzeles' value='Vegyes tüzelésű'>Vegyes tüzelésű</option>
                            <option key='tavfutes' value='Távfűtés'>Távfűtés</option>
                            <option key='tavfutes_egyedi' value='Távfűtés egyedi mérővel'>Távfűtés egyedi mérővel</option>
                            <option key='egyeb' value='Egyéb'>Egyéb</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <Label>Hirdethető</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isHirdetheto'
                                    id='isHirdetheto'
                                    checked={ingatlanObj.isHirdetheto}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                            <div className='col-md-4'>
                                <Label>Kiemelt</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isKiemelt'
                                    id='isKiemelt'
                                    checked={ingatlanObj.isKiemelt}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                            <div className='col-md-4'>
                                <Label>Erkély</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isErkely'
                                    id='isErkely'
                                    checked={ingatlanObj.isErkely}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                            <br />
                            <div className='col-md-4'>
                                <Label>Lift</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isLift'
                                    id='isLift'
                                    checked={ingatlanObj.isLift}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                            <div className='col-md-4'>
                                <Label>Új építés</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isUjEpitesu'
                                    id='isUjEpitesu'
                                    checked={ingatlanObj.isUjEpitesu}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                            <div className='col-md-4'>
                                <Label>Publikus</Label>
                                &nbsp;&nbsp;
                                <Input
                                    type='checkbox'
                                    name='isAktiv'
                                    id='isAktiv'
                                    checked={ingatlanObj.isAktiv}
                                    onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button type='button' color='success' onClick={() => onSubmit()}>Mentés</Button>
                    <Button type='button' color='secondary' onClick={() => toggleModal()}>Mégsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    return (
        // <div className='tartalom-admin'>
            <div className='row'>
                <div className='col-md-12'>
                    <Button type='button' color='success' onClick={handleNewClick}>Ingatlanhirdetés hozzáadása</Button><br /><br />
                    {renderModal()}
                    {ingatlanokJson && ingatlanokJson.length !== 0 && renderTable()}
                </div>
            </div>
        // </div>
    );
}

export default Ingatlanok;