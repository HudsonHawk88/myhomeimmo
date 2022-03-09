import React from "react";
import { Navbar, Collapse, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { NavLink } from '../../commons/NavLink'

const PublicHeader = (props) => {

  let { history } = props;

  const toggleNavbar = (id) => {
    const collapse = document.getElementById(id);
    collapse.classList.toggle("show");
  };

  return (
    <React.Fragment>
      <div className="plus_nav">
        <div className="plus_content">
            <div className="tel">
                <i className="fas fa-phone-alt"></i>&nbsp;
                +36-20/461-9075
            </div>
            <div className="kozossegi">
                <NavLink className="nav-link public-navbar__nav-link job_button" to="/myjob" history={history}>
                  {/* <i className="far fa-bookmark"></i> */}
                  {/* <i className="fas fa-home" /> */}
                  Dolgozz Velünk!
                </NavLink>
                {/* <button className="job_button">Dolgozz Velünk!</button> */}
                <a href="https://www.facebook.com/myhomeberkimonika" target='_blank'><i className="fab fa-facebook-square"></i></a>
                <a href="https://www.instagram.com/myhomeberkimonika/" target='_blank'><i className="fab fa-instagram"></i></a>
                <i className="fab fa-youtube"></i>
                <i className="fab fa-whatsapp"></i>
            </div>
        </div>
      </div>
      <Navbar expand="lg" light className='public-navbar' dark>
        <div id="logo" />
        <div className="navbar-toggler" onClick={() => toggleNavbar("public_navbar_collapse")}>
          <i className="fas fa-bars"></i>
        </div>
        <Collapse navbar id="public_navbar_collapse">
          <Nav className="me-auto" navbar className='public-navbar__nav'>
            <NavItem className='nav-item public-navbar__nav-item'>
              <NavLink className="nav-link public-navbar__nav-link" to="/" history={history}>
                {/* <i className="far fa-bookmark"></i> */}
                <i className="fas fa-home" />
                &nbsp; Főoldal
              </NavLink>
            </NavItem>
            <NavItem className='nav-item public-navbar__nav-item'>
              <NavLink className="nav-link public-navbar__nav-link" to="/ingatlanok" history={history}>
                {/* <i className="fas fa-home" /> */}
                <i className="fas fa-house-user"></i>
                &nbsp; Ingatlanok
              </NavLink>
            </NavItem>
            <UncontrolledDropdown className='nav-item public-navbar__nav-item' inNavbar nav>
                <DropdownToggle nav caret className='nav-link public-navbar__nav-link'>
                  <i className="fas fa-briefcase"></i>
                  &nbsp; Szolgáltatások
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <NavLink className="nav-link public-navbar__nav-link" to="/ingatlanszolgaltatasok" history={history}>
                      <i className="fas fa-handshake"></i>
                      &nbsp; Ingatlan szolgáltatások
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink className="nav-link public-navbar__nav-link" to="/penzugyiszolgaltatasok" history={history}>
                      <i className="fas fa-piggy-bank"></i>
                      &nbsp; Pénzügyi szolgáltatások
                    </NavLink>
                  </DropdownItem>
                  {/* <DropdownItem>
                    <NavLink className="nav-link public-navbar__nav-link" to="/energetika" history={history}>
                      <i className="fab fa-envira"></i>
                      &nbsp; Energetikai tanusítvány
                    </NavLink>
                  </DropdownItem> */}
                </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem className='nav-item public-navbar__nav-item'>
              <NavLink className="nav-link public-navbar__nav-link" to="/rolunk" history={history}>
                <i className="fas fa-info-circle"></i>
                &nbsp; Rólunk
              </NavLink>
            </NavItem>
            <NavItem className='nav-item public-navbar__nav-item'>
              <NavLink className="nav-link public-navbar__nav-link" to="/kapcsolat" history={history}>
                <i className="fas fa-phone-alt"></i>
                &nbsp; Kapcsolat
              </NavLink>
            </NavItem>
            <UncontrolledDropdown className='nav-item public-navbar__nav-item' inNavbar nav>
                <DropdownToggle nav caret className='nav-link public-navbar__nav-link'>
                  <i className="far fa-file-alt"></i>
                  &nbsp; GDPR
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <NavLink className="nav-link public-navbar__nav-link" to="/adatkezeles" history={history}>
                      <i className="far fa-id-card"></i>
                      &nbsp; Adatkezelési tájékoztató
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem className='nav-item public-navbar__nav-item'>
              <NavLink className="nav-link public-navbar__nav-link" to="/myart" id='myart' history={history}>
              <i className="fas fa-shapes"></i>
                &nbsp; MyArt
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </React.Fragment>
  );
};

export default PublicHeader;
