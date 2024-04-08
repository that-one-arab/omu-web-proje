import { useState, useEffect } from 'react';

import './style.css';

import {
    CCol,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CLabel,
    CInput,
    CFormText,
    CTextarea,
    CSelect,
    CInputCheckbox,
    CRow,
} from '@coreui/react';
import { treatmentData as initialTreatmentData } from '../../../data';
import { teethNumbers } from '../../../global';

const parseCurrencyNameToSymbol = (name) => {
    switch (name) {
        case 'lira':
            return 'TL';
        case 'dollar':
            return '$';
        case 'euro':
            return '€';
        default:
            break;
    }
};

const addTreatmentDiscountsProperties = (treatmentData) =>
    treatmentData.map((treatment) => {
        if (typeof treatment.price === 'number')
            return {
                ...treatment,
                discount10:
                    treatment.price * ((100 - 10) / 100) +
                    parseCurrencyNameToSymbol(treatment.currency),
                discount20:
                    treatment.price * ((100 - 20) / 100) +
                    parseCurrencyNameToSymbol(treatment.currency),
            };
        else
            return {
                ...treatment,
                discount10:
                    Number(treatment.price.match(/\d/g).join('')) *
                        ((100 - 10) / 100) +
                    parseCurrencyNameToSymbol(treatment.currency),
                discount20:
                    Number(treatment.price.match(/\d/g).join('')) *
                        ((100 - 20) / 100) +
                    parseCurrencyNameToSymbol(treatment.currency),
            };
    });

const treatmentPriceHandler = (treatment, discount) => {
    if (!discount) return treatment.price;
    else if (discount === 20) return treatment.discount20;
    else if (discount === 10) return treatment.discount10;
};

const treatmentsTotalHandler = (treatments, discount) => {
    let total = 0;
    if (discount === 20) {
        total =
            treatments.length > 1
                ? treatments.reduce((prev, curr) => {
                      const prevPrice =
                          typeof prev !== 'number'
                              ? prev.discount20.match(/\d/g).join('')
                              : prev;

                      const currPrice = curr.discount20.match(/\d/g).join('');

                      return Number(prevPrice) + Number(currPrice);
                  })
                : Number(treatments[0].discount20.match(/\d/g).join(''));
    } else if (discount === 10) {
        total =
            treatments.length > 1
                ? treatments.reduce((prev, curr) => {
                      const prevPrice =
                          typeof prev !== 'number'
                              ? prev.discount10.match(/\d/g).join('')
                              : prev;

                      const currPrice = curr.discount10.match(/\d/g).join('');

                      return Number(prevPrice) + Number(currPrice);
                  })
                : Number(treatments[0].discount10.match(/\d/g).join(''));
    } else {
        total =
            treatments.length > 1
                ? treatments.reduce((prev, curr) => {
                      const prevPrice =
                          typeof prev !== 'number'
                              ? prev.price.match(/\d/g).join('')
                              : prev;

                      const currPrice = curr.price.match(/\d/g).join('');

                      return Number(prevPrice) + Number(currPrice);
                  })
                : Number(treatments[0].price.match(/\d/g).join(''));
    }
    return total;
};

