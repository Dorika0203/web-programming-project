import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { styled, alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Stack } from '@mui/material';
import SearchBar from '../Admin/SearchBar';
import SellerUpdate from './SellerUpdate';

// 이름, 가격, 거래장소, 전화번호, (옥션인지, 구매됬는지, 진행중인지)
// 판매 물건 정보 수정, 삭제
// 판매 물건 리스트 - 상품 이름, 희망 구매자 수
// 옥션 히스토리 - 가격, 흥정자 ID


// 판매 물건 DB

// 물건 코드번호 - pcode
// 판매자 ID - sellerid
// 물건 이름 - name
// 물건 가격 (경매 시 최신 가격) - price
// 물건 거래장소 - place
// 물건 거래타입(고정가, 경매) - ptype
// 물건 간단정보 - ptext
// 물건 상세정보 - ptextdetail
// 물건 사진 - pimage
// 찜한사람 수 - plikes
// 물건 최근 수정 시간 - ptime

// 경매 물건별 히스토리


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
        pcode: -1
    })

    const getData = async (e) => {
        try {
            const res = await axios.get(
                "/api/seller/read",
            )
            if (res.status === 200) {
                setData(res.data[0])
                // console.log(res.data[0])
            }
            return
        }
        catch (err) {
            console.log(err)
            return
        }
    }

    const removeAxios = async (removeCode) => {
        try {
            const res = await axios.post(
                "/api/seller/remove",
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
            <Stack direction="row">
                <SearchBar setShowRows={setKeyword} usage={'어서오세요, ' + 'name' + '님 (판매자)'}></SearchBar>
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
                        pcode: -1
                    })
                    setModifyFlag(1)
                }}
                >추가</Button>
            </Stack>
            <SellerUpdate flag={modifyFlag} setFlag={setModifyFlag} default={defaultForm}></SellerUpdate>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='10%'>사진</StyledTableCell>
                            <StyledTableCell width='10%'>품목 이름</StyledTableCell>
                            <StyledTableCell width='10%'>가격</StyledTableCell>
                            <StyledTableCell width='10%'>거래 장소</StyledTableCell>
                            <StyledTableCell width='10%'>판매 형식</StyledTableCell>
                            <StyledTableCell width='10%'>간단 설명</StyledTableCell>
                            <StyledTableCell width='10%'>구매 희망 수</StyledTableCell>
                            <StyledTableCell width='10%'>최종 수정 시간</StyledTableCell>
                            <StyledTableCell width='10%'>수정</StyledTableCell>
                            <StyledTableCell width='10%'>삭제</StyledTableCell>
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
                                <TableCell width='10%'>{row.pimage}</TableCell>
                                <TableCell width='10%'>{row.name}</TableCell>
                                <TableCell width='10%'>{row.price + '원'}</TableCell>
                                <TableCell width='10%'>{row.place}</TableCell>
                                <TableCell width='10%'>{row.ptype === 'F' ? '고정' : '경매'}</TableCell>
                                <TableCell width='10%'>{row.ptext}</TableCell>
                                <TableCell width='10%'>{row.plikes}</TableCell>
                                <TableCell width='10%'>{row.ptime}</TableCell>
                                <TableCell width="10%"><Button variant='contained' color='success' onClick={(e) => {
                                    setModifyFlag(2)
                                    setDefaultForm({
                                        name: row.name,
                                        price: row.price,
                                        place: row.place,
                                        ptype: row.ptype,
                                        ptext: row.ptext,
                                        ptextdetail: row.ptextdetail,
                                        pimage: row.pimage,
                                        pcode: row.pcode
                                    })
                                }}>수정</Button></TableCell>
                                <TableCell width="10%"><Button variant='contained' color='error' onClick={(e) => {removeAxios(row.usercode) }} >삭제</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default SellerPage;