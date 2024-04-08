import moment from 'moment';
import 'moment/locale/tr';

import { useEffect, useState } from 'react';
import { timeData } from '../../global';

export default function MonthView() {
    const [daysInMonth, setDaysInMonth] = useState(undefined);

    useEffect(() => {
        setDaysInMonth(() => {
            let res = [];
            const momentDaysInMonth = moment().daysInMonth(); // Number
            for (let i = 1; i < momentDaysInMonth; i++) {
                const day = i;
                res.push(moment().date(day).format('DD/MM/YYYY'));
            }
            setDaysInMonth(res);
        });
    }, []);
    console.log({ daysInMonth });

    return (
        <div>
            <table className='schedule-table s-t-horizontal-scroll'>
                <thead>
                    <tr>
                        <th
                            className='schedule-table-header-cols'
                            style={{ width: '12.5%' }}
                        ></th>
                        {daysInMonth &&
                            daysInMonth.map((day) => (
                                <th
                                    style={{
                                        width: '12.5%',
                                        borderBottom: 'solid 1px black',
                                    }}
                                    className='schedule-table-header-cols'
                                    key={day}
                                >
                                    {day}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className='schedule-table-row'>
                        <th className='schedule-table-header'>09:00</th>
                        <td className='schedule-table-data stage-earth'>
                            Speaker One <span>Earth Stage</span>
                        </td>
                        {daysInMonth &&
                            daysInMonth.map((val, i) => (
                                <td
                                    key={i}
                                    className='schedule-table-data'
                                ></td>
                            ))}
                    </tr>
                    {timeData.map((time) => (
                        <tr className='schedule-table-row' key={time}>
                            <th className='schedule-table-header'>{time}</th>
                            {daysInMonth &&
                                daysInMonth.map((val, i) => (
                                    <td
                                        key={i}
                                        className='schedule-table-data'
                                    ></td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
