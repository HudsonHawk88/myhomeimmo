import React, { useState, useEffect } from 'react';
import { serializer } from '@organw/wysiwyg-editor';

import Services from './Services';

const IngatlanSzolgaltatasok = () => {
    const defaultSzolgaltatas = {
        kep: [],
        leiras: ''
    }
    const [ szolgaltatas, setSzolgaltatas ] = useState(defaultSzolgaltatas);

    const getIngatlanSzolgaltatasok = () => {
        Services.listIngatlanSzolgaltatasok().then((res) => {
            if (!res.err) {
                setSzolgaltatas({
                    kep: res.kep[0],
                    leiras: res.leiras
                });
            }
        })
    }

    const init = () => {
        getIngatlanSzolgaltatasok();
    }

    useEffect(() => {
        init();
    }, []);

    const renderSzolgaltatas = () => {
        return (
            <React.Fragment>
                <img src={szolgaltatas && szolgaltatas.kep && szolgaltatas.kep.src} alt="Berki Mónika" />
                <div className='ingatlan_szolgaltatas__leiras' dangerouslySetInnerHTML={{__html: szolgaltatas.leiras}} />
            </React.Fragment>
        );
    }

    return (
        <div className='ingatlan_szolgaltatas'>
            {renderSzolgaltatas()}
        </div>
    );
}

export default IngatlanSzolgaltatasok;