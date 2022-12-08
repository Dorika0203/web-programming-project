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
        pimage: undefined, // for image code in DB
        pcode: '' // for modification
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
        if (!data.pimage) {
            alert('이미지를 올려주세요')
            return
        }

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value])=> {
                formData.append(key, value)
            })
            // for (var pair of formData.entries()) {
            //     console.log(pair[0] + ", " + pair[1])
            // }
            if (props.flag === 1){
                console.log("SEND BEFORE")

                axios.post('/api/seller/create', formData, {headers: {"Content-Type": "multipart/form-data",}}).then(
                    window.location.reload()
                )
            }
            else if (props.flag === 2) {
                axios.post('/api/seller/modify', formData, {headers: {"Content-Type": "multipart/form-data",}}).then(
                    window.location.reload()
                )
            }
            else {
                alert("ERROR")
                window.location.reload()
            }
        }

        catch (err) {
            console.log(err)
            if (err.response.status === 500) {
                alert('SERVER INTERNAL ERROR')
            }
            else if (err.response.status === 400) {
                alert(err.response.data.message)
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
                    setData({...data, pimage:e.target.files[0]})
                }}></input><br></br>
            </form>
            <button onClick={handleSubmit}>제출</button>
            <button onClick={() => { props.setFlag(0) }}>close</button>
        </Modal>
    )
}

export default SellerUpdate