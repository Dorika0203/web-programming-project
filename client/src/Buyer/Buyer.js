import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { styled } from '@mui/material/styles';
import LogoutButton from '../Common/LogoutButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import SearchBar2 from './SearchBar2';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e6e081',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


function BuyerPage(props) {

    const [data, setData] = useState([])
    const [keywordName, setKeywordName] = useState("")
    const [keywordSeller, setKeywordSeller] = useState("")
    const [keywordPrice, setKeywordPrice] = useState([-Infinity, Infinity])

    const setKeyword = (arg) => {
        setKeywordName(arg.kName)
        setKeywordSeller(arg.kSeller)
        setKeywordPrice(arg.kPriceRange)
    }

    const getData = async (e) => {
        try {
            const res = await axios.get(
                "/api/buyer/read",
            )
            if (res.status === 200) {
                setData(res.data[0])
                console.log(res.data[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <SearchBar2 setKeyword={setKeyword}></SearchBar2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='10%'>사진</StyledTableCell>
                            <StyledTableCell width='10%'>품목 이름</StyledTableCell>
                            <StyledTableCell width='10%'>가격</StyledTableCell>
                            <StyledTableCell width='10%'>거래 장소</StyledTableCell>
                            <StyledTableCell width='10%'>판매 형식</StyledTableCell>
                            <StyledTableCell width='10%'>판매자 ID</StyledTableCell>
                            <StyledTableCell width='10%'>간단 설명</StyledTableCell>
                            <StyledTableCell width='10%'>구매 희망 수</StyledTableCell>
                            <StyledTableCell width='10%'>최종 수정 시간</StyledTableCell>
                            <StyledTableCell width='5%'>구매</StyledTableCell>
                            <StyledTableCell width='5%'>상세설명</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter((value) => {
                            const findregex = new RegExp(
                                '^.*' + keywordName + '.*$'
                            )
                            const findregex2 = new RegExp(
                                '^.*' + keywordSeller + '.*$'
                            )
                            return (
                                findregex.test(value.name) &&
                                findregex2.test(value.sellerid) &&
                                value.price >= keywordPrice[0] &&
                                value.price <= keywordPrice[1]
                            )
                        }).map((row) => (
                            <TableRow
                                key={row.pcode}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell width='10%'><img src={window.location.href + 'api/images/' + row.pimage} width='100' height='100'></img></TableCell>
                                <TableCell width='10%'>{row.name}</TableCell>
                                <TableCell width='10%'>{row.price + '원'}</TableCell>
                                <TableCell width='10%'>{row.place}</TableCell>
                                <TableCell width='10%'>{row.ptype === 'F' ? '고정' : '경매'}</TableCell>
                                <TableCell width='10%'>{row.sellerid}</TableCell>
                                <TableCell width='10%'>{row.ptext}</TableCell>
                                <TableCell width='10%'>{row.plikes}</TableCell>
                                <TableCell width='10%'>{row.ptime}</TableCell>
                                <TableCell width="5%"><Button variant='contained' color='success' onClick={(e) => {
                                    e.preventDefault()
                                }}>구매</Button></TableCell>
                                <TableCell width="5%"><Button variant='contained' color='warning' onClick={(e) => {
                                    e.preventDefault()
                                    }}>상세보기</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BuyerPage;