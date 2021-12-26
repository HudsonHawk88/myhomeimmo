import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom';

import PublicHeader from '../components/Header/PublicHeader';
import PublicFooter from '../components/Footer/PublicFooter';
import PublicHeaderCarousel from '../components/Header/PublicHeaderCarousel';
import Loading from '../commons/Loading';

const Public = (props) => {
    const location = useLocation();
    const { ingatlanok } = props;
    const [ loading, setLoading ] = useState(false);

    const arFormatter = (ingatlan) => {
        let kaucio = '';
        let ar = '';
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

        switch (ingatlan.statusz) {
            case 'Kiadó': {
                return `Ár: ${ar} Ft/hó ${ingatlan.kaucio ? 'Kaució: ' + kaucio + ' Ft' : '' }`;
            }
            default: {
                return `Ár: ${ar} Ft`;
            } 
        }
    }

    const ites = (ingatlan, kep, index) => {

        // const imageStyle = {
        //     height: '400px',
        //     width: '65%'
        // }

        return (
            <div className='carousel_image' key={index.toString()}>
                <img src={kep.src} alt={kep.title} />
                <p className='image-gallery-description'>
                    {ingatlan.cim}<br />
                    <span>{`Referenciaszám: `}</span>{ingatlan.refid}<br />
                    <span>{`Település: `}</span>{ingatlan.telepules}<br />
                    <span>{arFormatter(ingatlan)}</span>
                </p>
            </div>
        );
    }

    useMemo(() => {
        if (location.pathname === '/') {
            setLoading(true);
        if (ingatlanok.length !== 0) {
            setLoading(false)
        }
        }
        
        
    }, [ingatlanok, location, loading])

    const getItems = () => {
        let items = [];
        ingatlanok.forEach((ingatlan, index) => {
            let kep = JSON.parse(JSON.stringify(ingatlan.kepek[0]));
            items.push({
                original: kep.src,
                thumbnail: kep.src,
                originalHeight: '600px',
                originalWidth: '200px',
                renderItem: () => ites(ingatlan, kep, index),
                thumbnailWidth: '500px',
            })
        });

        return items;
    }

    return (
        <div className='public_full'>
            <PublicHeader {...props} ingatlanok={ingatlanok} />
            {loading ? (
                <div className='tartalom'>
                    <Loading isLoading={loading} />
                </div>
            ) : (
                <React.Fragment>
                    {location.pathname === '/' && (
                        <PublicHeaderCarousel
                            items={getItems()}
                        />
                    )}
                    <div className='tartalom'>
                        <Outlet />
                    </div>
                </React.Fragment>
            )}
            <PublicFooter />
        </div>
    );
}

export default Public;