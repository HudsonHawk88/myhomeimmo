import React from 'react';
import { useRoutes, useLocation } from 'react-router-dom';

import Public from '../containers/Public';
import Fooldal from '../views/Public/Fooldal/Fooldal';
import Ingatlan from '../views/Public/Ingatlanok/Ingatlan';
import Ingatlanok from '../views/Public/Ingatlanok/Ingatlanok';
import IngatlanSzolgaltatasok from '../views/Public/IngatlanSzolgaltatasok/IngatlanSzolgaltatasok';
import PenzugyiSzolgaltatasok from '../views/Public/PenzugyiSzolgaltatasok/PenzugyiSzolgaltatasok';
import Adatkezeles from '../views/Public/GDPR/Adatkezeles';
import Rolunk from '../views/Public/Rolunk/Rolunk';
import Kapcsolat from '../views/Public/Kapcsolat/Kapcsolat'
import MyJob from '../views/Public/MyJob/MyJob';
import MyArt from '../views/Public/MyArt/MyArt';
import Reklam from '../views/Public/Reklam/Reklam'


const Publicroutes = (props) => {
  let { history } = props;
  let location = useLocation()
    const routes = 
      {
        path: '/',
        element: <Public history={history} location={location} {...props} />,
        children: [
          {path: '/', element: <Fooldal history={history} location={location} ingatlanMenu={false} {...props} />},
          {path: '/ingatlan/:id', element: <Ingatlan history={history} location={location} {...props} />},
          {path: '/ingatlanok', element: <Ingatlanok history={history} location={location} {...props} />},
          {path: '/ingatlanszolgaltatasok', element: <IngatlanSzolgaltatasok history={history} location={location} {...props} />},
          {path: '/penzugyiszolgaltatasok', element: <PenzugyiSzolgaltatasok history={history} location={location} {...props} />},
          {path: '/adatkezeles', element: <Adatkezeles history={history} location={location} {...props} />},
          {path: '/rolunk', element: <Rolunk history={history} location={location} {...props} />},
          {path: '/kapcsolat', element: <Kapcsolat history={history} location={location} {...props} />},
          {path: '/myjob', element: <MyJob history={history} location={location} {...props} />},
          {path: '/myart', element: <MyArt history={history} location={location} {...props} />}
          // {path: '/reklam', element: <Reklam  />}
        ],
      };
    const routing = useRoutes([routes]);

    return (
        <React.Fragment>{routing}</React.Fragment>
    );
}

export default Publicroutes;