import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CButton,
} from '@coreui/react';

function Modal(props) {
    return (
        <CModal
            show={props.modalOn}
            onClose={() => props.setModal(!props.modalOn)}
            color={props.color}
            centered
        >
            <CModalHeader closeButton>
                <CModalTitle> {props.header} </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <h5 style={{ textAlign: 'center' }}>{props.body}</h5>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color='secondary'
                    onClick={() =>
                        props.setModal({
                            modalOn: !props.modalOn,
                            modalHeader: '',
                            modalBody: '',
                            modalColor: '',
                        })
                    }
                >
                    Kapat
                </CButton>
            </CModalFooter>
        </CModal>
    );
}

export default Modal;
