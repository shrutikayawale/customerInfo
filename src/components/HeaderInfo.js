import React from 'react';
import {Table} from './Table';
import {Header} from './Header';

export const HeaderInfo = () => {
    return <React.Fragment>
        <Header />
        <div style={{margin: '20px'}}><Table /></div>
    </React.Fragment>
};

