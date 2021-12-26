import React, { useState, useRef } from 'react';
import { Form, Input, Button, Label } from 'reactstrap';

import { handleInputChange, addFile } from '../../../commons/InputHandlers';

import Services from './Services';

const MyJob = (props) => {
    const defaultJobObj = {
        nev: '',
        telefon: '',
        email: '',
        oneletrajz: ''
    }
    const ref = useRef();

    const [ jobObj, setJobObj ] = useState(defaultJobObj);
    const [ elfogadAdatkezeles, setElfogadAdatkezeles ] = useState(false);
    const [ elkuldte, setElkuldte ] = useState(false);

    const { addNotification } = props;

    const resetFIleInput = (id) => {
        let el = document.getElementById(id);
        el.click();
    }

    const sendMail = (e) => {
        e.preventDefault();
        let kuldObj = jobObj;
        if (kuldObj.oneletrajz === '') {
            delete kuldObj.oneletrajz;
        }
        Services.sendJobApply(kuldObj).then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
                setJobObj(defaultJobObj);
                resetFIleInput('reset');
                setElfogadAdatkezeles(false);
                setElkuldte(true)

                setTimeout(() => {
                    setElkuldte(false)
                }, 5000)
            } else {
                addNotification('error', res.err);
            }
        })
    }

    const renderJobForm = () => {
        return (
            
            <React.Fragment>
                <Form onSubmit={sendMail}>
                <div className='col-md-12 job_title'>
                    <h1><strong>Jelentkezés elküldése</strong></h1>
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-12'>
                    <Label>Név: *</Label>
                    <Input 
                        type='text'
                        name='nev'
                        id='nev'
                        value={jobObj.nev}
                        onChange={(e) => handleInputChange(e, jobObj, setJobObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-12'>
                    <Label>E-mail: *</Label>
                    <Input 
                        type='email'
                        name='email'
                        id='email'
                        value={jobObj.email}
                        onChange={(e) => handleInputChange(e, jobObj, setJobObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-12'>
                    <Label>Telefon: *</Label>
                    <Input 
                        type='text'
                        name='telefon'
                        id='telefon'
                        value={jobObj.telefon}
                        onChange={(e) => handleInputChange(e, jobObj, setJobObj)}
                    />
                </div>
                <div className='col-md-12' />
                <br />
                <div className='col-md-12'>
                    <Label>Önéletrajz: </Label>
                    <Input 
                        type='file'
                        name='oneletrajz'
                        id='oneletrajz'
                        ref={ref}
                        onChange={(e) => addFile(e, jobObj, setJobObj)}

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
                <Button
                    color='success'
                    type='submit'
                    // onClick={() => sendMail()}
                    disabled={!elfogadAdatkezeles || jobObj.nev === '' || jobObj.telefon === '' || jobObj.email === ''}
                >
                    <i className="fas fa-paper-plane"></i>
                    &nbsp;&nbsp;Elküld
                </Button>
                <button hidden type="reset" id='reset' />
                </Form>
            </React.Fragment>
        );
    }

    const renderKoszonjuk = () => {
        return (
            <div className='koszonjuk'>
                    Köszönjük jelentkezését! Hamarosan jelentkezni fogunk!
            </div>
        );
    }

    return (
        <div className='myjob'>
            {!elkuldte ? renderJobForm() : renderKoszonjuk()}
        </div>
    );
}

export default MyJob;