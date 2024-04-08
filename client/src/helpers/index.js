import XLSX from 'xlsx';

export const fetchDoctors = async () => {
    const res = await fetch('/api/doctors', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${document.cookie} `,
        },
    });
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else return [];
};

export const fetchTranslators = async () => {
    const res = await fetch('/api/translators', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${document.cookie} `,
        },
    });
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else return [];
};

export const fetchPatient = async (patientID) => {
    const res = await fetch(`/api/patients/${patientID}`, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${document.cookie} `,
        },
    });
    if (res.status === 200) {
        const data = await res.json();
        return data;
    } else return null;
};

export function parseTreatmentPrice(treatmentPrice, treatmentPriceCurrency) {
    switch (treatmentPriceCurrency) {
        case 'lira':
            return treatmentPrice + ' TL';
        case 'dollar':
            return treatmentPrice + ' $';
        case 'euro':
            return treatmentPrice + ' €';
        default:
            return treatmentPrice;
    }
}

export function parseTreatments(treatments) {
    return treatments.map((treatment) => ({
        ...treatment,
        treatmentPrice: parseTreatmentPrice(
            treatment.treatmentPrice,
            treatment.treatmentPriceCurrency
        ),
    }));
}

export const exportFile = (data, cols, sheetName, fileName) => {
    const excelData = JSON.parse(JSON.stringify(data));
    let arrOfArrs = [];
    for (let i = 0; i < excelData.length; i++) {
        arrOfArrs[i] = Object.values(excelData[i]);
    }
    arrOfArrs.unshift(cols);
    const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName + '.xlsx');
};
