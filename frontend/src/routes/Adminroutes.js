import React from 'react';
import { useRoutes } from 'react-router-dom';

import Admin from '../containers/Admin';
import Fooldal from '../views/Admin/Fooldal/Fooldal';
import Ingatlanok from '../views/Admin/Ingatlanok/Ingatlanok';
import Jogosultsagok from '../views/Admin/Jogosultsagok/Jogosultsagok';
import AdminUsers from '../views/Admin/Adminusers/AdminUsers';
import IngatlanSzolgaltatasok from '../views/Admin/IngatlanSzolgaltatasok/IngatlanSzolgaltasok';
import PenzugyiSzolgaltatasok from '../views/Admin/PenzugyiSzolgaltatasok/PenzugyiSzolgaltatasok';
import Gdpr from '../views/Admin/GDPR/Gdpr';
import Rolunk from '../views/Admin/Rolunk/Rolunk';
import Kapcsolatok from '../views/Admin/Kapcsolatok/Kapcsolatok';
import MyArtBase from '../views/Admin/MyArt/MyArtBase';
import MyArtAltalanos from '../views/Admin/MyArt/MyArtAltalanos';
import MyArtGaleriak from '../views/Admin/MyArt/MyArtGaleriak';

const Adminroutes = (props) => {
    const routes = {
        path: '/admin',
        element: <Admin {...props} />,
        children: [
          {path: '/admin', element: <Fooldal {...props} />},
          {path: '/admin/ingatlanok', element: <Ingatlanok {...props} />},
          {path: '/admin/jogosultsagok', element: <Jogosultsagok {...props} />},
          {path: '/admin/felhasznalok', element: <AdminUsers {...props} />},
          {path: '/admin/ingatlanszolg', element: <IngatlanSzolgaltatasok {...props} />},
          {path: '/admin/penzugyiszolg', element: <PenzugyiSzolgaltatasok {...props} />},
          {path: '/admin/gdpr', element: <Gdpr {...props} />},
          {path: '/admin/rolunk', element: <Rolunk {...props} />},
          {path: '/admin/kapcsolat', element: <Kapcsolatok {...props} />},
          {path: '/admin/myArt', element: <MyArtBase {...props} />, children: [
            {path: '/admin/myArt/altalanos', element: <MyArtAltalanos {...props} />},
            {path: '/admin/myArt/galeriak', element: <MyArtGaleriak {...props} />}
          ]}
        ],
      };
    const routing = useRoutes([routes]);
    
    return (
        <React.Fragment>{routing}</React.Fragment>
    );
}

export default Adminroutes;