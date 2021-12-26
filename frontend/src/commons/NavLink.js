import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const setActive = (doc, history) => {
    const navlinks = doc.getElementsByClassName('nav-link');
    [...navlinks].forEach((link) => {
        const toParam = link.getAttribute('id');
        if (toParam === history.location.pathname) {
            link.classList.add('active')
        } else {
            link.classList.remove('active');
        }
    })
}
const NavLink = ({ history, to, state, search, children, onClick, ...props }) => {
    const isAdmin = history.location.pathname.startsWith('/admin')
    const navigateTo = useNavigate()
    const navigate = () => {
        let navigateFunction = undefined;
        if (to) {
            if (!state && !search) {
                navigateFunction = history.push(to); navigateTo(to);
                if (onClick) {
                    onClick();
                }
               
                // navigateFunction = navi(to);
            } else {
                navigateFunction = 
                    history.push({
                    pathname: to,
                    search: search ? search : "",
                    state: state ? state : null
                    });
                navigateTo(to);
                if (onClick) {
                    onClick();
                }
                
            }
        }
        return navigateFunction;
    }


  
    return (
        <span id={to} className={`${isAdmin ? 'admin-sidebar__navlink nav-link' : 'nav-link'}`} onClick={() => navigate()}>
            {children}
        </span>
    );
}

export { NavLink, setActive };

NavLink.propTypes = {
    history: PropTypes.object.isRequired,
    to: PropTypes.string.isRequired,
    state: PropTypes.object,
    search: PropTypes.string,
    onClick: PropTypes.func
}

setActive.propTypes = {
    document: PropTypes.any.isRequired
}