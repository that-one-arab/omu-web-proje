import moment from 'moment';
import 'moment/locale/tr';

import { useEffect } from 'react';
import { timeData } from '../../global';

export default function WeekView() {
    useEffect(() => {
        moment.locale('tr');
        console.log(moment().format('LLLL'));
        console.log(moment(1316116057189).fromNow());
        console.log(moment.months());
        console.log(moment.weekdays());
    }, []);

    return (
        <div>
            <table className='schedule-table'>
                <thead>
                    <tr>
                        <th
                            className='schedule-table-header-cols'
                            style={{ width: '12.5%' }}
                        ></th>
                        {moment.weekdays(true).map((day) => (
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
                        <td className='schedule-table-data'></td>
                        <td className='schedule-table-data'></td>
                        <td className='schedule-table-data'></td>
                        <td className='schedule-table-data'></td>
                        <td className='schedule-table-data'></td>
                    </tr>
                    {timeData.map((time) => (
                        <tr className='schedule-table-row' key={time}>
                            <th className='schedule-table-header'>{time}</th>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                            <td className='schedule-table-data'></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
