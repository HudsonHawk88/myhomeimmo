import React from 'react';

import FooldalContent from './FooldalContent';

const Fooldal = (props) => {

    return (
      <div className='public-inner-content'>
        <FooldalContent {...props} />
      </div>
    );
}

export default Fooldal;