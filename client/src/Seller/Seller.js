import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Stack } from '@mui/material';
import SearchBar from '../Common/SearchBar';
import SellerUpdate from './SellerUpdate';
import BidLogModal from './BidLog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e6e081',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


function SellerPage(props) {

    const [keyword, setKeyword] = useState('')
    const [data, setData] = useState([])
    const [modifyFlag, setModifyFlag] = useState(0)
    const [defaultForm, setDefaultForm] = useState({
        name: '',
        price: '',
        place: '',
        ptype: 'F',
        ptext: '',
        ptextdetail: '',
        pimage: '',
        pcode: 0,
    })
    const [bidFlag, setbidFlag] = useState(false)
    const [bidPcode, setbidPcode] = useState(-1)

    const getData = async (e) => {
        try {
            const res = await axios.get(
                "/api/seller/read",
            )
            if (res.status === 200) {
                setData(res.data[0])
                console.log(res.data[0])
            }
            return
        }
        catch (err) {
            console.log(err)
            return
        }
    }

    const removeAxios = async (removeCode) => {
        console.log(removeCode)
        const removeJson = { productcode: removeCode }
        try {
            await axios.post(
                "/api/seller/remove",
                removeJson,
            )
            alert("removed.")
        }
        catch (err) {
            alert(err)
        }
        window.location.reload()
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <div>
            <Stack direction="row">
                <SearchBar setShowRows={setKeyword} usage={'???????????????, ????????????'}></SearchBar>
                <Button variant='contained' color='warning' onClick={(e) => {
                    e.preventDefault();
                    setDefaultForm({
                        name: '',
                        price: '',
                        place: '',
                        ptype: 'F',
                        ptext: '',
                        ptextdetail: '',
                        pimage: '',
                        pcode: -1,
                    })
                    setModifyFlag(1)
                }}
                >??????</Button>
            </Stack>
            <SellerUpdate flag={modifyFlag} setFlag={setModifyFlag} default={defaultForm}></SellerUpdate>
            <BidLogModal flag={bidFlag} setFlag={setbidFlag} pcode={bidPcode}></BidLogModal>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='10%'>??????</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ??????</StyledTableCell>
                            <StyledTableCell width='10%'>??????</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ??????</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ??????</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ??????</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ??????</StyledTableCell>
                            <StyledTableCell width='5%'>?????? ?????? ???</StyledTableCell>
                            <StyledTableCell width='10%'>?????? ?????? ??????</StyledTableCell>
                            <StyledTableCell width='10%'>??????</StyledTableCell>
                            <StyledTableCell width='5%'>??????</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter((value) => {
                            const findregex = new RegExp(
                                '^.*' + keyword + '.*$'
                            )
                            return findregex.test(value.name)
                        }).map((row) => (
                            <TableRow
                                key={row.pcode}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell width='10%'><img src={window.location.href + 'api/images/' + row.pimage} width='100' height='100' alt={window.location.href + 'api/images/' + row.pimage}></img></TableCell>
                                <TableCell width='10%'>{row.name}</TableCell>
                                <TableCell width='10%'>{row.price + '???'}</TableCell>
                                <TableCell width='10%'>{row.place}</TableCell>
                                <TableCell width='10%'>{row.ptype === 'F' ? '??????' : <Button variant='contained' color='secondary' onClick={(e) => {
                                    setbidPcode(row.pcode)
                                    setbidFlag(true)
                                    // onAfterBidLogModalOpen()
                                }} disabled={row.pstatus === 'O' ? false : true}>??????</Button>}</TableCell>
                                <TableCell width='10%'>{row.pstatus === 'O' ? '?????????' : '????????????'}</TableCell>
                                <TableCell width='10%'>{row.ptext}</TableCell>
                                <TableCell width='5%'>{row.plikes}</TableCell>
                                <TableCell width='10%'>{row.ptime}</TableCell>
                                <TableCell width="10%"><Button variant='contained' color='success' onClick={(e) => {
                                    e.preventDefault()
                                    if(row.ptype === 'F') {
                                        setModifyFlag(2)
                                        setDefaultForm({
                                            name: row.name,
                                            price: row.price,
                                            place: row.place,
                                            ptype: row.ptype,
                                            ptext: row.ptext,
                                            ptextdetail: row.ptextdetail,
                                            pimage: undefined,
                                            pcode: row.pcode,
                                        })
                                    }
                                }} disabled={row.pstatus === 'O' && row.ptype === 'F' ? false : true}>??????</Button></TableCell>
                                <TableCell width="5%"><Button variant='contained' color='error' onClick={(e) => {
                                    e.preventDefault(); removeAxios(row.pcode) }} disabled={row.pstatus === 'O' ? false : true}>??????</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default SellerPage;