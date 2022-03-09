import React, { useEffect, useState } from 'react';

import Services from './Services';

const Reklam = () => {
    const [ ingatlanok, setIngatlanok ] = useState([]);
    const [ startIndex, setStartIndex ] = useState(0);

    let ind = 0;
    let delay = 15000 // Millisecond 15 másodpercs

    const getIngatlanok = () => {
        Services.listIngatlanok().then((res) => {
            if (!res.err) {
                setIngatlanok(res);
                setInterval(() => {
                    addTwo(res);
                }, delay);
            }
        });
        
    }

    const addTwo = (ingek) => {
        const index = ind
        let isBiggerThanMax = index + 4 >= ingek.length;
        if (isBiggerThanMax) {
            ind = 0  
        } else {
            ind += 4;
        }
        setStartIndex(ind)
    };

    const renderIngatlanok = () => {
        let start = ingatlanok[startIndex];
        let second = ingatlanok[startIndex + 1];
        let third = ingatlanok[startIndex + 2];
        let end = ingatlanok[startIndex + 3];
        return (
            <React.Fragment>
            {start && (
                <div className='reklamdiv'>
                    <div className='reklamdiv__kep'><img src={start.kepek[0].src} alt={start.kepek[0].title} /></div>
                    <div className='reklamdiv__cim'>{start && start.cim}</div>
                    <div className='reklamdiv__refid'>{start && start.refid}</div>
                    <div className='reklamdiv__leiras'>{start && start.leiras}</div>
                    <div className='reklamdiv__ar'>{start && 'Ár: ' + start.ar}</div>
                </div>
            )}
            {second && (
                <div className='reklamdiv'>
                  <div className='reklamdiv__kep'><img src={second.kepek[0].src} alt={second.kepek[0].title} /></div>
                  <div className='reklamdiv__cim'>{second && second.cim}</div>
                  <div className='reklamdiv__refid'>{second && second.refid}</div>
                  <div className='reklamdiv__leiras'>{second && second.leiras}</div>
                  <div className='reklamdiv__ar'>{second && 'Ár: ' + second.ar}</div>
                </div>
            )}
            {third && (
                <div className='reklamdiv'>
                    <div className='reklamdiv__kep'><img src={third.kepek[0].src} alt={third.kepek[0].title} /></div>
                    <div className='reklamdiv__cim'>{third && third.cim}</div>
                    <div className='reklamdiv__refid'>{third && third.refid}</div>
                    <div className='reklamdiv__leiras'>{third && third.leiras}</div>
                    <div className='reklamdiv__ar'>{third && 'Ár: ' + third.ar}</div>
                </div>
            )}
            {end && (
                <div className='reklamdiv'>
                    <div className='reklamdiv__kep'><img src={end.kepek[0].src} alt={end.kepek[0].title} /></div>
                    <div className='reklamdiv__cim'>{end && end.cim}</div>
                    <div className='reklamdiv__refid'>{end && end.refid}</div>
                    <div className='reklamdiv__leiras'>{end && end.leiras}</div>
                    <div className='reklamdiv__ar'>{end && 'Ár: ' + end.ar}</div>
                </div>
            )}
            </React.Fragment>
        );
    }

    const init = () => {
        getIngatlanok();
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className='reklam_container'>
            {renderIngatlanok()}
        </div>
    );
}

export default Reklam;