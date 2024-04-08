import React from 'react';
import {
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useHistory } from 'react-router';

const TheHeaderDropdown = () => {
    const history = useHistory();
    return (
        <CDropdown inNav className='c-header-nav-items mx-0' direction='down'>
            <CDropdownToggle className='c-header-nav-link' caret={false}>
                <div className='c-avatar'>
                    <CIcon name='cil-user' className='mfe-2' />
                </div>
            </CDropdownToggle>
            <CDropdownMenu className='pt-0' placement='bottom-end'>
                <CDropdownItem
                    onClick={() => {
                        document.cookie =
                            'eggkdjsewad67hgzshr6r0987rah68r0z76rh0z5075df7zh';
                        history.push('/login');
                    }}
                >
                    <CIcon name='cil-lock-locked' className='mfe-2' />
                    Çıkış Yap
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    );
};

export default TheHeaderDropdown;
