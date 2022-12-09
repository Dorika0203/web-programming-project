import React, { useState } from 'react'
import Modal from 'react-modal'
import axios from 'axios'

function Signup(props) {

    const [data, setData] = useState({
      id: '',
      pw: '',
      pwcheck: '',
      email: '',
      phone: '',
      name: '',
      usertype: 'B'
    })
  
    const id_pw_name_Regex = new RegExp(
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
      if(!id_pw_name_Regex.test(data.id)) {
        alert('아디 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
        return
      }
      if(!id_pw_name_Regex.test(data.pw)) {
        alert('비번 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
        return
      }
      if(!id_pw_name_Regex.test(data.name)) {
        alert('이름 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
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
      console.log(data)
      try {
        const res = await axios.post(
          "/api/signup",
          data,
        )
        if(res.status === 200) {
            props.setFlag(false)
            alert('회원 가입 성공')
            return
        }
      }
      catch (err) {
        if(err.response.status === 500) {
          alert('SERVER INTERNAL ERROR')
          return
        }
        if(err.response.status === 400) {
          alert(err.response.data.message)
          return
        }
      }
    }
  
  
    return (
      <Modal
        isOpen={props.flag}
        ariaHideApp={false}>
        
        <form>
          <input type="text" name='id' placeholder="id 4글자 이하" onChange={(e) => handleChange('id', e.target.value)} /><br></br>
          <input type="password" name='pw' placeholder="password 4글자 이하" onChange={(e) => handleChange('pw', e.target.value)}/><br></br>
          <input type="password" name='pwcheck' placeholder="password 재입력" onChange={(e) => handleChange('pwcheck', e.target.value)}/><br></br>
          <input type="email" name='email' placeholder="qwer@asdf.com" onChange={(e) => handleChange('email', e.target.value)}/><br></br>
          <input type="phone" name='phone' placeholder="010-5618-5623" onChange={(e) => handleChange('phone', e.target.value)}/><br></br>
          <input type="name" name='name' placeholder="KDY" onChange={(e) => handleChange('name', e.target.value)}/><br></br>
          <select name='usertype' defaultValue={'B'} onChange={(e) => handleChange('usertype', e.target.value)}>
            <option value={'B'}>구매자</option>
            <option value={'S'}>판매자</option>
            </select><br></br>
        </form>
        <button onClick={handleSubmit}>제출</button>
        <button onClick={() => { props.setFlag(false) }}>close</button>
      </Modal>
    )
  }

  export default Signup