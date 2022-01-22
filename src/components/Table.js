import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Spin from 'antd/es/spin';
import 'antd/lib/spin/style/index.css';
import {getAge} from '../utils/dateUtil';
import {ErrorHandler} from './ErrorHandler';
import {configUrl} from '../config/config'
import {sortByAscString, sortByAscDate, sortByDescDate, sortByDescString, sortByDescNum, sortByAscNum} from '../utils/sortUtil';
import './Table.css';

export const Table = () => {
    let appliedSortBy;
    let order;
    let appliedFilter;
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const browserUrl = window.location.href.replaceAll('%20', ' ');
    if (browserUrl.includes('sortBy')) {
        appliedSortBy = browserUrl.split('?')[1].split('&')[0].split('=')[1];
        order = browserUrl.split('?')[1].split('&')[1].split('=')[1];     
    }
    if (browserUrl.includes('filter')) {
        appliedFilter = browserUrl.split('?')[1].split('&')[2].split('=')[1]; 
    }

    const [currentSort, setCurrentSort] = useState('asc'); //default sorting order asc or desc
    const [currentSortBy, setCurrentSortBy] = useState(''); // default sorting on column
    const [filter, setFilter] = useState(''); // default sorting on column

    //make api call when component mounts so that we can display data in table
    useEffect (() => {
        (async () =>  {
            const response = await axios(configUrl.apiUrl);
            if (response.status === 200 && response.data && response.data.data) {
                setData(response.data.data);
                setOriginalData(response.data.data)
                setIsLoading(false);

                if (appliedSortBy) { 
                    setCurrentSortBy(appliedSortBy);
                    setCurrentSort(order);
                    if (appliedSortBy === 'Name' || appliedSortBy === 'Email' || appliedSortBy === 'Status' ) {
                        order === 'desc' ? setData([...sortByDescString(response.data.data, appliedSortBy.toLowerCase())]) : setData([...sortByAscString(response.data.data, appliedSortBy.toLowerCase())])
                    } else if (appliedSortBy === 'Position applied') {
                        order === 'desc' ? setData([...sortByDescString(response.data.data, 'position_applied')]) : setData([...sortByAscString(response.data.data, 'position_applied')])
                    } else if (appliedSortBy === 'Applied') {
                        order === 'desc' ? setData([...sortByDescDate(response.data.data, 'application_date')]) : setData([...sortByAscDate(response.data.data, 'application_date')])
                    } else if (appliedSortBy === 'Years of Experience') {
                        order === 'desc' ? setData([...sortByDescNum(response.data.data, 'year_of_experience')]) : setData([...sortByAscNum(response.data.data, 'year_of_experience')])
                    }
                }
                if (appliedFilter) { 
                    setFilter(appliedFilter); 
                    const filteredData = response.data.data.filter(cust => cust.name.toLowerCase().includes(appliedFilter.toLowerCase()) || cust.status.toLowerCase().includes(appliedFilter.toLowerCase()) || cust.position_applied.toLowerCase().includes(appliedFilter.toLowerCase()));
                    setData([...filteredData]);
                    if (!appliedFilter) {
                        setData([...response.data.data]);
                    }
                }

            } else {
                setError(true);
                setIsLoading(false);
            }            
        })();
    }, []);

    const onSortHandler = event => {
        const selectedColumn = event.target.innerText;
        sortData(selectedColumn);        
    }

    const sortData = (selectedColumn) => {
        let query;
        if (currentSortBy && currentSortBy !== selectedColumn) {
            setCurrentSort('asc');
        }
        setCurrentSortBy(selectedColumn);

        if (selectedColumn === 'Name' || selectedColumn === 'Email' || selectedColumn === 'Status' ) {
            currentSort === 'desc' ? sortByDescString(data, selectedColumn.toLowerCase()) : sortByAscString(data, selectedColumn.toLowerCase())
        } else if (selectedColumn === 'Position applied') {
            currentSort === 'desc' ? sortByDescString(data, 'position_applied') : sortByAscString(data, 'position_applied')
        } else if (selectedColumn === 'Applied') {
            currentSort === 'desc' ? sortByDescDate(data, 'application_date') : sortByAscDate(data, 'application_date')
        } else if (selectedColumn === 'Years of Experience') {
            currentSort === 'desc' ? sortByDescNum(data, 'year_of_experience') : sortByAscNum(data, 'year_of_experience')
        } 

        if (currentSort === 'asc') {
            setCurrentSort('desc');             
        } else {
            setCurrentSort('asc');  
        }

        if (currentSort && currentSortBy) {
            query = `?sortBy=${selectedColumn}&order=${currentSort}`
        }
        if (filter) {
            query = `${query}&filter=${filter}`
        }
        if (query) {
            window.history.pushState({},"", query)
        }
    }

    const onFilterHandler = event => {
        let query;
        setFilter(event.target.value);
        const filteredData = originalData.filter(cust => cust.name.toLowerCase().includes(event.target.value.toLowerCase()) || cust.status.toLowerCase().includes(event.target.value.toLowerCase()) || cust.position_applied.toLowerCase().includes(event.target.value.toLowerCase()));
        setData([...filteredData]);
        if (!event.target.value) {
            setData([...originalData]);
        }
        if (currentSort && currentSortBy) {
            query = `?sortBy=${currentSortBy}&order=${currentSort}`
        }
        if (event.target.value) {
            query = `${query}&filter=${event.target.value}`
        }
        if (query) {
            window.history.pushState({},"", query)
        }
    }

    if (error) {
        return <ErrorHandler />
    }

    const tableData = <table>
					<thead>
						<tr>
							<th onClick={onSortHandler}>Name</th>
							<th onClick={onSortHandler}>Email</th>
                            <th>Age</th>
                            <th onClick={onSortHandler}>Years of Experience</th>
                            <th onClick={onSortHandler}>Position applied</th>
                            <th onClick={onSortHandler}>Applied</th>
                            <th onClick={onSortHandler}>Status</th>
						</tr>                                
					</thead>
					<tbody>
						{data && data.map(candidate => (
							<tr>
								<td>{candidate.name}</td>
								<td>{candidate.email}</td>
                                <td>{getAge(candidate.birth_date)}</td>
								<td>{candidate.year_of_experience}</td>
                                <td>{candidate.position_applied}</td>
								<td>{candidate.application_date}</td>
                                <td>{candidate.status}</td>
							</tr>
						))}
					</tbody>
				</table>

    return isLoading ? <Spin tip="Loading..." size='large' style={{ marginLeft: '600px', marginTop: '150px'}}/> :  <div>
        <input type="text" value={filter} onChange={onFilterHandler} placeholder='Type here to filter out the data...' style={{ margin: '10px', padding: '6px', width: '250px'}}></input>
        {tableData}
    </div>;

};
