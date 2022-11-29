import React, { useState } from 'react'
import axios from 'axios'
import LoginPage from './Login'
import AdminPage from './Admin'
import BuyerPage from './Buyer'
import SellerPage from './Seller'

function App() {

  const [isLogin, setIsLogin] = useState(false)
  const [userFlag, setuserFlag] = useState(-1)

  const checkIfLogin = async (e) => {
    try {
      const res = await axios.get(
        "/api/session",
      )
      if(res.status === 200) {
        setuserFlag(res.data.usertype)
        setIsLogin(true)
      }
    }
    catch (err) {
      console.log(err)
      setIsLogin(false)
    }
  }

  checkIfLogin()

  if (isLogin) {
    if(userFlag === 'b') return(<BuyerPage></BuyerPage>)
    else if(userFlag === 's') return(<SellerPage></SellerPage>)
    else if(userFlag === 'a') return(<AdminPage></AdminPage>)
    else return(<div>ERROR</div>)
  }
  else {
    return (
      <LoginPage></LoginPage>
    )
  }
}

export default App