import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Modal from 'react-modal'
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/system';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e6e081',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const style = {
    overlay: {
    },
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    }
}

function ShoppingList(props) {

    const [shopLog, setShopLog] = useState([])
    const [sum, setSum] = useState(0)

    const onAfterOpen = async () => {
        try {
            const res = await axios.get(
                '/api/buyer/buylog',
            )
            if (res.status === 200) {
                setShopLog(res.data[0])
            }

            let tmpSum = 0
            res.data[0].forEach(element => {
                tmpSum += element.price
            });
            setSum(tmpSum)
        }
        catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        onAfterOpen()
    }, [props.flag])

    return (
        <Modal style={style} isOpen={props.flag} ariaHideApp={false}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='10%'>사진</StyledTableCell>
                            <StyledTableCell width='10%'>품목 이름</StyledTableCell>
                            <StyledTableCell width='10%'>가격</StyledTableCell>
                            <StyledTableCell width='10%'>거래 장소</StyledTableCell>
                            <StyledTableCell width='10%'>판매자 ID</StyledTableCell>
                            <StyledTableCell width='10%'>간단 설명</StyledTableCell>
                            <StyledTableCell width='10%'>좋아요 수</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shopLog.map((row) => (
                            <TableRow key={row.pcode} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell width='10%'><img src={window.location.href + 'api/images/' + row.pimage} width='100' height='100' alt={window.location.href + 'api/images/' + row.pimage}></img></TableCell>
                                <TableCell width='10%'>{row.name}</TableCell>
                                <TableCell width='10%'>{row.price + '원'}</TableCell>
                                <TableCell width='10%'>{row.place}</TableCell>
                                <TableCell width='10%'>{row.sellerid}</TableCell>
                                <TableCell width='10%'>{row.ptext}</TableCell>
                                <TableCell width='10%'>{row.plikes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction='row' spacing={2}>
                <p>총합: {sum + '원'}</p>
                <Button variant='contained' color='error' onClick={(e) => { e.preventDefault(); props.setFlag(false) }}>닫기</Button>
            </Stack>
        </Modal>
    )
}

export default ShoppingList