import React, { useState, useEffect } from 'react';
import { Button, Input, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { handleInputChange } from '../../../commons/InputHandlers';
import Services from './Services';

const KeresoForm = (props) => {
    const navigate = useNavigate();

    const defaultTelepulesObj = {
        telepulesnev: 'Zalaegerszeg',
        irszam: '',
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
        telepules: defaultTelepulesObj
    }

    const [ keresoObj, setKeresoObj ] = useState(defaultKeresoObj)
    const [ telepulesek, setTelepulesek ] = useState([]);
    const [ telepulesekOpts, setTelepulesekOpts ] = useState([]);

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

    useEffect(() => {
        if (isIrszamTyped()) {
          Services.getTelepulesByIrsz(keresoObj.irszam).then((res) => {
            if (!res.err) {
              setTelepulesObj({
                ...telepulesObj,
                irszam: res[0].irszam
              });
              setTelepulesekOpts(res)
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

    const getOnlyFiltered = () => {
        let newKereso = {}

        const keys = Object.keys(keresoObj);
        if (keresoObj['referenciaSzam'] !== '') {
            newKereso['referenciaSzam'] = keresoObj.referenciaSzam;
        } else {
          keys.forEach((filter) => {
            if (keresoObj[filter] !== '') {
                newKereso[filter] = keresoObj[filter];
                newKereso.telepules = telepulesObj
            }
          })
        }
        return newKereso;
    }

    const keres = () => {
        let keres = getOnlyFiltered();
        keres.telepules=JSON.stringify(keres.telepules)
        const queryParams = Object.keys(keres).map(key => key + '=' + keres[key]).join('&');
        navigate(`/ingatlanok?${queryParams}`)
    }

    return (
        <div className='row' style={{ padding: '10px' }}>
            <h4>Gyorskereső</h4><br />
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
            <div className='col-md-6'>
                <Label>Irányítószám:</Label>
                <Input
                    type='text'
                    name='irszam'
                    id='irszam'
                    value={keresoObj.irszam}
                    onChange={(e) => { handleInputChange(e, keresoObj, setKeresoObj); setTelepulesObj({ ...telepulesObj, irszam: e.target.value }) }}
                />
            </div>
            <div className='col-md-6'>
                <Label>Település:</Label>
                <Input
                    type='select'
                    name='telepulesnev'
                    id='telepulesnev'
                    value={telepulesObj.telepulesnev}
                    onChange={(e) => handleInputChange(e, telepulesObj, setTelepulesObj)}
                >
                    <option key='' value=''>Kérjük válasszon települést...</option>  
                    {renderTelepulesekOptions()}
                </Input>
            </div>
            <div className='col-md-12' />
            <br />
            <div className='col-md-3'>
                <Label>Referenciaszám:</Label>
                <Input
                    type='text'
                    name='referenciaSzam'
                    id='referenciaSzam'
                    value={keresoObj.referenciaSzam}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                />
            </div>
            <div className='col-md-3'>
                <Label>Ár:</Label>
                <Input
                    type='text'
                    name='ar'
                    id='ar'
                    value={keresoObj.ar}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                />
            </div>
            <div className='col-md-3'>
                <Label>Alapterület:</Label>
                <Input
                    type='text'
                    name='alapterulet'
                    id='alapterulet'
                    value={keresoObj.alapterulet}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                />
            </div>
            <div className='col-md-3'>
                <Label>Szobaszám:</Label>
                <Input
                    type='text'
                    name='szobaszam'
                    id='szobaszam'
                    value={keresoObj.szobaszam}
                    onChange={(e) => handleInputChange(e, keresoObj, setKeresoObj)}
                />
            </div>
            <div className='col-md-12' />
            <br />
            <div className='col-md-12'>
                <Button color='success' onClick={() => keres()}>
                    <i className="fas fa-search"></i>&nbsp;&nbsp;
                    Keresés
                </Button>
            </div>
        </div>
    );
}

export default KeresoForm;