import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import './Login.css'

function FrontPage() {

  const [modalF, setModalF] = useState(false)

  function openModal() {
    setModalF(true)
  }

  function afterOpenModal() {
    console.log('after')
  }

  function closeModal() {
    setModalF(false)
  }



  return (
    <div className='front-page'>
      <div className="log-form">
        <h2>Login to your account</h2>
        <form>
          <input type="text" title="username" placeholder="username" />
          <input type="password" title="username" placeholder="password" />
          <button type="submit" className="btn" onClick={(event) => {
            openModal()
          }}>Login</button>
          <div className='linkbox'>
            <a className="forgot_signup" href="##">Forgot Password?</a><br></br>
            <a className="forgot_signup" href="#">No Account?</a>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalF}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
      >
        <div>THIS IS TEST MODAL</div>
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  )
}

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api")
      .then(
        response => response.json()
      )
      .then(
        data => {
          setBackendData(data)
        }
      )
  }, [])

  // console.log(backendData)
  return (
    <FrontPage></FrontPage>
    // <div>App</div>
  )
}

export default App