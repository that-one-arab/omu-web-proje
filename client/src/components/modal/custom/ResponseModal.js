import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CButton,
} from '@coreui/react';

const SUCCESS = 'success';
const FAILURE = 'failure';

/**
 * @prop {function} onClose a custom callback when modal is closed, overwrites default callback of closing the modal normally
 */
export function ResponseModal({ modal, setModal, onClose }) {
    const { header: modalHeader, body, show, status } = modal;

    let color = '';
    if (status === SUCCESS) color = 'success';
    else if (status === FAILURE) color = 'danger';

    let header = modalHeader;
    if (!modalHeader)
        if (status === SUCCESS) header = 'Başarılı';
        else if (status === FAILURE) header = 'HATA';

    let closeModal = () => setModal({ ...modal, show: false });
    if (onClose) {
        closeModal = onClose;
    }

    return (
        <CModal show={show} onClose={() => closeModal()} color={color} centered>
            <CModalHeader closeButton>
                <CModalTitle> {header} </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <h5 style={{ textAlign: 'center' }}>{body}</h5>
            </CModalBody>
            <CModalFooter>
                <CButton color='secondary' onClick={() => closeModal()}>
                    Kapat
                </CButton>
            </CModalFooter>
        </CModal>
    );
}
