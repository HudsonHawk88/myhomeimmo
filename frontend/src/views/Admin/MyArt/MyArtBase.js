import React, { useEffect, useState } from 'react';
import { Nav, NavItem, TabPane, TabContent, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom'
import { NavLink } from '../../../commons/NavLink';

import MyArtAltalanos from './MyArtAltalanos';
import MyArtGaleriak from './MyArtGaleriak';

const MyArtBase = (props) => {
    const { history } = props;
    const navigate = useNavigate();
    const [ active, setActive ] = useState('1');

    const toggle = (id) => {
        setActive(id);
    }

    const init = () => {
        setActive('1');
        navigate('/admin/myart/altalanos');
        history.push('/admin/myart/altalanos');
    }

    useEffect(() => {
        init();
    }, [])

    const renderContents = () => {
        return (
            <div>
                <Nav tabs card className='tab_nav'>
                    <NavItem>
                    <NavLink
                        to="/admin/myart/altalanos"
                        history={history}
                        onClick={() => toggle('1')}
                    >
                        Általános
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        to="/admin/myart/galeriak"
                        history={history}
                        onClick={() => toggle('2')}
                    >
                        Galériák
                    </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={active}>
                    <TabPane tabId="1">
                        <MyArtAltalanos {...props} />
                    </TabPane>
                    <TabPane tabId="2">
                        <MyArtGaleriak {...props} />
                    </TabPane>
                </TabContent>
            </div>
        );
    } 

    return (
        <div className='row'>
            <div className='col-md-12'>
                {renderContents()}
            </div>
        </div>
    );
}

export default MyArtBase;