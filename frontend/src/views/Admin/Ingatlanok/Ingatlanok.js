import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Card, CardTitle, CardBody, CardFooter, Form } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const Ingatlanok = (props) => {
    const penznemek = [
        {
            penznemid: '0',
            penznem: 'HUF',
            penznemText: 'Ft'
        },
        {
            penznemid: '1',
            penznem: 'EUR',
            penznemText: 'Euro'
        }
    ];
    const defaultObj = {
        cim: '',
        leiras: '',
        kepek: [],
        ar: '',
        kaucio: '',
        penznem: '',
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
    const [ figyelmeztetesModal, setFigyelmeztetesModal ] = useState(false);
    const { addNotification, user, ertekesito } = props;

    const toggleFigyelmeztetes = () => {
        setFigyelmeztetesModal(!figyelmeztetesModal);
    }

    const generateXml = () => {
        Services.generateXml().then((res) => {
            if (!res.err) {
                addNotification('success', res.msg)
            } else {
                addNotification('error', res.err)
            }
        })
    }

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
        toggleFigyelmeztetes();
    }

    const getErtekesito = () => {
        if (user.isErtekesito) {
            setFelado({
                feladoNev: nevFormatter(user.nev),
                feladoTelefon: telefonFormatter(user.telefon),
                feladoEmail: user.email,
                feladoAvatar: user.avatar
            });
        } else {
            if (ertekesito) {
                setFelado({
                    feladoNev: nevFormatter(ertekesito.nev) ,
                    feladoTelefon: telefonFormatter(ertekesito.telefon),
                    feladoEmail: ertekesito.email,
                    feladoAvatar: ertekesito.avatar
                });
            }
            
        }
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
        if (user) {
            getErtekesito();
        }
        
    }, [user, ertekesito])
    
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
              <option key={orszag.id + 'orszag'} value={orszag.id}>
                {orszag.orszagnev}
              </option>
            );
          });
        }
      };

    const renderPenznemOptions = () => {
        if(penznemek && penznemek.length !== 0) {
            return penznemek.map((penznem) => {
                return (
                    <option key={penznem.id + 'penznem'} value={penznem.penznemText}>
                        {penznem.penznemText}
                    </option>
                )
            })
        }
    }
    
    const renderTelepulesekOptions = () => {
    if (telepulesekOpts.length !== 0) {
        return telepulesekOpts.map((telepules) => {
        return (
            <option key={telepules.id + 'telepules'} value={telepules.id}>
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
        });
        if (user.isErtekesito) {
            setFelado({
                feladoNev: nevFormatter(user.nev),
                feladoTelefon: telefonFormatter(user.telefon),
                feladoEmail: user.email,
                feladoAvatar: user.avatar
            });
        } else {
            setFelado({
                feladoNev: nevFormatter(ertekesito.nev),
                feladoTelefon: telefonFormatter(ertekesito.telefon),
                feladoEmail: ertekesito.email,
                feladoAvatar: ertekesito.avatar
            });
        }
        
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
                text: 'Ingatlanhirdet??s c??me',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'telepules',
                text: 'Telep??l??s',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'statusz',
                text: 'St??tusz',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'tipus',
                text: 'T??pus',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'allapot',
                text: '??llapot',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'ar',
                text: '??r',
                filter: textFilter({
                    placeholder: 'Keres??s...',  // custom the input placeholder
                    delay: 500, // how long will trigger filtering after user typing, default is 500 ms
                })
            },
            {
                dataField: 'id',
                formatter: tableIconFormatter,
                text: 'M??veletek'
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
                noDataIndication='Nincs megjelen??thet?? adat! :('
            />
        );
    }

    const onSubmit = (e) => {
        e.preventDefault();
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
        kuldObj.isErtekesito = user.isErtekesito;   
        let datas = new FormData();


        // datas.append('kepek', kuldObj.kepek);
        if(!currentId) {

            for ( var key in kuldObj ) {
                if(key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg') {
                    if (key === 'kepek') {
                        kuldObj.kepek.forEach((kep) => {
                            if (kep.file) {
                                datas.append('kepek', kep.file)
                            }
                            
                        });
                        
                    } else {
                        datas.append(key, JSON.stringify(kuldObj[key]));
                    }
                    
                } else {
                    datas.append(key, kuldObj[key]);
                }
            }
            Services.addEIngatlan(datas).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listIngatlanok();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            for ( var key in kuldObj ) {
                if(key === 'kepek' || key === 'feladoAvatar' || key === 'helyseg') {
                    if (key === 'kepek') {
                        kuldObj.kepek.forEach((kep) => {
                            if (kep.file) {
                                datas.append('uj_kepek', kep.file)
                            } else {
                                datas.append('kepek', JSON.stringify(kep))
                            }
                            
                        });
                        
                    } else {
                        datas.append(key, JSON.stringify(kuldObj[key]));
                    }
                    
                } else {
                    datas.append(key, kuldObj[key]);
                }
            }
            Services.editIngatlan(datas, currentId).then((res) => {
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
        display: 'grid',
        gridTemplateColumns: '25% 25% 25% 25%',
        // flexDirection: 'column',
        overflow: 'auto',
        // maxHeight: '200px',
        // flex: '1 1 auto',
        // flexWrap: 'wrap'
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

    const deleteImage = (filename) => {
        let kepek = ingatlanObj.kepek;
        let filtered = kepek.filter((kep) => kep.filename !== filename);
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

    function dataURItoBlob(dataURI, callback) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        // write the ArrayBuffer to a blob, and you're done
        var bb = new BlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);
    }

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
        
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
              // Do whatever you want with the file contents
              base64 = event.target.result;
              const obj = {
                filename: file.name,
                title: file.name,
                isCover: false,
                preview: URL.createObjectURL(file),
                src: URL.createObjectURL(file),
                file: file
              }

            //   console.log(file);
            //   console.log(obj);

                // kep = {
                //     preview: base64,
                //     src: base64,
                //     file: file,
                //     filename: file.name,
                //     title: file.name,
                //     isCover: false
                // }
                
                setIngatlanObj({
                    ...ingatlanObj,
                    kepek: [...ingatlanObj.kepek, obj]
                })
        
              }

              reader.readAsBinaryString(file)
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
                                
                                <Draggable key={item.src} draggableId={index.toString()} index={index}>

                                {(provided, snapshot) => (
                                    <div
                                    // className='col-md-3'
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                    >
                                    <Card key={index.toString()} style={{ maxHeight: '300px' }}>
                                        <CardTitle>{item.nev}</CardTitle>
                                        <CardBody>
                                            <img style={imageStyle} src={item.src || item.preview} alt={item.nev} />
                                        </CardBody>
                                        <CardFooter>
                                            <Button hidden={!item.isCover} outline={item.isCover ? false : true} color='primary'>Els??dleges k??p</Button>
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
                    {/* {ingatlanObj.kepek.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className='col-md-3'>
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter>
                                    <Button outline={kep.isCover ? false : true} color='primary' onClick={() => setCover(kep.src)}>Els??dleges k??p</Button>
                                    <Button onClick={() => deleteImage(kep.src)}>T??rl??s</Button>
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
                <Form id="geci" onSubmit={onSubmit} encType="multipart/form-data">
                <ModalHeader>
                    {!currentId ? "Ingatlan hirdet??s felvitele" : "Ingatlan hirdet??s m??dos??t??sa"}
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        <Label>Felad?? neve: *</Label>
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
                        <Label>Felad?? e-mail c??me: *</Label>
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
                        <Label>Felad?? telefonsz??ma: *</Label>
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
                        <Label>Ingatlan hirdet??s c??me: *</Label>
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
                        <Label>Le??r??s: *</Label>
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
                        <Label>Orsz??g: *</Label>
                        <Input
                            type='select'
                            name='orszag'
                            id='orszag'
                            value={helyseg.orszag.id}
                            onChange={(e) => handleInputChange(e, helyseg, setHelyseg)}
                        >
                            {!currentId && 
                                <option key='defaultOrszag' value=''>K??rj??k v??lasszon orsz??got...</option>
                            }
                            {renderOrszagokOptions()}
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Ir??ny??t??sz??m: *</Label>
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
                        <Label>Telep??l??s: *</Label>
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
                                <option key='defaultTelepules' value=''>K??rj??k v??lasszon telep??l??st...</option>
                            }
                            {renderTelepulesekOptions()}
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>K??pek: *</Label>
                        <MyDropzone multiple  />
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>St??tusz: *</Label>
                        <Input
                            type='select'
                            name='statusz'
                            id='statusz'
                            value={ingatlanObj.statusz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultStatusz' value=''>K??rj??k v??lasszon st??tuszt...</option>
                            <option key='elado' value='Elad??'>Elad??</option>
                            <option key='kiad??' value='Kiad??'>Kiad??</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>??r: *</Label>
                        <Input
                            type='text'
                            name='ar'
                            id='ar'
                            value={ingatlanObj.ar}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <br />
                    <div className='col-md-12' hidden={ingatlanObj.statusz !== 'Kiad??'}>
                        <Label>Kauci??: *</Label>
                        <Input
                            type='text'
                            name='kaucio'
                            id='kaucio'
                            value={ingatlanObj.kaucio}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Label>P??nznem: *</Label>
                        <Input
                            type='select'
                            name='penznem'
                            id='penznem'
                            value={ingatlanObj.penznem}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultPenznem' value=''>K??rj??k v??lasszon  p??nznemet...</option>
                            {renderPenznemOptions()}
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>T??pus: *</Label>
                        <Input
                            type='select'
                            name='tipus'
                            id='tipus'
                            value={ingatlanObj.tipus}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultTipus' value=''>K??rj??k v??lasszon t??pust...</option>
                            <option key='csaladi' value='Csal??di h??z'>Csal??di h??z</option>
                            <option key='ikerhaz' value='Ikerh??z'>Ikerh??z</option>
                            <option key='sorhaz' value='Sorh??z'>Sorh??z</option>
                            <option key='lakas' value='Lak??s'>Lak??s</option>
                            <option key='iroda' value='Iroda'>Iroda</option>
                            <option key='irodahaz' value='Irodah??z'>Irodah??z</option>
                            <option key='uzlet' value='??zlethelyis??g'>??zlethelyis??g</option>
                            <option key='ipari' value='Ipari ingatlan'>Ipari ingatlan</option>
                            <option key='vendeg' value='Vend??gl??t?? hely'>Vend??gl??t?? hely</option>
                            <option key='mezogazd' value='Mez??gazdas??gi ter??let'>Mez??gazdas??gi ter??let</option>
                            <option key='fejlesztesi' value='Fejleszt??si ter??let'>Fejleszt??si ter??let</option>
                            <option key='garazs' value='Gar??zs'>Gar??zs</option>
                            <option key='raktar' value='Rakt??r'>Rakt??r</option>
                            <option key='szallas' value='Sz??ll??shely'>Sz??ll??shely</option>
                            <option key='nyaralo' value='H??tv??gi h??z/Nyaral??'>H??tv??gi h??z/Nyaral??</option>
                            <option key='telek' value='Telek'>Telek</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>??llapot: *</Label>
                        <Input
                            type='select'
                            name='allapot'
                            id='allapot'
                            value={ingatlanObj.allapot}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultAllapot' value=''>K??rj??k v??lasszon ??llapotot...</option>
                            <option key='atlagos' value='??tlagos'>??tlagos</option>
                            <option key='felujitando' value='Fel??j??tand??'>Fel??j??tand??</option>
                            <option key='felujitott' value='Fel??j??tott'>Fel??j??tott</option>
                            <option key='jo' value='J??'>J??</option>
                            <option key='kivalo' value='Kiv??l??'>Kiv??l??</option>
                            <option key='uj' value='??j'>??j</option>
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
                        <Label>Alapter??let: *</Label>
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
                        <Label>Telek m??rete: *</Label>
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
                            <option key='defaultTelektipus' value=''>K??rj??k v??lasszon telekt??pust...</option>
                            <option key='kertvarosias' value='Kertv??rosias'>Kertv??rosias</option>
                            <option key='nagyvarosias' value='Nagyv??rosias'>Nagyv??rosias</option>
                            <option key='hetvegi_hazas' value='H??tv??gi h??zas'>H??tv??gi h??zas</option>
                            <option key='termeszetkozeli' value='Term??szetk??zeli'>Term??szetk??zeli</option>
                            <option key='ipari' value='Ipari'>Ipari</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Be??p??thet??s??g: (m2) *</Label>
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
                        <Label>V??z: *</Label>
                        <Input
                            type='select'
                            name='viz'
                            id='viz'
                            value={ingatlanObj.viz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultViz' value=''>K??rj??k v??lasszon...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken bel??l'>Telken bel??l</option>
                            <option key='utcaban' value='Utc??ban'>Utc??ban</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>G??z: *</Label>
                        <Input
                            type='select'
                            name='gaz'
                            id='gaz'
                            value={ingatlanObj.gaz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultGaz' value=''>K??rj??k v??lasszon...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken bel??l'>Telken bel??l</option>
                            <option key='utcaban' value='Utc??ban'>Utc??ban</option>
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
                            <option key='defaultVillany' value=''>K??rj??k v??lasszon...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken bel??l'>Telken bel??l</option>
                            <option key='utcaban' value='Utc??ban'>Utc??ban</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Szennyv??z: *</Label>
                        <Input
                            type='select'
                            name='szennyviz'
                            id='szennyviz'
                            value={ingatlanObj.szennyviz}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultSzennyviz' value=''>K??rj??k v??lasszon...</option>
                            <option key='van' value='Van'>Van</option>
                            <option key='nincs_adat' value='Nincs adat'>Nincs adat</option>
                            <option key='telkenbelul' value='Telken bel??l'>Telken bel??l</option>
                            <option key='utcaban' value='Utc??ban'>Utc??ban</option>
                            <option key='nincs' value='Nincs'>Nincs</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>Szobasz??m: *</Label>
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
                        <Label>F??lszoba sz??ma: *</Label>
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
                        <Label>??p??t??s m??dja: *</Label>
                        <Input
                            type='select'
                            name='epitesmod'
                            id='epitesmod'
                            value={ingatlanObj.epitesmod}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultEpitesmod' value=''>K??rj??k v??lasszon ??p??t??si m??dot...</option>
                            <option key='tegla' value='T??gla'>T??gla</option>
                            <option key='konnyu' value='K??nny??szerkezetes'>K??nny??szerkezetes</option>
                            <option key='panel' value='Panel'>Panel</option>
                            <option key='ytong' value='Ytong'>Ytong</option>
                            <option key='fa' value='Fa'>Fa</option>
                            <option key='cs??sztatott_zsalu' value='Cs??sztatott zsalu'>Cs??sztatott zsalu</option>
                            <option key='valyog' value='V??lyog'>V??lyog</option>
                            <option key='vert_falazat' value='Vert falazat'>Vert falazat</option>
                            <option key='vegyes' value='Vegyes falazat??'>Vegyes falazat??</option>
                            <option key='egyeb' value='Egy??b'>Egy??b</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <Label>F??t??s: *</Label>
                        <Input
                            type='select'
                            name='futes'
                            id='futes'
                            value={ingatlanObj.futes}
                            onChange={(e) => handleInputChange(e, ingatlanObj, setIngatlanObj)}
                        >
                            <option key='defaultFutes' value=''>K??rj??k v??lasszon ??p??t??si f??t??si m??dot...</option>
                            <option key='cirko' value='G??z (cirk??)'>G??z (cirk??)</option>
                            <option key='gaz' value='G??z'>G??z</option>
                            <option key='gazkonvektor' value='G??zkonvektor'>G??zkonvektor</option>
                            <option key='gaz_hera' value='G??z (h??ra)'>G??z (h??ra)</option>
                            <option key='gaz_napkollektor' value='G??z + napkollektor'>G??z + napkollektor</option>
                            <option key='gazkazan' value='G??zkaz??n'>G??zkaz??n</option>
                            <option key='egyeb_kazan' value='Egy??b kaz??n'>Egy??b kaz??n</option>
                            <option key='elektromos' value='Elektromos'>Elektromos</option>
                            <option key='hazkozponti' value='H??zk??zponti'>H??zk??zponti</option>
                            <option key='hazkozponti_egyedi' value='H??zk??zponti egyedi m??r??ssel'>H??zk??zponti egyedi m??r??ssel</option>
                            <option key='geotermikus' value='Geotermikus'>Geotermikus</option>
                            <option key='egyedikozponti' value='Egyedi k??zponti'>Egyedi k??zponti</option>
                            <option key='egyedituzeles' value='Egyedi t??zel??s??'>Egyedi t??zel??s??</option>
                            <option key='vegyestuzeles' value='Vegyes t??zel??s??'>Vegyes t??zel??s??</option>
                            <option key='tavfutes' value='T??vf??t??s'>T??vf??t??s</option>
                            <option key='tavfutes_egyedi' value='T??vf??t??s egyedi m??r??vel'>T??vf??t??s egyedi m??r??vel</option>
                            <option key='egyeb' value='Egy??b'>Egy??b</option>
                        </Input>
                    </div>
                    <br />
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <Label>Hirdethet??</Label>
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
                                <Label>Erk??ly</Label>
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
                                <Label>??j ??p??t??s</Label>
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
                    <Button type='submit' color='success'>Ment??s</Button>
                    <Button type='button' color='secondary' onClick={() => toggleModal()}>M??gsem</Button>
                </ModalFooter>
                </Form>
            </Modal>
        );
    }

    const renderFigyelmeztetesModal = () => {
        return (
            <Modal isOpen={figyelmeztetesModal} toggle={toggleFigyelmeztetes}>
                <ModalHeader>
                    Figyelmeztet??s!
                </ModalHeader>
                <ModalBody>
                    K??rlek az ingatlan ??r??ban a ment??skor ne szerepeljen se sz??koz, se pont ??s p??nznem! Emellett az alapter??let, a telekm??ret ??s a be??p??thet??s??g mez??ben ne szerepeljen m2! MIndent a weboldal int??z a megjelen??skor!
                    K??sz??n??m! :) 
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggleFigyelmeztetes}>Rendben van, ??rtettem!</Button>
                </ModalFooter>
            </Modal>
        );
    }

    return (
        // <div className='tartalom-admin'>
            <div className='row'>
                <div className='col-md-12'>
                    <Button type='button' color='success' onClick={handleNewClick}>Ingatlanhirdet??s hozz??ad??sa</Button>
                    &nbsp;&nbsp;
                    <Button type='button' color='info' onClick={() => generateXml()}>XML file gener??l??sasa</Button>
                    <br /><br />
                    {renderModal()}
                    {ingatlanokJson && ingatlanokJson.length !== 0 && renderTable()}
                    {renderFigyelmeztetesModal()}
                </div>
            </div>
        // </div>
    );
}

export default Ingatlanok;