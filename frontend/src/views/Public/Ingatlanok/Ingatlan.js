import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Form, Label, Input, Button } from 'reactstrap';

import { handleInputChange } from '../../../commons/InputHandlers';

import Gallery from '../../../commons/Gallery';
import Loading from '../../../commons/Loading';
import Services from './Services';

const Ingatlan = (props) => {
    const { location, addNotification } = props;
    const { state } = location;

    const defaultIngatlanObj = {
        alapterulet: '',
        allapot: '',
        ar: '',
        beepithetoseg: '',
        cim: '',
        emelet: '',
        epitesmod: '',
        felszobaszam: '',
        futes: '',
        gaz: '',
        helyseg: {},
        id: '',
        irsz: '',
        isAktiv: false,
        isErkely: false,
        isHirdetheto: false,
        isKiemelt: false,
        isLift: false,
        isUjEpitesu: false,
        kaucio: '',
        kepek: [],
        leiras: '',
        refid: '',
        rogzitIdo: '',
        rogzitoAvatar: [],
        rogzitoEmail: '',
        rogzitoNev: '',
        rogzitoTelefon: '',
        statusz: '',
        szennyviz: '',
        szobaszam: '',
        telek: '',
        telektipus: '',
        telepules: '',
        tipus: '',
        villany: '',
        viz: ''
    }

    const defaultEmailObj = {
        nev: '',
        telefon: '',
        toEmail: '',
        email: '',
        refId: '',
        uzenet: ''
    }

    const [ ingatlanObj, setIngatlanObj ] = useState(defaultIngatlanObj);
    const [ loading, setLoading ] = useState(false);
    const [ emailObj, setEmailObj ] = useState(defaultEmailObj);
    const [ elfogadAdatkezeles, setElfogadAdatkezeles ] = useState(false);

    const getIngatlan = (id) => {
        setLoading(true);
        Services.getIngatlan(id).then((res) => {
            if (!res.err) {
                setIngatlanObj(res[0]);
                setLoading(false)
            }
        });
    }

    useEffect(() => {
        getIngatlan(state.id);
    }, [state.id]);


    const getKepek = () => {
        let items = [];

        if (ingatlanObj && ingatlanObj.kepek) {
            ingatlanObj.kepek.forEach((kep) => {
                items.push({
                    original: kep.src,
                    thumbnail: kep.src,
                    originalHeight: '400px',
                    // originalWidth: '100%',
                    // thumbnailHeight: '300px',
                    thumbnailWidth: '500px',
                    // sizes: '100%'
                })
            });
        }
        return items;
    }

    const getAvatar = (avatar) => {
        if (avatar) {
            return avatar[0]
        } else {
            return [];
        }
    }

    const arFormatter = (ingatlan) => {
        let kaucio = '';
        let ar = '';
        let illetek = '';
        function chunk(str, n) {
            var ret = [];
            var i;
            var len;
        
            for(i = 0, len = str.length; i < len; i += n) {
               ret.push(str.substr(i, n))
            }
        
            return ret
        };

        if (ingatlan.kaucio) {
            kaucio = ingatlan.kaucio;
            kaucio = kaucio.split('').reverse().join('');
            kaucio = chunk(kaucio, 3).join('.');
            kaucio = kaucio.split('').reverse().join('');
        }
        if (ingatlan.ar) {
            ar = ingatlan.ar;
            ar = ar.split('').reverse().join('');
            ar = chunk(ar, 3).join('.');
            ar = ar.split('').reverse().join('');
        }

        if (ingatlan.illetek) {
            illetek = ingatlan.illetek;
            illetek = illetek.split('').reverse().join('');
            illetek = chunk(illetek, 3).join('.');
            illetek = illetek.split('').reverse().join('');
        }
        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ar} Ft/hó ${ingatlanObj.kaucio ? 'Kaució: ' + kaucio + ' Ft' : '' }`;
            }
            case 'Illeték': {
                return `${illetek} Ft`
            }
            default: {
                return `Ár: ${ar} Ft`;
            } 
        }
    }

    const meretFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 'Telek': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case 'Ipari ingatlan': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case 'Mezőgazdasági terület': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            case 'Fejlesztési terület': {
                return `Méret: ${ingatlanObj.telek} m`;
            }
            default: {
                return `Méret: ${ingatlanObj.alapterulet} m`;
            } 
        }
    }

    const szobaFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 'Telek': {
                return '';
            }
            case 'Ipari ingatlan': {
                return '';
            }
            case 'Mezőgazdasági terület': {
                return '';
            }
            case 'Fejlesztési terület': {
                return '';
            }
            case 'Üzlethelyiség': {
                return '';
            }
            case 'Garázs': {
                return '';
            }
            case 'Raktár': {
                return ''
            }
            default: {
                if (ingatlan.felszobaszam) {
                    return (`Szoba: ${ingatlan.szobaszam} Félszoba: ${ingatlan.felszobaszam}`);
                } else {
                    return (`Szoba: ${ingatlan.szobaszam}`);
                }
            } 
        }
    }

    const szintFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 'Telek': {
                return '';
            }
            case 'Ipari ingatlan': {
                return '';
            }
            case 'Mezőgazdasági terület': {
                return '';
            }
            case 'Fejlesztési terület': {
                return '';
            }
            case 'Üzlethelyiség': {
                return '';
            }
            case 'Garázs': {
                return '';
            }
            case 'Raktár': {
                return ''
            }
            default: {
                if (ingatlan.emelet === 'Földszint') {
                    return (`Emelet: ${ingatlan.emelet}`);
                } else if(ingatlan.emelet === '') {
                    return ''
                } else {
                    return (`Emelet: ${ingatlan.emelet}. emelet`);
                }
            } 
        }
    }

    const sendMail = () => {
        let kuldObj = emailObj;
        kuldObj.toEmail = ingatlanObj.rogzitoEmail;
        // kuldObj.toEmail = 'info@inftechsol.hu';
        kuldObj.refId = ingatlanObj.refid

        Services.sendErdeklodes(kuldObj).then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
                setEmailObj(defaultEmailObj);
            } else {
                addNotification('error', res.err);
            }
        });
    }

    const getIlletek = (ar) => {
        let illetek = '';
        let ingar = parseInt(ar, 10);
        if (ingar && !isNaN(ar)) {
            illetek = ingar*0.04;
            illetek = illetek + '';
        }
        return arFormatter({ illetek: illetek, statusz: 'Illeték' });
    }

    const renderIngatlan = () => {
        let kep = getAvatar(ingatlanObj.rogzitoAvatar);
        return (
            <div className='ingatlan_card'>
            <div className='ingatlan_adatok'>
                <div className='ingatlan_cim'>
                    {ingatlanObj.cim}
                </div>
                <div className='galeria'>
                   <Gallery
                    showPlayButton={false}
                    useBrowserFullscreen={true}
                    thumbnailPosition='bottom'
                    items={getKepek()}
                   />
                </div>
                <div className='alapadatok'>
                    <strong>{arFormatter(ingatlanObj)}</strong>&nbsp;&nbsp;
                    {`Település: ${ingatlanObj.telepules}`}&nbsp;&nbsp;
                    {meretFormatter(ingatlanObj)}<sup>2</sup>&nbsp;&nbsp;
                    {szobaFormatter(ingatlanObj)}&nbsp;&nbsp;
                    {szintFormatter(ingatlanObj)}&nbsp;&nbsp;
                </div>
                <div className='adatok'>
                    <Card className='adat'>
                        <CardHeader><h4><strong>Ingatlan adatai</strong></h4></CardHeader>
                        <CardBody>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Ingatlan státusza: `}</strong>
                                        {ingatlanObj.statusz}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Építés módja: `}</strong>
                                        {ingatlanObj.epitesmod}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Ingatlan típusa: `}</strong>
                                        {ingatlanObj.tipus}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Település: `}</strong>
                                        {ingatlanObj.telepules}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Erkély: `}</strong>
                                        {ingatlanObj.isErkely ? 'Van' : 'Nincs'}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Fűtés típusa: `}</strong>
                                        {ingatlanObj.futes}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Alapterület: `}</strong>
                                        {`${ingatlanObj.alapterulet} m`}
                                        <sup>2</sup>
                                    </React.Fragment>
                                    
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Telek mérete: `}</strong>
                                        {`${ingatlanObj.telek ? ingatlanObj.telek : '0'} m`}
                                        <sup>2</sup>
                                    </React.Fragment>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='tulajdonsag'>
                        <CardHeader><h4><strong>Ingatlan tulajdonságai</strong></h4></CardHeader>
                        <CardBody>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Állapota: `}</strong>
                                        {ingatlanObj.allapot}
                                    </React.Fragment>
                                </div>
                                {/* <div className='col-md-6'>
                                            
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    
                                </div>
                                <div className='col-md-6'>
                                    
                                </div> */}
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='leiras'>
                        <CardHeader><h4><strong>Ingatlan leírása</strong></h4></CardHeader>
                        <CardBody>
                            <div className='row'>
                                <div className='col-md-12'>
                                    {ingatlanObj.leiras}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='illetek' hidden={ingatlanObj.statusz === 'Kiadó'}>
                        <CardHeader><h4><strong>Várható illeték</strong></h4></CardHeader>
                        <CardBody><strong>{getIlletek(ingatlanObj.ar)}</strong></CardBody>
                    </Card>
                </div>
            </div>
            <div className='ertekesito_adatok'>
                <div className='elado_avatar'>
                    <img src={kep && kep.src} alt={ingatlanObj.rogzitoNev} />
                </div>
                <div className='elado_adatok'>
                    <div>
                        <span>Név:</span>
                        {ingatlanObj.rogzitoNev}
                    </div>
                    <div>
                        <span>E-mail:</span>
                        {` ${ingatlanObj.rogzitoEmail}`}
                    </div>
                    <div>
                        <span>Telefon:</span>
                        {ingatlanObj.rogzitoTelefon}
                    </div>
                </div>
                <div className='erdeklodes_form'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <Label>Név:</Label>
                            <Input 
                                type='text'
                                name='nev'
                                id='nev'
                                value={emailObj.nev}
                                onChange={(e) => handleInputChange(e, emailObj, setEmailObj)}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                        <Label>E-mail cím:</Label>
                            <Input 
                                type='email'
                                name='email'
                                id='email'
                                value={emailObj.email}
                                onChange={(e) => handleInputChange(e, emailObj, setEmailObj)}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                        <Label>Telefonszám:</Label>
                            <Input 
                                type='text'
                                name='telefon'
                                id='telefon'
                                value={emailObj.telefon}
                                onChange={(e) => handleInputChange(e, emailObj, setEmailObj)}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                        <Label>Üzenet:</Label>
                            <Input 
                                type='textarea'
                                name='uzenet'
                                id='uzenet'
                                rows="7"
                                value={emailObj.uzenet}
                                onChange={(e) => handleInputChange(e, emailObj, setEmailObj)}
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                            <Label>
                                Az <a href='https://www.myhomeimmo.hu/adatkezeles' target='_blank'> adatkezelési tájékoztatót</a> megismertem, és hozzájárulok az abban rögzített adatkezelési célokból történő adatkezeléshez: *
                            </Label>
                            <Input
                                type='checkbox'
                                name='elfogadAdatkezeles'
                                id='elfogadAdatkezeles'
                                checked={elfogadAdatkezeles}
                                onChange={(e) => setElfogadAdatkezeles(e.target.checked)}
                                required
                            />
                        </div>
                        <div className='col-md-12' />
                        <br />
                        <div className='col-md-12'>
                            <Button color='success' onClick={() => sendMail()} disabled={!elfogadAdatkezeles || emailObj.nev === '' || emailObj.telefon === '' || emailObj.email === '' || emailObj.uzenet === ''}>
                                <i className="fas fa-paper-plane"></i>
                                &nbsp;&nbsp;Elküld
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }



    return (
        loading ? (
            <Loading isLoading={loading} />
        ) : (
            renderIngatlan()
        )
        // <div className='row'>
        //     <div className='col-md-12'>
               
        //     </div>
        // </div>
    );
}

export default Ingatlan;