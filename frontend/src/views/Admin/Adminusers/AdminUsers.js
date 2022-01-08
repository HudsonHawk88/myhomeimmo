import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDropzone } from 'react-dropzone';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const AdminUsers = (props) => {

    const defaultNev = {
        titulus: '',
        vezeteknev: '',
        keresztnev: ''
    }

    const defaultCim = {
        orszag: '',
        irszam: '',
        telepules: '',
        kozterulet: '',
        hazszam: '',
        hrsz: '',
        postsfiok: '',
        epulet: '',
        emelet: '',
        ajto: ''
    }

    const defaultTelefon = {
        orszaghivo: '',
        korzet: '',
        telszam: ''
    }

    const defaultAdminUser = {
        email: '',
        username: '',
        password: '',
        avatar: [],
        roles: [],
        isErtekesito: false
    }

    const [ orszagok, setOrszagok ] = useState([]);
    const [ telepulesek, setTelepulesek ] = useState([]); 
    const [ adminusersJson, setAdminUsersJson ] = useState([]);
    const [ roleOptions, setRoleOptions ] = useState([]);
    const [ adminUser, setAdminUser ] = useState(defaultAdminUser);
    const [ nev, setNev ] = useState(defaultNev);
    const [ cim, setCim ] = useState(defaultCim);
    const [ telefon, setTelefon ] = useState(defaultTelefon);
    const [ currentId, setCurrentId ] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const { addNotification } = props;

    const listAdminUsers = () => {
        Services.listAdminUsers().then((res) => {
            if (!res.err) {
                setAdminUsersJson(res);
            } else {
                addNotification(res.err);
            }
        });
    }

    const setDefault = (orszagokList) => {
        const lang = navigator.language;
        if (lang === 'hu-HU') {
            orszagokList.forEach((orsz) => {
                if (orsz.orszagkod === 'hun') {
                    setCim({
                        ...cim,
                        orszag: orsz
                    });
                }
            });
        }
    }

    const getOrszagok = () => {
        Services.listOrszagok().then((res) => {
            if (!res.err) {
              setOrszagok(res);
              setDefault(res);
            }   
          });
    }

    const getTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
              setTelepulesek(res);
            }
        });
    }

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz).then((res) => {
            if (!res.err) {
              setCim({
                ...cim,
                telepules: res[0]
              });
            } else {
              addNotification('error', res.msg)
            }
        });
    }

    const isIrszamTyped = () => {
        if (cim.irszam && cim.irszam.length === 4) {
          return true;
        } else {
          return false;
        }
    };

    const getRoles = () => {
        Services.getRoles().then((res) => {
            if (!res.err) {
                setRoleOptions(res);
            }
        });        
    }

    const init = () => {
        getOrszagok();
        getTelepulesek();
        listAdminUsers();
        getRoles();
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (isIrszamTyped()) {
          const irsz = cim.irszam;
          getTelepulesByIrsz(irsz);
        }
    }, [isIrszamTyped(), cim.irszam]);

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
    if (telepulesek.length !== 0) {
        return telepulesek.map((telepules) => {
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

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    }

    const getAdminUser = (id) => {
        Services.getAdminUser(id).then((res) => {
            if (!res.err) {
                setNev(res.nev);
                setCim(res.cim);
                setTelefon(res.telefon)
                setAdminUser({ email: res.email, username: res.username, password: '', roles: res.roles, avatar: res.avatar !== 'undefined' ? res.avatar : [], isErtekesito: res.isErtekesito })
            } else {
                addNotification(res.err);
            }
        })
    }

    const handleNewClick = () => {
        setCurrentId(null);
        setAdminUser(defaultAdminUser);
        setNev(defaultNev);
        setCim({
            ...cim,
            irszam: '',
            telepules: '',
            kozterulet: '',
            hazszam: '',
            hrsz: '',
            postsfiok: '',
            epulet: '',
            emelet: '',
            ajto: ''
        })
        setTelefon(defaultTelefon);
        toggleModal();
    }

    const handleEditClick = (id) => {
        setCurrentId(id);
        getAdminUser(id);
        toggleModal();
    }

    const onSave = () => {
        let user = JSON.parse(JSON.stringify(adminUser));
        user.nev = nev;
        user.cim = cim;
        user.telefon = telefon;

        if (!currentId) {
            Services.addAdminUser(user).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        } else {
            Services.editAdminUser(user, currentId).then((res) => {
                if (!res.err) {
                    toggleModal();
                    listAdminUsers();
                    addNotification('success', res.msg);
                } else {
                    addNotification('error', res.err);
                }
            })
        }
    }

    const deleteImage = (src) => {
        let kepek = adminUser.avatar;
        let filtered = kepek.filter((kep) => kep.src !== src);
        setAdminUser({
            ...adminUser,
            avatar: filtered
        })
    }

    const MyDropzone = () => {

        const imageStyle = {
            maxHeight: '100%',
            maxWidth: '100%'
        }

        let kep = {};
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
                    title: file.name
                }
                
                setAdminUser({
                    ...adminUser,
                    avatar: [...adminUser.avatar, kep]
                })
        
              }
           
             
        
              reader.readAsDataURL(file)
            })
            
          }, []);

          const {getRootProps, getInputProps} = useDropzone({onDrop});

          return (
            <React.Fragment>
                <div hidden={adminUser && adminUser.avatar && adminUser.avatar.length > 0} {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <div className='row'>
                    {adminUser && adminUser.avatar && adminUser.avatar.map((kep, index) => {
                        return (
                            <Card key={index.toString()} className='col-md-3'>
                                <CardTitle>{kep.nev}</CardTitle>
                                <CardBody>
                                    <img style={imageStyle} src={kep.src} alt={kep.nev} />
                                </CardBody>
                                <CardFooter>
                                    <Button onClick={() => deleteImage(kep.src)}>Törlés</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </React.Fragment>
          )
    }



    const renderModal = () => {
        return (
            <Modal isOpen={modalOpen} toggle={toggleModal} size='xl' backdrop='static'>
                <ModalHeader>
                    {!currentId ? 'Admin felhasználó hozzáadása' : 'Admin felhasználó módosítása'}
                </ModalHeader>
                <ModalBody>
                    <h4>Alapadatok:</h4>
                    <br />
                    <div className="row">
                        <div className="col-md-2">
                            <Label>Titulus:</Label>
                            <Input
                                name="titulus"
                                type="text"
                                onChange={(e) => handleInputChange(e, nev, setNev)}
                                value={nev.titulus}
                            />
                        </div>
                        <div className="col-md-5">
                            <Label>Vezetéknév:</Label>
                            <Input
                                name="vezeteknev"
                                type="text"
                                onChange={(e) => handleInputChange(e, nev, setNev)}
                                value={nev.vezeteknev}
                            />
                        </div>
                        <div className="col-md-5">
                            <Label>Keresztnév:</Label>
                            <Input
                                name="keresztnev"
                                type="text"
                                onChange={(e) => handleInputChange(e, nev, setNev)}
                                value={nev.keresztnev}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className="col-md-5">
                            <Label>Ország:</Label>
                            <Input
                                type="select"
                                id="orszag"
                                name="orszag"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.orszag.id}
                            >
                                <option key="default" value="">
                                    {"Kérjük válasszon országot..."}
                                </option>
                                {renderOrszagokOptions()}
                            </Input>
                        </div>
                        <div className="col-md-2">
                            <Label>Irányítószám:</Label>
                            <Input
                                name="irszam"
                                id="irszam"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.irszam}
                            />
                        </div>
                        <div className="col-md-5">
                            <Label>Település:</Label>
                            <Input
                                type="select"
                                name="telepules"
                                id="telepules"
                                disabled={
                                    !cim.irszam ||
                                    (cim.irszam && cim.irszam.length !== 4)
                                }
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.telepules.id}
                            >
                                <option key="default" value="">
                                    {"Kérjük válasszon települést..."}
                                </option>
                                {renderTelepulesekOptions()}
                            </Input>
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className="col-md-6">
                            <Label>Közterület:</Label>
                            <Input
                                name="kozterulet"
                                id="kozterulet"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.kozterulet}
                            />
                        </div>
                        <div className="col-md-2">
                            <Label>Házszám:</Label>
                            <Input
                                name="hazszam"
                                id="hazszam"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.hazszam}
                            />
                        </div>
                        <div className="col-md-2">
                            <Label>Helyrajzi szám:</Label>
                            <Input
                                name="hrsz"
                                id="hrsz"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.hrsz}
                            />
                        </div>
                        <div className="col-md-2">
                            <Label>Postafiók:</Label>
                            <Input
                                name="postafiok"
                                id="postafiok"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.postafiok}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className="col-md-4">
                            <Label>Épület:</Label>
                            <Input
                                name="epulet"
                                id="epulet"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.epulet}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>Emelet:</Label>
                            <Input
                                name="emelet"
                                id="emelet"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.emelet}
                            />
                        </div>
                        <div className="col-md-4">
                            <Label>Ajtó:</Label>
                            <Input
                                name="ajto"
                                id="ajto"
                                type="text"
                                onChange={(e) => handleInputChange(e, cim, setCim)}
                                value={cim.ajto}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className="col-md-6">
                            <div className='row'>
                                <div className='col-md-3'>
                                    <Label>Országhívó:</Label>
                                    <Input
                                        type='text'
                                        name='orszaghivo'
                                        id='orszaghivo'
                                        onChange={(e) => handleInputChange(e, telefon, setTelefon)}
                                        value={telefon.orszaghivo}
                                    />
                                </div>
                                <div className='col-md-3'>
                                    <Label>Körzetszám:</Label>
                                    <Input
                                        type='text'
                                        name='korzet'
                                        id='korzet'
                                        onChange={(e) => handleInputChange(e, telefon, setTelefon)}
                                        value={telefon.korzet}
                                    />
                                </div>
                                <div className='col-md-6'>
                                    <Label>Telefonszám:</Label>
                                    <Input
                                        type='text'
                                        name='telszam'
                                        id='telszam'
                                        onChange={(e) => handleInputChange(e, telefon, setTelefon)}
                                        value={telefon.telszam}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Label>Jogosultságok:</Label>
                            <Select
                                name="roles"
                                id="roles"
                                options={roleOptions}
                                isMulti
                                onChange={(e) => setAdminUser({ ...adminUser, roles: e })}
                                value={adminUser.roles}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                            <Label>Avatar: *</Label>
                            <MyDropzone multiple={false}  />
                        </div>
                    </div>
                    <hr />
                    <h4>Belépéshez szükséges adatok:</h4>
                    <br />
                    <div className='row'>
                        <div className="col-md-3">
                            <Label>Email: *</Label>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                value={adminUser.email}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label>Felhasználónév: *</Label>
                            <Input
                                name="username"
                                id="username"
                                type="text"
                                onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                value={adminUser.username}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label>Jelszó: *</Label>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                value={adminUser.password}
                            />
                        </div>
                        <div className="col-md-3">
                            <Label>Értékesítő: *</Label>
                            <Input
                                name="isErtekesito"
                                id="isErtekesito"
                                type="checkbox"
                                onChange={(e) => handleInputChange(e, adminUser, setAdminUser)}
                                checked={adminUser.isErtekesito}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={() => onSave()}>Mentés</Button>
                    <Button color='secondary' onClick={() => toggleModal()}>Mégsem</Button>
                </ModalFooter>
            </Modal>
        );
    }

    const nevFormatter = (nev) => {
        return `${nev.titulus} ${nev.vezeteknev} ${nev.keresztnev}`;
    }

    const telefonFormatter = (telefonszam) => {
        return `${telefonszam.orszaghivo}-${telefonszam.korzet}/${telefonszam.telszam}`;
    }

    const tableIconFormatter = (cell, row, rowIndex) => {
        return (
          <React.Fragment>
            <Button
              key={rowIndex}
              color="link"
            //   onClick={() => handleViewClick(cell)}
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
            //   onClick={() => handleDeleteClick(cell)}
            >
              <i key={rowIndex + 5} className="fas fa-trash" />
            </Button>
          </React.Fragment>
        );
    };

    const renderTable = () =>{
        const columns = [
            {
                dataField: 'nev',
                text: 'Név',
                formatter: nevFormatter
            },
            {
                dataField: 'username',
                text: 'Felhasználónév'
            },
            {
                dataField: 'telefon',
                text: 'Telefonszám',
                formatter: telefonFormatter
            },
            {
                dataField: 'id',
                text: 'Műveletek',
                formatter: tableIconFormatter
            }
        ];

        return (
            <BootstrapTable 
                bootstrap4
                data={adminusersJson}
                columns={columns}
                keyField='id'
            />
        );
    }

    return (
        <div className='row'>
            <div className='col-md-12'>
                <Button type='button' color='success' onClick={() => handleNewClick()}> + Admin hozzáadása </Button><br /><br />
                {renderModal()}
                {renderTable()}
            </div>
        </div>
    );
}

export default AdminUsers;