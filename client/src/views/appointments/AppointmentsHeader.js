import { CHeader } from '@coreui/react';

const tabs = ['Gün', 'Hafta', 'Ay'];

export default function AppointmentsHeader({
    setClickedTab,
    setClickedTabIndex,
    clickedTabIndex,
}) {
    const setClickedTabHandler = (e) => {
        const { innerText } = e.target;
        function getClickedTab() {
            switch (innerText) {
                case 'Gün':
                    return ['DAY', 0];
                case 'Hafta':
                    return ['WEEK', 1];
                case 'Ay':
                    return ['MONTH', 2];
                default:
                    return ['INFO', 0];
            }
        }
        const clickedTab = getClickedTab();
        setClickedTab(clickedTab[0]);
        setClickedTabIndex(clickedTab[1]);
    };

    return (
        <CHeader className='header-wrapper'>
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
