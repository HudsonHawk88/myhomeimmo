import React, { useState, useEffect } from 'react';
import { Input, Label, Button } from 'reactstrap';
import Select from 'react-select';

import { handleInputChange } from '../../../commons/InputHandlers';
import FooldalContent from '../Fooldal/FooldalContent';
import Loading from '../../../commons/Loading';

import Services from './Services';

const Ingatlanok = (props) => {
    const { location } = props;

    const defaultTelepulesObj = {
        telepulesnev: '',
        irszam: '',
        km: '0'
    }

    const [ telepulesObj, setTelepulesObj ] = useState(defaultTelepulesObj);
    const [ telepulesek, setTelepulesek ] = useState([]);

    const defaultKeresoObj = {
        tipus: '',
        statusz: '',
        irszam: '',
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


    const getTelepulesekOpts = (items) => {
        let telOpts = [];
        items.forEach((item) => {
            telOpts.push({
                label: item.telepulesnev,
                value: item.telepulesnev,
                irszam: item.irszam
            });
        });
        setTelepulesekOpts(telOpts);
        if (telOpts.length === 1) {
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: telOpts[0].value,
                irszam: telOpts[0].irszam
            });
        }  
    }

    const handleTelepulesChange = (e) => {
        if (e) {
            setTelepulesekOpts([e]);
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: e.label,
                irszam: e.irszam
            });
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    ...keresoObj.telepules,
                    telepulesnev: e.label,
                    irszam: e.irszam
                }
            })
        } else {
            setKeresoObj({
                ...keresoObj,
                telepules: {
                    telepulesnev: '',
                    irszam: '',
                    km: '0'
                },
                irszam: ''
            });
            setTelepulesObj({
                ...telepulesObj,
                telepulesnev: '',
                irszam: ''
            })
            getTelepulesekOpts(telepulesek);
        }

    }

    useEffect(() => {
        if (location && location.search) {
            let kereso = location.search.substring(1);
            kereso = JSON.parse('{"' + decodeURI(kereso).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            if (kereso && kereso.telepules !== 'undefined') {
                kereso.telepules = JSON.parse(kereso.telepules);
            }
            
            const keresoObjKeys = Object.keys(keresoObj);
            const keresoKey = Object.keys(kereso);
            const newObj = {}
                keresoObjKeys.forEach((key) => {
                keresoKey.forEach((kkey) => {
                    if (key === kkey) {
                        if (kkey === 'telepules') {
                            newObj[kkey] = kereso[kkey];
                            if (kereso[kkey].telepulesnev !== '' || kereso[kkey].irszam !== '') {
                                setTelepulesObj(kereso[kkey]);
                            } else {
                                setTelepulesObj({
                                    ...telepulesObj,
                                    irszam: 8900
                                });
                                getTelepulesByIrsz('8900')
                            }
                        } else {
                            newObj[kkey] = kereso[kkey];
                        }
                    } else {
                        newObj[key] = kereso[key] ? kereso[key] : '';
                    }
                })
            });
            setKeresoObj(newObj);
            listIngatlanok(newObj);
        } else {
            setTelepulesObj({
                ...telepulesObj,
                irszam: 8900
            });
            getTelepulesByIrsz('8900')
        }
    }, [location]);
   
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
                // console.log(res);
                setIngatlanok(res)
                setLoading(false);
            }
        })
        // console.log(ingatlanok);
    }

    const listTelepulesek = () => {
        Services.listTelepulesek().then((res) => {
            if (!res.err) {
              setTelepulesek(res);
            } 
          });
    }

    const isIrszamTyped = () => {
        if (telepulesObj.irszam && telepulesObj.irszam.length === 4) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        listTelepulesek();
    }, []);

    const keres = () => {
        let newKereso = keresoObj;
        newKereso.telepules = telepulesObj;
        listIngatlanok(newKereso)
    }

    const getTelepulesByIrsz = (irsz) => {
        Services.getTelepulesByIrsz(irsz).then((res) => {
            if (!res.err) {
                if (res.length === 1) {
                    setTelepulesObj({
                        ...telepulesObj,
                        telepulesnev: res[0].telepulesnev,
                        irszam: res[0].irszam
                    });
                    getTelepulesekOpts(res);
                } else {
                    setTelepulesObj({
                        ...telepulesObj,
                        telepulesnev: keresoObj.telepules.telepulesnev,
                        irszam: res[0].irszam
                    });
                    if (keresoObj.telepules.telepulesnev === '') {
                        getTelepulesekOpts(res);
                    } else {
                        setTelepulesekOpts([{ label: keresoObj.telepules.telepulesnev, value: keresoObj.telepules.telepulesnev, irszam: keresoObj.telepules.irszam }]);
                    }
                }
            }
          });
    }

    useEffect(() => {
        if (isIrszamTyped()) {
          getTelepulesByIrsz(telepulesObj.irszam)
        }
      }, [isIrszamTyped()]);


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
                <h3>??sszetett keres??:</h3>
                <div className='row'>
                <div className='col-md-6'>
                    <Label>Ingatlan st??tusza:</Label>
                    <Input
                        type='select'
                        name='statusz'
                        id='statusz'
                        value={keresoObj.statusz}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    >
                        <option key='' value=''>K??rj??k v??lasszon st??tuszt...</option>
                        <option key='elado' value='Elad??'>Elad??</option>
                        <option key='kiad??' value='Kiad??'>Kiad??</option>
                    </Input>
                </div>
                <div className='col-md-6'>
                <Label>Ingatlan t??pusa:</Label>
                <Input
                    type='select'
                    name='tipus'
                    id='tipus'
                    value={keresoObj.tipus}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                >
                    <option key='' value=''>K??rj??k v??lasszon t??pust...</option>
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
                </div>
                <div className='row g-3'>
                <div className='col-md-4'>
                    <Label>Ir??ny??t??sz??m:</Label>
                    <Input
                        type='text'
                        name='irszam'
                        id='irszam'
                        value={telepulesObj.irszam}
                        onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Telep??l??s:</Label>
                    <Select
                        type='select'
                        name='telepulesnev'
                        id='telepulesnev'
                        options={telepulesekOpts}
                        value={telepulesekOpts.length === 1 ? telepulesekOpts[0] : ''}
                        isClearable
                        placeholder='K??rj??k v??lasszon telep??l??st...'
                        onChange={(e) => { handleTelepulesChange(e); if(e) { setTelepulesObj({ ...telepulesObj, telepulesnev: e.value }) } }}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>+ km </Label>
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
                </div>
                <div className='row g-3'>
                <div className='col-md-4'>
                    <Label>Max. ??r: (Ft)</Label>
                    <Input
                        type='text'
                        id='ar'
                        name='ar'
                        value={keresoObj.ar}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Min. alapter??let: (m2)</Label>
                    <Input
                        type='text'
                        id='alapterulet'
                        name='alapterulet'
                        value={keresoObj.alapterulet}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Szobasz??m:</Label>
                    <Input
                        type='text'
                        id='szobaszam'
                        name='szobaszam'
                        value={keresoObj.szobaszam}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                </div>
                <div className='row g-3'>
                <div className='col-md-4'>
                    <Label>Referencia sz??m:</Label>
                    <Input
                        type='text'
                        id='referenciaSzam'
                        name='referenciaSzam'
                        value={keresoObj.referenciaSzam}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                <div className='col-md-4'>
                    <Label>Min. telekm??ret: (m2)</Label>
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
                </div>
                <div className='row g-3'>
                <div className='col-md-4'>
                    <Label>??p??t??s m??dja: *</Label>
                    <Input
                        type='select'
                        name='epitesmod'
                        id='epitesmod'
                        value={keresoObj.epitesmod}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    >
                        <option key='' value=''>K??rj??k v??lasszon ??p??t??si m??dot...</option>
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
                <div className='col-md-4'>
                    <Label>F??t??s m??dja:</Label>
                    <Input
                        type='select'
                        name='futes'
                        id='futes'
                        value={keresoObj.futes}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    >
                        <option key='' value=''>K??rj??k v??lasszon ??p??t??si f??t??si m??dot...</option>
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
                <div className='col-md-4'>
                    <Label>Ingatlan ??llapota:</Label>
                    <Input
                        type='select'
                        name='allapot'
                        id='allapot'
                        value={keresoObj.allapot}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    >
                        <option key='' value=''>K??rj??k v??lasszon ??llapotot...</option>
                        <option key='atlagos' value='??tlagos'>??tlagos</option>
                        <option key='felujitando' value='Fel??j??tand??'>Fel??j??tand??</option>
                        <option key='felujitott' value='Fel??j??tott'>Fel??j??tott</option>
                        <option key='jo' value='J??'>J??</option>
                        <option key='kivalo' value='Kiv??l??'>Kiv??l??</option>
                        <option key='uj' value='??j'>??j</option>
                    </Input>
                </div>
                </div>
                <div className='row g-3'>
                <div className='col-md-4'>
                    <Label>Erk??ly</Label>
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
                    <Label>??j ??p??t??s</Label>
                    &nbsp;&nbsp;
                    <Input
                        type='checkbox'
                        id='isUjEpitesu'
                        name='isUjEpitesu'
                        checked={keresoObj.isUjEpitesu}
                        onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                    />
                </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <Button color='success' onClick={() => keres()}>
                            <i className="fas fa-search"></i>&nbsp;&nbsp;
                            Keres??s
                        </Button>
                    </div>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div className='public-inner-content'>
            {renderKereso()}
            <div className='nodata'>
                {ingatlanok.length === 0 && 'A keres??s nem hozott tal??latot vagy nem v??lasztott egyetlen sz??r??felt??telt sem!'}
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