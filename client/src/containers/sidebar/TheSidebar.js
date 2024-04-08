import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    CCreateElement,
    CSidebar,
    CSidebarNav,
    CSidebarNavDivider,
    CSidebarNavTitle,
    CSidebarMinimizer,
    CSidebarNavDropdown,
    CSidebarNavItem,
} from '@coreui/react';

const _nav = [
    {
        _tag: 'CSidebarNavItem',
        name: 'Ana Sayfa',
        to: '/dashboard',
        icon: <i className='fas fa-tachometer-alt c-sidebar-nav-icon'></i>,
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Yeni Hasta',
        to: '/patients/new',
        icon: <i className='fas fa-user c-sidebar-nav-icon'></i>,
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Tüm Hastalar',
        to: '/patients/all',
        icon: <i className='fas fa-users c-sidebar-nav-icon'></i>,
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Tüm Randevular',
        to: '/appointments/all',
        icon: <i className='fas fa-calendar-check c-sidebar-nav-icon'></i>,
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Tüm Tedaviler',
        to: '/treatments/all',
        icon: <i className='fas fa-syringe c-sidebar-nav-icon'></i>,
    },
    // Unsupporting features
    // {
    //     _tag: 'CSidebarNavItem',
    //     name: 'Gelirler Ve Giderler',
    //     to: '/income-and-expense',
    //     icon: <i className='fas fa-receipt c-sidebar-nav-icon'></i>,
    // },
    // {
    //     _tag: 'CSidebarNavItem',
    //     name: 'Kasa',
    //     to: '/accounting',
    //     icon: <i className='fas fa-calculator c-sidebar-nav-icon'></i>,
    // },
];

const TheSidebar = () => {
    const dispatch = useDispatch();
    const show = useSelector((state) => state.sidebarState.sidebarShow);

    return (
        <CSidebar
            show={show}
            onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
        >
            {/* <CSidebarBrand className='d-md-down-none' to='/'>
                <CIcon
                    className='c-sidebar-brand-full'
                    name='logo-negative'
                    height={35}
                />
                <CIcon
                    className='c-sidebar-brand-minimized'
                    name='sygnet'
                    height={35}
                />
            </CSidebarBrand> */}
            <CSidebarNav>
                <CCreateElement
                    items={_nav}
                    components={{
                        CSidebarNavDivider,
                        CSidebarNavDropdown,
                        CSidebarNavItem,
                        CSidebarNavTitle,
                    }}
                />
            </CSidebarNav>
            <CSidebarMinimizer className='c-d-md-down-none' />
        </CSidebar>
    );
};

export default React.memo(TheSidebar);
