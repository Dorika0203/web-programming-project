import React from 'react'
import Modal from 'react-modal'
import { Button } from '@mui/material'

function DetailModal(props) {

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

    return (
        <Modal style={style} isOpen={props.flag} ariaHideApp={false}>
            <h1>상세정보</h1>
            <p>{props.message}</p>
            <Button variant='contained' color='secondary' onClick={(e) => {
                e.preventDefault()
                props.setFlag(false)
            }}>닫기</Button>
        </Modal>
    )
}

export default DetailModal