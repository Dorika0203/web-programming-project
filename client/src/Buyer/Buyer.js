import React, { useEffect, useState } from 'react'
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
import SearchBar2 from './SearchBar2';
import DetailModal from './DetailModal';
import BuyModal from './BuyModal';
import ShoppingList from './ShoppingList';

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
    const [detailFlag, setDetailFlag] = useState(false)
    const [detailMessage, setDetailMessage] = useState("")
    const [buyFlag, setbuyFlag] = useState(false)
    const [buyInfo, setBuyInfo] = useState({
        pcode: 0,
        price: -2
    })
    const [shopFlag, setShopFlag] = useState(false)

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
            <Stack direction='row'>
                <SearchBar2 setKeyword={setKeyword}></SearchBar2>
                <Button variant='contained' color='warning' onClick={(e) => {
                    setShopFlag(true)
                }}>구매 목록 보기</Button>
            </Stack>
            <DetailModal flag={detailFlag} setFlag={setDetailFlag} message={detailMessage}></DetailModal>
            <ShoppingList flag={shopFlag} setFlag={setShopFlag}></ShoppingList>
            <BuyModal flag={buyFlag} setFlag={setbuyFlag} buyInfo={buyInfo}></BuyModal>
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
                            <StyledTableCell width='10%'>좋아요 수</StyledTableCell>
                            <StyledTableCell width='5%'>찜하기</StyledTableCell>
                            <StyledTableCell width='10%'>구매/경매</StyledTableCell>
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
                                <TableCell width='10%'><img src={window.location.href + 'api/images/' + row.pimage} width='100' height='100' alt={window.location.href + 'api/images/' + row.pimage}></img></TableCell>
                                <TableCell width='10%'>{row.name}</TableCell>
                                <TableCell width='10%'>{row.price + '원'}</TableCell>
                                <TableCell width='10%'>{row.place}</TableCell>
                                <TableCell width='10%'>{row.ptype === 'F' ? '고정' : '경매'}</TableCell>
                                <TableCell width='10%'>{row.sellerid}</TableCell>
                                <TableCell width='10%'>{row.ptext}</TableCell>
                                <TableCell width='10%'>{row.plikes}</TableCell>
                                <TableCell width='5%'><Button variant='contained' color='secondary' onClick={(e) => {
                                    e.preventDefault()
                                }}>찜!</Button></TableCell>
                                <TableCell width="10%"><Button variant='contained' color='success' onClick={(e) => {
                                    e.preventDefault()
                                    let price = -2
                                    if(row.ptype === 'B') price = row.price
                                    setBuyInfo({
                                        pcode: row.pcode,
                                        price: price+1
                                    })
                                    setbuyFlag(true)
                                }}>구매/경매</Button></TableCell>
                                <TableCell width="5%"><Button variant='contained' color='warning' onClick={(e) => {
                                    e.preventDefault()
                                    setDetailFlag(true)
                                    setDetailMessage(row.ptextdetail)
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