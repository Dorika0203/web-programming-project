import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import { Button } from '@mui/material'
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    border: '1px solid',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(0)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
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
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    }
}

function BuyModal(props) {

    const [buyInfo, setBuyInfo] = useState({
        pcode : 0,
        price : -2
    })

    const handleChange = (key, value) => {
        setBuyInfo({ ...buyInfo, [key]: value })
    }

    const buyAxios = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/buyer/buy', buyInfo)
            if(res.status===200) alert("완료되었습니다.")
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('SERVER INTERNAL ERROR')
            }
            else if (err.response.status === 400) {
                alert(err.response.data.message)
            }
        }
        window.location.reload()
    }

    useEffect(() => {
        setBuyInfo(props.buyInfo)
    }, [props.buyInfo])


    if (props.buyInfo.price === -1) {
        return (
            <Modal style={style} isOpen={props.flag} ariaHideApp={false}>
                <h1>정말로 구매하시겠습니까?</h1>
                <Button variant='contained' color='success' onClick={buyAxios}>네</Button>
                <Button variant='contained' color='error' onClick={(e) => {
                    e.preventDefault()
                    props.setFlag(false)
                }}>아니요</Button>
            </Modal>
        )
    }
    return (
        <Modal style={style} isOpen={props.flag} ariaHideApp={false}>
            <h1>경매 가격 신청</h1>
            <StyledInputBase type='number' name='price' placeholder={props.buyInfo.price + " 초과"} onChange={(e) =>{
                e.preventDefault()
                handleChange('price', e.target.value)
            }} defaultValue={props.buyInfo.price}></StyledInputBase>
            <Button variant='contained' color='success' onClick={buyAxios}>네</Button>
            <Button variant='contained' color='error' onClick={(e) => {
                e.preventDefault()
                props.setFlag(false)
            }}>아니요</Button>
        </Modal>
    )
}

export default BuyModal