export function AddTreatmentModal({
    show,
    setShow,
    patientID,
    setRenderCount,
    setLoading,
}) {
    const treatmentData = addTreatmentDiscountsProperties(initialTreatmentData);

    const [selectedTreatment, setSelectedTreatment] = useState(undefined);
    const [treatmentName, setTreatmentName] = useState('');
    const [treatmentPrice, setTreatmentPrice] = useState(0);
    const [treatmentTeethNo, setTreatmentTeethNo] = useState(0);
    const [treatmentDate, setTreatmentDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [treatmentDescription, setTreatmentDescription] = useState('');

    const [addButtonDisabled, setAddButtonDisabled] = useState(true);

    const [treatments, setTreatments] = useState([]);
    const [treatmentsTotal, setTreatmentsTotal] = useState(0);

    const [doctorDiscount, setDoctorDiscount] = useState(0);

    const setSelectedTreatmentHandler = (e) => {
        const selectedTreatment = treatmentData.find(
            (treatment) => treatment.name === e.target.value
        );

        if (selectedTreatment) {
            const selectedTreatmentPrice =
                selectedTreatment.price +
                parseCurrencyNameToSymbol(selectedTreatment.currency);

            setSelectedTreatment({
                ...selectedTreatment,
                price: selectedTreatmentPrice,
                date: treatmentDate,
            });
            setTreatmentPrice(selectedTreatmentPrice);
        } else {
            setTreatmentPrice(0);
        }
        setTreatmentName(e.target.value);
    };

    const setTreatmentTeethNoHandler = (e) =>
        setTreatmentTeethNo(Number(e.target.value));

    const setTreatmentPriceHandler = (e) => {
        setTreatmentPrice(e.target.value);
    };

    const setTreatmentDateHandler = (e) => setTreatmentDate(e.target.value);

    const setTreatmentDescriptionHandler = (e) =>
        setTreatmentDescription(e.target.value);

    const resetFormFields = () => {
        setTreatmentName('');
        setTreatmentPrice(0);
        setTreatmentTeethNo(0);
        setTreatmentDescription('');
    };

    const resetAllFields = () => {
        setTreatmentName('');
        setTreatmentPrice(0);
        setTreatmentTeethNo(0);
        setTreatmentDescription('');
        setSelectedTreatment(undefined);
        setTreatments([]);
        setDoctorDiscount(0);
        setTreatmentsTotal(0);
        setAddButtonDisabled(true);
    };

    const setTreatmentsHandler = () => {
        if (!addButtonDisabled) {
            const toBeAddedTreatment = {
                ...selectedTreatment,
                teethNum: treatmentTeethNo,
                description: treatmentDescription,
                price: treatmentPrice,
                date: treatmentDate,
            };
            let currentTreatments = [...treatments, toBeAddedTreatment];
            currentTreatments =
                addTreatmentDiscountsProperties(currentTreatments);

            /** Treatment prices total
             * If there is more than 1 selected treatment, we reduce the array else we parse the first element */
            const total = treatmentsTotalHandler(
                currentTreatments,
                doctorDiscount
            );

            setTreatments(currentTreatments);

            setTreatmentsTotal(total);
            resetFormFields();
        }
    };

    const removeTreatment = (index) => {
        const treatmentsCopy = JSON.parse(JSON.stringify(treatments));
        const removedTreatment = treatmentsCopy[index];
        let removedTreatmentPrice = 0;
        if (doctorDiscount === 20) {
            removedTreatmentPrice = Number(
                removedTreatment.discount20.match(/\d/g).join('')
            );
        } else if (doctorDiscount === 10) {
            removedTreatmentPrice = Number(
                removedTreatment.discount10.match(/\d/g).join('')
            );
        } else
            removedTreatmentPrice = Number(
                removedTreatment.price.match(/\d/g).join('')
            );
        setTreatmentsTotal(
            (currentTotal) => currentTotal - removedTreatmentPrice
        );

        treatmentsCopy.splice(index, 1);
        setTreatments(treatmentsCopy);
    };

    /** Called in checkbox tags
     * Handles setting the total values depending on the selected discount
     */
    const setDoctorDiscountHandler = (value) => {
        let discount = Number(value);

        if (discount === doctorDiscount) {
            setDoctorDiscount(0);
            discount = null;
        } else setDoctorDiscount(discount);

        if (treatments && treatments.length) {
            const total = treatmentsTotalHandler(treatments, discount);
            setTreatmentsTotal(total);
        }
    };

    const submitForm = async () => {
        setLoading(true);
        const body = treatments.map((treatment) => {
            if (doctorDiscount === 20) {
                return {
                    ...treatment,
                    price: treatment.discount20.match(/\d/g).join(''),
                };
            } else if (doctorDiscount === 10) {
                return {
                    ...treatment,
                    price: treatment.discount10.match(/\d/g).join(''),
                };
            } else
                return {
                    ...treatment,
                    price: treatment.price.match(/\d/g).join(''),
                };
        });

        const res = await fetch(`/api/patients/${patientID}/treatments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${document.cookie} `,
            },
            body: JSON.stringify(body),
        });
        if (res.status === 201) {
            setRenderCount((prevVal) => prevVal + 1);
            setTreatments([]);
            setShow(false);
            resetAllFields();
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedTreatment && treatmentPrice) setAddButtonDisabled(false);
        else setAddButtonDisabled(true);
    }, [selectedTreatment, treatmentPrice]);

    return (
        <CModal
            show={show}
            onClose={() => {
                setShow(!show);
                resetAllFields();
            }}
            color={'success'}
            centered
            size='xl'
        >
            <CModalHeader closeButton>
                <CModalTitle> Yeni Tedavi Ekle </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup row>
                    <CCol lg='6'>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='select'>Yapılan Tedavi</CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CSelect
                                    value={treatmentName}
                                    onChange={setSelectedTreatmentHandler}
                                >
                                    {treatmentData.map((treatment) => (
                                        <option key={treatment.id}>
                                            {treatment.name}
                                        </option>
                                    ))}
                                </CSelect>
                                <CFormText>
                                    Hastaya verilen tedaviyi seçiniz
                                </CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='select'>Diş No</CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CSelect
                                    onChange={setTreatmentTeethNoHandler}
                                    value={treatmentTeethNo}
                                >
                                    {teethNumbers.map((no, i) => (
                                        <option key={i}>{no}</option>
                                    ))}
                                </CSelect>
                                <CFormText>
                                    Tedavi edilen diş numarası
                                </CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='text-input'>
                                    Tedavi Ücreti
                                </CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CInput
                                    id='text-input'
                                    name='text-input'
                                    placeholder='0.00'
                                    value={treatmentPrice}
                                    onChange={setTreatmentPriceHandler}
                                />
                                <CFormText>
                                    Seçilen tedavinin ücreti (para birimini
                                    eklemeye unutmayın){' '}
                                </CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='date-input'>
                                    Tedavi tarihi
                                </CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CInput
                                    type='date'
                                    id='date-input'
                                    name='date-input'
                                    placeholder='date'
                                    value={treatmentDate}
                                    onChange={setTreatmentDateHandler}
                                />
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='extra-details'>
                                    Ekstra Açıklama
                                </CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CTextarea
                                    value={treatmentDescription}
                                    onChange={setTreatmentDescriptionHandler}
                                    placeholder='açıklamanız...'
                                    id='extra-details'
                                />
                                <CFormText>
                                    İsteğe bağlı ekstra eklemek istediğiniz
                                    açıklama
                                </CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup className='d-flex flex-row-reverse bd-highlight'>
                            <CButton
                                color='info'
                                onClick={setTreatmentsHandler}
                                disabled={addButtonDisabled}
                            >
                                Ekle
                            </CButton>
                        </CFormGroup>
                    </CCol>
                    <CCol lg='6' className='cart'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Tedavi</th>
                                    <th scope='col'>Diş No</th>
                                    <th scope='col'>Ücret</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatments.length
                                    ? treatments.map((treatment, i) => (
                                          <tr key={i}>
                                              <th scope='row'> {i + 1} </th>
                                              <td>{treatment.name} </td>
                                              <td>{treatment.teethNum}</td>
                                              <td>
                                                  {treatmentPriceHandler(
                                                      treatment,
                                                      doctorDiscount
                                                  )}{' '}
                                              </td>
                                              <td
                                                  className='remove-treatment'
                                                  onClick={() =>
                                                      removeTreatment(i)
                                                  }
                                              >
                                                  <i className='fas fa-times'></i>
                                              </td>
                                          </tr>
                                      ))
                                    : null}
                            </tbody>
                        </table>

                        <CRow>
                            <CCol>
                                <p> Toplam: {treatmentsTotal} </p>
                            </CCol>
                            <CCol>
                                <CFormGroup row>
                                    <CCol>
                                        <CLabel>Hekim indirimi</CLabel>
                                    </CCol>
                                    <CCol>
                                        <CFormGroup
                                            variant='custom-checkbox'
                                            inline
                                        >
                                            <CInputCheckbox
                                                style={{ zIndex: '2' }}
                                                checked={doctorDiscount === 20}
                                                value={20}
                                                onChange={(e) =>
                                                    setDoctorDiscountHandler(
                                                        e.target.value
                                                    )
                                                }
                                                custom
                                            />
                                            <CLabel variant='custom-checkbox'>
                                                20%
                                            </CLabel>
                                        </CFormGroup>
                                        <CFormGroup
                                            variant='custom-checkbox'
                                            inline
                                        >
                                            <CInputCheckbox
                                                style={{ zIndex: '2' }}
                                                checked={doctorDiscount === 10}
                                                custom
                                                value={10}
                                                onChange={(e) =>
                                                    setDoctorDiscountHandler(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <CLabel variant='custom-checkbox'>
                                                10%
                                            </CLabel>
                                        </CFormGroup>
                                    </CCol>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CCol>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color='secondary'
                    variant='outline'
                    onClick={() => setShow(!show)}
                >
                    Kapat
                </CButton>
                <CButton color='success' onClick={submitForm}>
                    Onayla
                </CButton>
            </CModalFooter>
        </CModal>
    );
}
