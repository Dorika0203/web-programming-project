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

function BidLogModal(props) {

    const [bidLog, setbidLog] = useState([])
    const onAfterBidLogModalOpen = async () => {
        try {
            const res = await axios.get(
                '/api/seller/bidlog',
                {
                    params: {
                        pcode: props.pcode
                    }
                }
            )
            if (res.status === 200) {
                setbidLog(res.data[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        onAfterBidLogModalOpen()
    }, [props.pcode])

    return (
        <Modal style={style} isOpen={props.flag} ariaHideApp={false} onAfterOpen={props.onAfter}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width='25%'>흥정자</StyledTableCell>
                            <StyledTableCell width='25%'>이전가격</StyledTableCell>
                            <StyledTableCell width='25%'>흥정가격</StyledTableCell>
                            <StyledTableCell width='25%'>시간</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bidLog.map((row) => (
                            <TableRow key={row.logid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell width='25%'>{row.pbuyer}</TableCell>
                                <TableCell width='25%'>{row.prevprice + '원'}</TableCell>
                                <TableCell width='25%'>{row.updateprice + '원'}</TableCell>
                                <TableCell width='25%'>{row.ptime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant='contained' color='error' onClick={(e) => {e.preventDefault(); props.setFlag(false)}}>닫기</Button>
        </Modal>
    )
}

export default BidLogModal