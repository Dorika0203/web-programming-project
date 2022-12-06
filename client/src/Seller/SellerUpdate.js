import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'

function SellerUpdate(props) {


    const [data, setData] = useState({
        name: '',
        price: '',
        place: '',
        ptype: '',
        ptext: '',
        ptextdetail: '',
        pimage: '',
        pcode: ''
    })

    const name_place_ptext_Regex = new RegExp(
        '^[a-zA-Z0-9._:$!%-]{4,50}$'
    )
    const ptype_Regex = new RegExp(
        '^[FB]$'
    )
    const ptext_detail_Regex = new RegExp(
        '^[a-zA-Z0-9._:$!%-]{0,200}$'
    )

    const handleChange = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const handleSubmit = async (e) => {
        if (
            !name_place_ptext_Regex.test(data.name) ||
            !name_place_ptext_Regex.test(data.ptext) ||
            !name_place_ptext_Regex.test(data.place)) {
            alert('상품이름, 상품 간단 설명, 상품 거래장소는 4글자 이상 50글자 이하로')
            return
        }
        if (!ptype_Regex.test(data.ptype)) {
            alert('상품 타입은 F(고정) or B(경매)')
            return
        }
        if (!ptext_detail_Regex.test(data.ptextdetail)) {
            alert('상세 설명은 200자 미만으로')
            return
        }
        if (data.price < 0 || data.price > 100000000) {
            alert('가격은 0원 이상 1억 미만')
            return
        }
        console.log(data)
        try {
            let res = undefined
            const sendingForm = data.pimage
            console.log(typeof(sendingForm))
            Object.keys(data).forEach(key => {
                console.log(key, data[key])
            });

            if (props.flag === 2) {
                res = await axios.post(
                    "/api/seller/modify",
                    data,
                    // {
                    //     headers: {
                    //         "Content-Type": "multipart/form-data"
                    //     }
                    // }
                )
            }
            else if (props.flag === 1){
                res = await axios.post(
                    "/api/seller/create",
                    data,
                    // {
                    //     headers: {
                    //         "Content-Type": "multipart/form-data"
                    //     }
                    // }
                )
            }
            else {
                alert("ERROR")
                return
            }
            if (res.status === 200) {
                props.setFlag(false)
                alert('생성 or 수정 성공')
                return
            }
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('SERVER INTERNAL ERROR')
                return
            }
            if (err.response.status === 400) {
                alert(err.response.data.message)
                return
            }
        }
    }


    useEffect(() => {
        setData(props.default)
    }, [props.default])

    return (
        <Modal
            isOpen={props.flag === 0 ? false : true}
            ariaHideApp={false}>

            <form>
                <input type="text" name='name' placeholder="상품 이름 4~50글자" onChange={(e) => handleChange('name', e.target.value)} defaultValue={props.default.name} /><br></br>
                <input type="number" name='price' placeholder="가격 0원이상 1억미만" onChange={(e) => handleChange('price', e.target.value)} defaultValue={props.default.price} /><br></br>
                <input type="text" name='place' placeholder="거래 장소 4~50글자" onChange={(e) => handleChange('place', e.target.value)} defaultValue={props.default.place} /><br></br>
                <input type="text" name='ptext' placeholder="간단 설명 4~50글자" onChange={(e) => handleChange('ptext', e.target.value)} defaultValue={props.default.ptext} /><br></br>
                <input type="text" name='ptextdetail' placeholder="상세 설명 0~200글자" onChange={(e) => handleChange('ptextdetail', e.target.value)} defaultValue={props.default.ptextdetail} /><br></br>
                <select name='text' onChange={(e) => handleChange('ptype', e.target.value)} defaultValue={props.default.ptype}>
                    <option value={'F'}>고정</option>
                    <option value={'B'}>경매</option>
                </select><br></br>
                <input type='file' accept='image/jpg,image/png,image/jpeg' name='image' onChange={(e) => {
                    const img = new FormData()
                    img.append('pimage', e.target.files[0])
                    handleChange('pimage', img)
                }}></input><br></br>
            </form>
            <button onClick={handleSubmit}>제출</button>
            <button onClick={() => { props.setFlag(0) }}>close</button>
        </Modal>
    )
}

export default SellerUpdate