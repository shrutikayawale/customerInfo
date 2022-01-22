const moment = require('moment');

export const sortByAscString = (data, column) => {
	return data.sort((a, b) => a[column].localeCompare(b[column]));
}

export const sortByDescString = (data, column) => {
	return data.sort((a, b) => a[column].localeCompare(b[column])).reverse();
}

export const sortByAscNum = (data, column) => {
	return data.sort((a, b) => a[column] - b[column]);
}

export const sortByDescNum = (data, column) => {
	return data.sort((a, b) => a[column] - b[column]).reverse();
}

export const sortByAscDate = (data, column) => {
	return data.sort((a, b) => moment(a[column]) - moment(b[column]));
}

export const sortByDescDate = (data, column) => {
	return data.sort((a, b) => moment(a[column]) - moment(b[column])).reverse();
}

