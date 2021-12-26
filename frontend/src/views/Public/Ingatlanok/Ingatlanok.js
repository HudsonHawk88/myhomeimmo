import React, { useState, useEffect } from 'react';
import { Input, Label, Button } from 'reactstrap';
import { useLocation } from 'react-router-dom'

import { handleInputChange } from '../../../commons/InputHandlers';
import FooldalContent from '../Fooldal/FooldalContent';
import Loading from '../../../commons/Loading';

import Services from './Services';

const Ingatlanok = (props) => {
    const { location } = props;

    const defaultTelepulesObj = {
        telepulesnev: 'Zalaegerszeg',
        irszam: '8900',
        km: '0'
    }

    const [ telepulesObj, setTelepulesObj ] = useState(defaultTelepulesObj);

    const defaultKeresoObj = {
        tipus: '',
        statusz: '',
        irszam: '8900',
        referenciaSzam: '',
        ar: '',
        alapterulet: '',
        szobaszam: '',
        telepules: defaultTelepulesObj,
        referenciaSzam: '',
        telek: '',
        emelet: '',
        epitesmod: '',
        futes: '',
        allapot: '',
        isErkely: false,
        isLift: false,
        isUjEpitesu: false
    }

    const [ keresoObj, setKeresoObj ] = useState(defaultKeresoObj);
   
    const [ ingatlanok, setIngatlanok ] = useState([]);
    const [ telepulesekOpts, setTelepulesekOpts ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const scrollToElement = (id) => {
        var element = document.getElementById(id);
        if (element) {
            element.scrollIntoView();
        }
    }

    useEffect(() => {
        if(loading) {
            scrollToElement('root')
        } 
    }, [loading])

    const listIngatlanok = (kereso) => {
        setLoading(true);
        Services.keresesIngatlanok(kereso).then((res) => {
            if (!res.err) {
                setIngatlanok(res)
                setLoading(false);
                
            }
        })
    }

    useEffect(() => {
        if (location && location.search) {
            
            let kereso = location.search.substring(1);
            kereso = JSON.parse('{"' + decodeURI(kereso).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            // kereso.telepules = JSON.parse(kereso.telepules)
            const keresoObjKeys = Object.keys(keresoObj);
            const keresoKey = Object.keys(kereso);
            const newObj = {}
            keresoObjKeys.forEach((key) => {
                keresoKey.forEach((kkey) => {
                    if (key === kkey) {
                        if (kkey === 'telepules') {
                            let newValue = JSON.parse(kereso[kkey]);
                            newObj[key] = newValue;
                        } else {
                            newObj[key] = kereso[key];
                        }
                    } else {
                        newObj[key] = kereso[key] ? kereso[key] : '';
                    }
                })
            })
            setKeresoObj(newObj);
            listIngatlanok(newObj);
        }
    }, [location])

    const [ telepulesek, setTelepulesek ] = useState([]);

    const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
              setTelepulesek(res);
              setTelepulesekOpts(res);
            } 
          });
    }

    const isIrszamTyped = () => {
        if (keresoObj.irszam && keresoObj.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        listTelepulesek();
    }, []);

    const keres = () => {
        let keresObj = keresoObj;
        keresoObj.telepules = telepulesObj;
        listIngatlanok(keresObj)
    }

    useEffect(() => {
        if (isIrszamTyped()) {
          Services.getTelepulesByIrsz(keresoObj.irszam).then((res) => {
            if (!res.err) {
              setTelepulesObj({
                  ...telepulesObj,
                  telepulesnev: res[0].telepulesnev,
                  irszam: res[0].irszam
              })
              setTelepulesekOpts(res);
            } else {
              props.notification('error', res.msg)
            }
          });
        } else {
            setTelepulesekOpts(telepulesek);
            setTelepulesObj(defaultTelepulesObj)
        }
      }, [isIrszamTyped(), keresoObj.irszam]);

      const renderTelepulesekOptions = () => {
        if (telepulesekOpts.length !== 0) {
            return telepulesekOpts.map((telepules) => {
            return (
                <option key={telepules.id} value={telepules.telepulesnev}>
                {telepules.telepulesnev}
                </option>
            );
            });
        }
    };

    const renderKmOptions = () => {
        return (
            <React.Fragment>
                <option key="0" value="0">+ 0 km</option>
                <option key="5" value="5">+ 5 km</option>
                <option key="10" value="10">+ 10 km</option>
                <option key="15" value="15">+ 15 km</option>
                <option key="20" value="20">+ 20 km</option>
                <option key="25" value="25">+ 25 km</option>
                <option key="30" value="30">+ 30 km</option>
                <option key="35" value="35">+ 35 km</option>
                <option key="40" value="40">+ 40 km</option>
                <option key="45" value="45">+ 45 km</option>
                <option key="50" value="50">+ 50 km</option>
            </React.Fragment>
        );
    }

    const renderKereso = () =>{
        return (
            <div className='reszletes_kereso' id='reszletes_kereso'>
                
                <div className='row'>
                <h3>Összetett kereső:</h3><br/>
                <div className='col-md-6'>
                    <Label>Ingatlan státusza:</Label>
                    <Input
                        type='select'
                        name='statusz'
                        id='statusz'
                        value={keresoObj.statusz}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    >
                        <option key='' value=''>Kérjük válasszon státuszt...</option>
                        <option key='elado' value='Eladó'>Eladó</option>
                        <option key='kiadó' value='Kiadó'>Kiadó</option>
                    </Input>
                </div>
                <div className='col-md-6'>
                <Label>Ingatlan típusa:</Label>
                <Input
                    type='select'
                    name='tipus'
                    id='tipus'
                    value={keresoObj.tipus}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
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
                <div className='col-md-12' />
                <br />
                <div className='col-md-4'>
                    <Label>Irányítószám:</Label>
                    <Input
                        type='text'
                        name='irsz'
                        id='irsz'
                        value={keresoObj.irsz}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Település:</Label>
                    <Input
                        type='select'
                        name='telepulesnev'
                        id='telepulesnev'
                        value={telepulesObj.telepulesnev}
                        onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)}
                    >
                        {
                            keresoObj.irsz === '' && (
                                <option key='' value=''>Kérjük válasszon települést...</option>
                            ) 
                        }
                        {renderTelepulesekOptions()}
                    </Input>
                </div>
                <div className='col-md-4'>
                    <Label>+ Km </Label>
                    <Input
                        type='select'
                        name='km'
                        id='km'
                        value={telepulesObj.km}
                        onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)}
                    >
                        {renderKmOptions()}
                    </Input>
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-4'>
                    <Label>Max. ár: (Ft)</Label>
                    <Input
                        type='text'
                        id='ar'
                        name='ar'
                        value={keresoObj.ar}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Min. alapterület: (m2)</Label>
                    <Input
                        type='text'
                        id='alapterulet'
                        name='alapterulet'
                        value={keresoObj.alapterulet}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Szobaszám:</Label>
                    <Input
                        type='text'
                        id='szobaszam'
                        name='szobaszam'
                        value={keresoObj.szobaszam}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-4'>
                    <Label>Referencia szám:</Label>
                    <Input
                        type='text'
                        id='referenciaSzam'
                        name='referenciaSzam'
                        value={keresoObj.referenciaSzam}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Min. telekméret: (m2)</Label>
                    <Input
                        type='text'
                        id='telek'
                        name='telek'
                        value={keresoObj.telek}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Emelet:</Label>
                    <Input
                        type='text'
                        id='emelet'
                        name='emelet'
                        value={keresoObj.emelet}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-4'>
                    <Label>Építés módja: *</Label>
                    <Input
                        type='select'
                        name='epitesmod'
                        id='epitesmod'
                        value={keresoObj.epitesmod}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
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
                <div className='col-md-4'>
                    <Label>Fűtés módja:</Label>
                    <Input
                        type='select'
                        name='futes'
                        id='futes'
                        value={keresoObj.futes}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
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
                <div className='col-md-4'>
                    <Label>Ingatlan állapota:</Label>
                    <Input
                        type='select'
                        name='allapot'
                        id='allapot'
                        value={keresoObj.allapot}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
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
                <div className='col-md-12' />
                <br />
                <div className='col-md-4'>
                    <Label>Erkély</Label>
                    &nbsp;&nbsp;
                    <Input
                        type='checkbox'
                        id='isErkely'
                        name='isErkely'
                        checked={keresoObj.isErkely}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Lift</Label>
                    &nbsp;&nbsp;
                    <Input
                        type='checkbox'
                        id='isLift'
                        name='isLift'
                        checked={keresoObj.isLift}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Új építés</Label>
                    &nbsp;&nbsp;
                    <Input
                        type='checkbox'
                        id='isUjEpitesu'
                        name='isUjEpitesu'
                        checked={keresoObj.isUjEpitesu}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <Button color='success' onClick={() => keres()}>
                    <i className="fas fa-search"></i>&nbsp;&nbsp;
                    Keresés
                </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='public-inner-content'>
            {renderKereso()}
            <div className='nodata'>
                {ingatlanok.length === 0 && 'A keresés nem hozott találatot vagy nem választott egyetlen szűrőfeltételt sem!'}
            </div>
            {loading ? (
                <Loading isLoading={loading} />
            ) : (
                <FooldalContent ingatlanok={ingatlanok} />
            )} 
            
          </div>
    );
}

export default Ingatlanok;