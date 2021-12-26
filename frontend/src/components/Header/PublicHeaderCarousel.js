import React from 'react';
import { UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import KeresoForm from '../../views/Public/Fooldal/KeresoForm';
import Gallery from '../../commons/Gallery';

const PublicHeaderCarousel = (props) => {
    const { items } = props;

    return (
        <div className="undernav row">
            <div className="col-md-6 undernav__kereso">
                <UncontrolledAccordion defaultOpen='1'>
                    <AccordionItem>
                        <AccordionHeader targetId='1'>Gyorskereső</AccordionHeader>
                        <AccordionBody accordionId='1'>
                            <KeresoForm />
                        </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>
            <div className="col-md-6 undernav__carousel">
                <Gallery  
                    items={items}
                    showFullscreenButton={false}
                    showThumbnails={false}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    infinite={true}
                    autoPlay={true}
                    slideInterval={15000}
                    showBullets={true}
                />
            </div>
        </div>
    );
}

export default PublicHeaderCarousel;