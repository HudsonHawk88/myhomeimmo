import React, { useEffect } from 'react';
import { Navbar, Collapse, Nav, NavItem } from 'reactstrap';
import { NavLink, setActive } from '../../commons/NavLink';


const AdminSidebar = (props) => {

    const { history, user, hasRole } = props;

    const toggleSidebar = (side, coll) => {
        const sidebar = document.getElementById(side);
        const collapse = document.getElementById(coll);
        if (sidebar && collapse) {
            sidebar.classList.toggle('show');
            collapse.classList.toggle('show');
        }
    };

    useEffect(() => {
        setActive(document, history);
    }, [history]);
    
    return (
        <div className='admin_nav'>
            <div className='admin-sidebar__toggler navbar-toggler' onClick={() => toggleSidebar("admin_sidebar", 'admin_collapse')}>
                <i className="fas fa-bars"></i>
            </div>
            <Navbar dark id='admin_sidebar' className='admin-sidebar show'>
                <Collapse navbar className='admin_collapse show' id="admin_collapse">
                <Nav className="me-auto" navbar id='admin_nav'>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin' history={history} id='home' end={"true"}>
                        &nbsp;&nbsp;<i className="fas fa-home" />
                            &nbsp; Főoldal
                        </NavLink>
                    </NavItem>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/ingatlanok' history={history} id='ingatlanok'>
                        &nbsp;&nbsp;<i className="fas fa-home" />
                            &nbsp; Ingatlanok
                        </NavLink>
                    </NavItem>
                    {
                        hasRole(user.roles, ['SZUPER_ADMIN']) && (
                            <React.Fragment>
                                <NavItem className='admin-sidebar__navitem'>
                                    <NavLink className="admin-sidebar__navlink nav-link" to='/admin/jogosultsagok' history={history} id='jogosultsagok'>
                                    &nbsp;&nbsp;<i className="fas fa-user" />
                                    &nbsp;Jogosultságok
                                    </NavLink>
                                </NavItem>
                                <NavItem className='admin-sidebar__navitem'>
                                    <NavLink className="admin-sidebar__navlink nav-link" to='/admin/felhasznalok' history={history} id='felhasznalok'>
                                    &nbsp;&nbsp;<i className="fas fa-user"></i>
                                    &nbsp;Admin felhasználók
                                    </NavLink>
                                </NavItem>
                            </React.Fragment>
                        )
                    }
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/ingatlanszolg' history={history} id='Ingatlan Szolgáltatások'>
                        &nbsp;&nbsp;<i className="fas fa-info-circle"></i>
                        &nbsp;Ingatlan szolgáltatások
                        </NavLink>
                    </NavItem>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/penzugyiszolg' history={history} id='Pénzügyi szolgáltatások'>
                        &nbsp;&nbsp;<i className="fas fa-piggy-bank"></i>
                        &nbsp;Pénzügyi szolgáltatások
                        </NavLink>
                    </NavItem>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/gdpr' history={history} id='GDPR'>
                        &nbsp;&nbsp;<i className="fas fa-shield-alt"></i>
                        &nbsp;GDPR
                        </NavLink>
                    </NavItem>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/rolunk' history={history} id='Rolunk'>
                        &nbsp;&nbsp;<i className="fas fa-shield-alt"></i>
                        &nbsp;Rólunk
                        </NavLink>
                    </NavItem>     
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/kapcsolat' history={history} id='kapcsolat'>
                        &nbsp;&nbsp;<i className="fas fa-phone-alt"></i>
                        &nbsp;Kapcsolat
                        </NavLink>
                    </NavItem>
                    <NavItem className='admin-sidebar__navitem'>
                        <NavLink className="admin-sidebar__navlink nav-link" to='/admin/myArt' history={history} id='myArt'>
                        &nbsp;&nbsp;<i className="fas fa-phone-alt"></i>
                        &nbsp;MyArt
                        </NavLink>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default AdminSidebar;