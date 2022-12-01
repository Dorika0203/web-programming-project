import React, { useState, useEffect } from 'react'
import './Admin.css'
import axios from 'axios'
import { styled, alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdminSearchBar from './AdminSearchBar'
import { Button } from '@mui/material';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e6e081',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export default function AdminPage(props) {

    const [keyword, setKeyword] = useState('')
    const [data, setData] = useState([])
    const getData = async (e) => {
        try {
            const res = await axios.get(
                "/api/admin/read",
            )
            if (res.status === 200) {
                setData(res.data[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const removeAxios = async (removeCode) => {
        try {
            const res = await axios.post(
                "/api/admin/remove",
                { usercode: removeCode },
            )
            if (res.status === 200) {
                alert("removed.")
                window.location.reload()
            }
        }
        catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <AdminSearchBar setShowRows={setKeyword}></AdminSearchBar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='10%'>User Code</StyledTableCell>
                            <StyledTableCell width='30%'>ID</StyledTableCell>
                            <StyledTableCell width='30%'>email</StyledTableCell>
                            <StyledTableCell width='10%'>User Type</StyledTableCell>
                            <StyledTableCell width='10%'>Modify</StyledTableCell>
                            <StyledTableCell width='10%'>Remove</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter((value) => {
                            const findregex = new RegExp(
                                '^.*' + keyword + '.*$'
                            )
                            return findregex.test(value.id)
                        }).map((row) => (
                            <TableRow
                                key={row.usercode}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell width='10%'>{row.usercode}</TableCell>
                                <TableCell width="30%">{row.id}</TableCell>
                                <TableCell width="30%">{row.email}</TableCell>
                                <TableCell width="10%">{row.usertype}</TableCell>
                                <TableCell width="10%"><Button variant='contained' color='success'>수정</Button></TableCell>
                                <TableCell width="10%"><Button variant='contained' color='error' onClick={(e) => { removeAxios(row.usercode) }}>삭제</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}