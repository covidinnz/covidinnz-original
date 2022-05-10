import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchBar from '@components/SearchBar';
import { COLOURS } from '@constants/variables';

export default function _Table({ type, ...props }) {
    function SwitchTable({ param }) {
        switch (param) {
            case 'top':
                return <TopTable {...props} />;
            case 'left':
                return <LeftTable {...props} />;
            default:
                return 'No table type specified';
        }
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: '100%',
                overflowX: 'none',
                '& .MuiTableRow-root:nth-child(even)': {
                    backgroundColor: COLOURS.YELLOW,
                },
                '& .MuiTableRow-root:nth-child(odd)': {
                    backgroundColor: COLOURS.WHITE,
                },
            }}
        >
            <SwitchTable param={type} />
        </TableContainer>
    );
}

function descendingComparator(a, b, orderBy) {
    let c = a[orderBy],
        d = b[orderBy];
    const to = (e) => Number(`${e}`.split(' ')[0].replace(/,|%/, ''));
    if (to(c) || to(d)) {
        c = to(c);
        d = to(d);
    }

    if (typeof c === 'number') {
        if (c < d) return -1;
        if (c > d) return 1;
    } else if (typeof c === 'string') return c.localeCompare(d);
    else return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function TopTable({ defaultOrderBy, defaultOrder, headers, cells, searchProperty }) {
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [order, setOrder] = useState(defaultOrder || 'desc');
    const [rows, setRows] = useState(cells);
    const [searched, setSearched] = useState('');

    function requestSort(event, property) {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    function requestSearch(query) {
        const filtered = cells.filter((row) => row[searchProperty].toLowerCase().includes(query.toLowerCase()));
        setRows(filtered);
    }

    function cancelSearch() {
        setSearched('');
        requestSearch(searched);
    }

    return (
        <>
            {searchProperty && (
                <SearchBar
                    placeholder="Search"
                    value={searched}
                    onChange={(query) => requestSearch(query)}
                    onCancel={() => cancelSearch()}
                />
            )}

            <Table size="small">
                <TableHead>
                    <TableRow>
                        {headers.map(({ field, headerName, flex, type, sortable }) => (
                            <TableCell
                                key={field}
                                align={type === 'number' ? 'right' : 'left'}
                                style={{ flex: flex }}
                                sortDirection={orderBy === field ? order : false}
                            >
                                {sortable ? (
                                    <TableSortLabel
                                        active={orderBy === field}
                                        direction={orderBy === field ? order : 'asc'}
                                        onClick={(event) => requestSort(event, field)}
                                    >
                                        {headerName}
                                    </TableSortLabel>
                                ) : (
                                    headerName
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                        .slice()
                        .sort(getComparator(order, orderBy))
                        .map(({ id, ...row }) => {
                            return (
                                <TableRow key={id}>
                                    {headers.map(({ flex, type, field }, index) => {
                                        const align = type === 'number' ? 'right' : 'left';
                                        return (
                                            <TableCell key={index} align={align} style={{ flex: flex }}>
                                                {row[field]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </>
    );
}

function LeftTable({ headers, cells }) {
    return (
        <Table size="small">
            <TableBody>
                {headers.map(({ field, headerName, flex, type }, index) => {
                    const align = type === 'number' ? 'right' : 'left';
                    return (
                        <TableRow key={index}>
                            <TableCell key={index} style={{ flex: flex }}>
                                {headerName}
                            </TableCell>
                            {cells.map(({ id, ...row }) => {
                                return (
                                    <TableCell key={id} align={align} style={{ flex: flex }}>
                                        {row[field]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
