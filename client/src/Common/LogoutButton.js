import * as React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

export default function LogoutButton() {

  const handleButton = async (e) => {
    try {
        const res = await axios.get("/api/logout")
        if(res.status === 200) alert("로그아웃 성공")
        window.location.reload()
    }
    catch(err) {
        alert("SERVER ERROR")
        window.location.reload()
    }
  }

  return (
    <Button variant='contained' color='error' onClick={handleButton}>로그아웃</Button>
  );
}