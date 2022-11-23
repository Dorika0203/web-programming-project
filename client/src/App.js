import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import './Login.css'


function Signup(props) {

  const [data, setData] = useState({
    id: '',
    pw: '',
    pwcheck: '',
    email: '',
    phone: ''
  })

  const id_pw_Regex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]{1,4}$'
  )
  const emailRegex = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
  )
  const phoneRegex = new RegExp(
    '^01[01]-[0-9]{4,4}-[0-9]{4,4}$'
  )

  const handleChange = (key, value) => {
    setData({...data, [key]:value})
  }

  const handleSubmit = async (e) => {

    if(data.pw !== data.pwcheck) {
      alert("패스워드가 일치하지 않습니다.")
      return
    }

    if(!id_pw_Regex.test(data.id)) {
      alert('아디 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
      return
    }
    if(!id_pw_Regex.test(data.pw)) {
      alert('비번 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
      return
    }
    if(!emailRegex.test(data.email) || data.email.length > 30) {
      alert('이메일 규격 안맞음 or 30글자 이상이라 너무 김')
      return
    }
    if(!phoneRegex.test(data.phone)) {
      alert('전화번호 규격 안맞음. 010-1234-1234 또는 011번호로')
      return
    }

    const res = await axios.post(
      "/api/signup",
      data,
    )
    console.log(res)
  }


  return (
    <Modal
      isOpen={props.flag}
      ariaHideApp={false}>
      
      <form>
        <input type="text" name='id' placeholder="username" onChange={(e) => handleChange('id', e.target.value)} /><br></br>
        <input type="password" name='pw' placeholder="password" onChange={(e) => handleChange('pw', e.target.value)}/><br></br>
        <input type="password" name='pwcheck' placeholder="password" onChange={(e) => handleChange('pwcheck', e.target.value)}/><br></br>
        <input type="email" name='email' placeholder="qwer@asdf.com" onChange={(e) => handleChange('email', e.target.value)}/><br></br>
        <input type="phone" name='phone' placeholder="010-5618-5623" onChange={(e) => handleChange('phone', e.target.value)}/><br></br>
      </form>
      <button onClick={handleSubmit}>제출</button>
      <button onClick={() => { props.setFlag(false) }}>close</button>
    </Modal>
  )
}


function FrontPage() {

  const [signupFlag, setSignupFlag] = useState(false)

  function setFlagTo(val) {
    setSignupFlag(val)
  }

  return (
    <div className='front-page'>
      <Signup flag={signupFlag} setFlag={setFlagTo}></Signup>
      <div className="log-form">
        <h2>Login to your account</h2>
        <form>
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <button type="submit" className="btn">Login</button>
          <div className='linkbox'>
            <a className="forgot_signup">Forgot Password?</a><br></br>
            <a className="forgot_signup" onClick={() => {
              setSignupFlag(true)
              return false
            }}>No Account?</a>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {

  return (
    <FrontPage></FrontPage>
  )
}

export default App