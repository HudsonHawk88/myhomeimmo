import React, { useState, useEffect, createRef } from 'react';
import { Card, CardBody, CardHeader, Form, Label, Input, Button } from 'reactstrap';
import ReCAPTCHA from "react-google-recaptcha";

import { handleInputChange, recaptchaOnChange } from '../../../commons/InputHandlers';

import Gallery from '../../../commons/Gallery';
import Loading from '../../../commons/Loading';
import Services from './Services';

const Ingatlan = (props) => {
    const { match, location, addNotification, reCaptchaKey } = props;
    const { state } = location;
    const recaptchaRef = createRef();

    const defaultIngatlanObj = {
        alapterulet: '',
        allapot: '',
        ar: '',
        penznem: '',
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
        const lastPer = location.pathname.lastIndexOf('/');
        let pathname = location.pathname;
        let id = pathname.slice(lastPer + 1, pathname.length);
        getIngatlan(id);
    }, [location]);


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
            case 'Kiad??': {
                return `??r: ${ar} ${ingatlanObj.penznem}/h?? ${ingatlanObj.kaucio ? 'Kauci??: ' + kaucio + ' ' + ingatlanObj.penznem : '' }`;
            }
            case 'Illet??k': {
                return `${illetek} ${ingatlanObj.penznem}`
            }
            default: {
                return `??r: ${ar} ${ingatlanObj.penznem}`;
            } 
        }
    }

    const meretFormatter = (ingatlan) => {
        switch (ingatlan.tipus) {
            case 'Telek': {
                return `M??ret: ${ingatlanObj.telek} m`;
            }
            case 'Ipari ingatlan': {
                return `M??ret: ${ingatlanObj.telek} m`;
            }
            case 'Mez??gazdas??gi ter??let': {
                return `M??ret: ${ingatlanObj.telek} m`;
            }
            case 'Fejleszt??si ter??let': {
                return `M??ret: ${ingatlanObj.telek} m`;
            }
            default: {
                return `M??ret: ${ingatlanObj.alapterulet} m`;
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
            case 'Mez??gazdas??gi ter??let': {
                return '';
            }
            case 'Fejleszt??si ter??let': {
                return '';
            }
            case '??zlethelyis??g': {
                return '';
            }
            case 'Gar??zs': {
                return '';
            }
            case 'Rakt??r': {
                return ''
            }
            default: {
                if (ingatlan.felszobaszam) {
                    return (`Szoba: ${ingatlan.szobaszam} F??lszoba: ${ingatlan.felszobaszam}`);
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
            case 'Mez??gazdas??gi ter??let': {
                return '';
            }
            case 'Fejleszt??si ter??let': {
                return '';
            }
            case '??zlethelyis??g': {
                return '';
            }
            case 'Gar??zs': {
                return '';
            }
            case 'Rakt??r': {
                return ''
            }
            default: {
                if (ingatlan.emelet === 'F??ldszint') {
                    return (`Emelet: ${ingatlan.emelet}`);
                } else if(ingatlan.emelet === '') {
                    return ''
                } else {
                    return (`Emelet: ${ingatlan.emelet}. emelet`);
                }
            } 
        }
    }

    const sendMail = async (e) => {
        e.preventDefault();
        let kuldObj = emailObj;
        kuldObj.toEmail = ingatlanObj.rogzitoEmail;
        // kuldObj.toEmail = 'info@inftechsol.hu';
        kuldObj.refId = ingatlanObj.refid;

        const token = await recaptchaRef.current.executeAsync();
        const secret = process.env.reachaptchaSecretKey;

        const rechaptchaObj = {
            secret: secret,
            response: token
          };

          Services.checkRechaptcha(rechaptchaObj).then((res => {
            if (res.success) {
                Services.sendErdeklodes(kuldObj).then((res) => {
                    if (!res.err) {
                        addNotification('success', res.msg);
                        setEmailObj(defaultEmailObj);
                    } else {
                        addNotification('error', res.err);
                    }
                });
            }
            }
          ));

       
    }

    const getIlletek = (ar) => {
        let illetek = '';
        let ingar = parseInt(ar, 10);
        if (ingar && !isNaN(ar)) {
            illetek = Math.round(ingar*0.04);
            illetek = illetek + '';
        }
        return arFormatter({ illetek: illetek, statusz: 'Illet??k' });
    }

    const renderIngatlan = () => {
        let kep = getAvatar(ingatlanObj.rogzitoAvatar);
        return (
            <div className='ingatlan_card'>
            {/* <meta property="og:title" content={ingatlanObj.cim} /> */}
            {/* <meta property="og:image" content={ingatlanObj.kepek[0].src} /> */}
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
                    {`Telep??l??s: ${ingatlanObj.telepules}`}&nbsp;&nbsp;
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
                                        <strong>{`Ingatlan st??tusza: `}</strong>
                                        {ingatlanObj.statusz}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`??p??t??s m??dja: `}</strong>
                                        {ingatlanObj.epitesmod}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Ingatlan t??pusa: `}</strong>
                                        {ingatlanObj.tipus}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Telep??l??s: `}</strong>
                                        {ingatlanObj.telepules}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Erk??ly: `}</strong>
                                        {ingatlanObj.isErkely ? 'Van' : 'Nincs'}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`F??t??s t??pusa: `}</strong>
                                        {ingatlanObj.futes}
                                    </React.Fragment>
                                </div>
                                <div className='col-md-12' />
                                <br />
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Alapter??let: `}</strong>
                                        {`${ingatlanObj.alapterulet} m`}
                                        <sup>2</sup>
                                    </React.Fragment>
                                    
                                </div>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`Telek m??rete: `}</strong>
                                        {`${ingatlanObj.telek ? ingatlanObj.telek : '0'} m`}
                                        <sup>2</sup>
                                    </React.Fragment>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='tulajdonsag'>
                        <CardHeader><h4><strong>Ingatlan tulajdons??gai</strong></h4></CardHeader>
                        <CardBody>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <React.Fragment>
                                        <strong>{`??llapota: `}</strong>
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
                        <CardHeader><h4><strong>Ingatlan le??r??sa</strong></h4></CardHeader>
                        <CardBody>
                            <div className='row'>
                                <div className='col-md-12'>
                                    {ingatlanObj.leiras}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className='illetek' hidden={ingatlanObj.statusz === 'Kiad??'}>
                        <CardHeader><h4><strong>V??rhat?? illet??k</strong></h4></CardHeader>
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
                        <span>N??v:</span>
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
                <div class="fb-share-button" data-href={`http://teszt.myhomeimmo.inftechsol.hu:8460/ingatlan/${ingatlanObj.id}`} data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Megoszt??s</a></div>
                <div className='erdeklodes_form'>
                    <Form onSubmit={sendMail}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <Label>N??v:</Label>
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
                        <Label>E-mail c??m:</Label>
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
                        <Label>Telefonsz??m:</Label>
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
                        <Label>??zenet:</Label>
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
                                Az <a href='https://www.myhomeimmo.hu/adatkezeles' target='_blank'> adatkezel??si t??j??koztat??t</a> megismertem, ??s hozz??j??rulok az abban r??gz??tett adatkezel??si c??lokb??l t??rt??n?? adatkezel??shez: *
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
                            <ReCAPTCHA sitekey={reCaptchaKey} size='invisible' ref={recaptchaRef} onChange={() => { recaptchaRef.current.reset() }} />
                            <Button color='success' disabled={!elfogadAdatkezeles || emailObj.nev === '' || emailObj.telefon === '' || emailObj.email === '' || emailObj.uzenet === ''}>
                                <i className="fas fa-paper-plane"></i>
                                &nbsp;&nbsp;Elk??ld
                            </Button>
                            <br />
                            <br />
                            <span className='recaptcha_text'>
                                Ez az oldal v??dve van a Google reCAPTCHA-val ??s ??rv??nyesek r?? a Google <a href="https://policies.google.com/privacy">Adatv??delmi ir??nyelvei</a> ??s az <a href="https://policies.google.com/terms">??ltal??nos Szerz??d??si felt??telei</a>.
                            </span>
                        </div>
                    </div>
                    </Form>
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