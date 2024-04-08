import { CHeader } from '@coreui/react';

const tabs = ['Bilgi', 'Randevu', 'Tedavi', 'Hastalıklar'];

export default function PatientHeader({
    setClickedTab,
    setClickedTabIndex,
    clickedTabIndex,
}) {
    const setClickedTabHandler = (e) => {
        const { innerText } = e.target;
        function getClickedTab() {
            switch (innerText) {
                case 'Bilgi':
                    return ['INFO', 0];
                case 'Randevu':
                    return ['APPOINTMENT', 1];
                case 'Tedavi':
                    return ['TREATMENT', 2];
                case 'Hastalıklar':
                    return ['DISEASES', 3];
                default:
                    return ['INFO', 0];
            }
        }
        const clickedTab = getClickedTab();
        setClickedTab(clickedTab[0]);
        setClickedTabIndex(clickedTab[1]);
    };

    return (
        <CHeader
            style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                fontWeight: '500',
            }}
        >
            {tabs.map((tab, i) => (
                <p
                    onClick={setClickedTabHandler}
                    key={i}
                    className={`header-items clickable ${
                        i === clickedTabIndex ? 'current' : ''
                    }`}
                >
                    {tab}
                </p>
            ))}
        </CHeader>
    );
}
