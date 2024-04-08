// import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect, useState } from 'react';
import AppointmentsHeader from './AppointmentsHeader';
import './style.css';
import DayView from './DayView';
import { CCard, CRow, CCol } from '@coreui/react';
import Clock from '../../components/clock/Clock';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WeekView from './WeekView';
import MonthView from './MonthView';

// import moment from 'moment';

export default function Appointments() {
    console.log('render');
    const [clickedTab, setClickedTab] = useState('DAY');
    const [clickedTabIndex, setClickedTabIndex] = useState(0);

    console.log({ clickedTab, clickedTabIndex });

    useEffect(() => {
        // console.log(moment().calendar(moment().add(2, 'day')));
    }, []);

    return (
        <div>
            <CRow>
                <CCol>
                    <CCard>
                        <Clock />
                    </CCard>
                    <br />
                    <CCard>
                        <Calendar
                            onChange={(e) => console.log(e)}
                            // selectRange={true}
                            locale='tr'
                            defaultValue={[new Date(), new Date()]}
                            tileClassName={({ date }) => {
                                return 'calendar-date-selecte';
                            }}
                        />
                    </CCard>
                </CCol>
                <CCol xs='12' sm='10'>
                    <CCard>
                        <AppointmentsHeader
                            setClickedTab={setClickedTab}
                            setClickedTabIndex={setClickedTabIndex}
                            clickedTabIndex={clickedTabIndex}
                        />
                        <br />
                        <DndProvider backend={HTML5Backend}>
                            <ViewsHandler tab={clickedTab} />
                        </DndProvider>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
}

function ViewsHandler({ tab }) {
    switch (tab) {
        case 'DAY':
            return <DayView />;

        case 'WEEK':
            return <WeekView />;

        case 'MONTH':
            return <MonthView />;

        default:
            console.error('Unexpected appointments views tab value');
            return null;
    }
}
