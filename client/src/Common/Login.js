import React, { useState } from 'react'
import Signup from './Signup'
import './Login.css'
import axios from 'axios'

function LoginPage() {

    const [signupFlag, setSignupFlag] = useState(false)

    function setFlagTo(val) {
        setSignupFlag(val)
    }

    const [data, setData] = useState({
        id: '',
        pw: '',
    })

    const id_pw_Regex = new RegExp(
        '^[a-zA-Z0-9._:$!%-]{1,4}$'
    )

    const handleChange = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!id_pw_Regex.test(data.id)) {
            alert('아디 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
            return
        }
        if (!id_pw_Regex.test(data.pw)) {
            alert('비번 규격 안맞음. 1글자 이상 4글자 이하의 알파벳 or 숫자 or ._:$!%-')
            return
        }

        try {
            const res = await axios.post(
                "/api/login",
                data,
            )
            if(res.status === 200) alert('로그인 성공.')
        }
        catch (err) {
            if (err.response.status === 500) {
                alert('SERVER INTERNAL ERROR')
            }
            else if (err.response.status === 400) {
                alert(err.response.data.message)
            }
        }
        window.location.reload()
    }

    return (
        <div className='front-page'>
            <Signup flag={signupFlag} setFlag={setFlagTo}></Signup>
            <div className="log-form">
                <h2>Login to your account</h2>
                <form>
                    <input type="text" placeholder="username" onChange={(e) => { handleChange('id', e.target.value) }} />
                    <input type="password" placeholder="password" onChange={(e) => { handleChange('pw', e.target.value) }} />
                    <button className="btn" onClick={handleSubmit}>Login</button>
                    <div className='linkbox'>
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

export default LoginPage;