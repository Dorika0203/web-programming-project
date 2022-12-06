import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LoginPage from './Common/Login'
import AdminPage from './Admin/Admin'
import BuyerPage from './Buyer/Buyer'
import SellerPage from './Seller/Seller'

function App() {

  const [isLogin, setIsLogin] = useState(false)
  const [userFlag, setuserFlag] = useState(-1)

  const checkIfLogin = async (e) => {
    try {
      const res = await axios.get(
        "/api/session",
      )
      if (res.status === 200) {
        setuserFlag(res.data.usertype)
        setIsLogin(true)
      }
    }
    catch (err) {
      console.log(err)
      setIsLogin(false)
    }
  }

  useEffect(() => {
    checkIfLogin()
  }, [])

  if (isLogin) {
    if (userFlag === 'B') return (<BuyerPage setLogin={setIsLogin}></BuyerPage>)
    else if (userFlag === 'S') return (<SellerPage setLogin={setIsLogin}></SellerPage>)
    else if (userFlag === 'R') return (<AdminPage setLogin={setIsLogin}></AdminPage>)
    else return (<div>ERROR</div>)
  }
  else {
    return (
      <LoginPage></LoginPage>
    )
  }
}

export default App