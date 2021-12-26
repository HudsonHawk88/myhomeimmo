import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { NotificationContainer, NotificationManager } from 'react-notifications';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import Services from './views/Pages/Login/Services';
import Publicroutes from './routes/Publicroutes';
import Adminroutes from './routes/Adminroutes';
import Login from './views/Pages/Login/Login';
import { hasRole } from './commons/Lib';

function Main() {
  const [user, setUser] = useState(null);
  const [ ingatlanok, setIngatlanok ] = useState([]);
  const isAdmin = window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem('refreshToken');
  let history = createBrowserHistory();

  const createNotification = (type, msg) => {
    switch (type) {
      case 'info':
        NotificationManager.info(msg);
        break;
      case 'success':
        NotificationManager.success(msg);
        break;
      case 'warning':
        NotificationManager.warning(msg);
        break;
      case 'error':
        NotificationManager.error(msg);
        break;
    }
  }

  const refreshToken = () => {
    Services.refreshToken(token, isAdmin).then((res) => {
        if (!res.err) {
            setUser(res.user);
        }
    });
  }

  history.listen((location, action) => {
    // this is called whenever new locations come in
    // the action is POP, PUSH, or REPLACE
    if (token && isAdmin) {
      refreshToken();
    }
  });

  const logout = () => {
    const token = localStorage.getItem('refreshToken');
    Services.logout(token, isAdmin).then((res) => {
        if (!res.err) {
            localStorage.removeItem('refreshToken');
            window.location.href = "/"
        } else {
            createNotification("error", "Váratlan hiba a kijelentkezésnél! Kérjük próbáld meg újra!");
        }
    });
  }

  const getIngatlanok = () => {
    Services.listIngatlanok().then((res) => {
        if (!res.err) {
            let kiemeltIngatlanok = res.filter((ing) => ing.isKiemelt)
            setIngatlanok(kiemeltIngatlanok);
        }
    })
  }

  useEffect(() => {
    if (token && isAdmin) {
      refreshToken(); 
    } if (!isAdmin) {
      getIngatlanok();
    }


    
  }, [window, history.location.pathname]);

  const scrollToTop = () => {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
}

  useEffect(() => {
        scrollToTop();
  }, [window.location])
  
  return (
    <React.Fragment>
    <NotificationContainer />
    <Router navigator={history}>
      {isAdmin ? (
          user ? (
            <Adminroutes hasRole={hasRole} addNotification={createNotification} history={history} user={user} logout={logout} />
          ) : (
            <Login addNotification={createNotification} history={history} setUser={setUser} isAdmin={isAdmin} />
          )
        ) : (
          <Publicroutes addNotification={createNotification} ingatlanok={ingatlanok} history={history} />
        )
      }
    </Router>
    </React.Fragment>
  );
}

export default Main;

render(
 <Main />,
  document.getElementById('root')
);