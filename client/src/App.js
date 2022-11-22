import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import './Login.css'


function Signup(props) {

  return (
      <Modal
          isOpen={props.flag}
          ariaHideApp={false}>
          <div>HELLO MODAL</div>
          <button onClick={props.setFlag(false)}>close</button>
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
          <input type="text" title="username" placeholder="username" />
          <input type="password" title="username" placeholder="password" />
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