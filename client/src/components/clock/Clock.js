import React, { useEffect, useState } from 'react';
import 'react-clock/dist/Clock.css';

import Clock from 'react-clock';

export default function ReactClock() {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            className='d-flex justify-content-center'
            style={{ padding: '10px' }}
        >
            <Clock value={value} />
        </div>
    );
}
