import * as React from 'react';
import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Button } from '@mui/material';
import LogoutButton from '../Common/LogoutButton';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(0),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    border: '1px solid',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(0)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function SearchBar2(props) {

    const [keywordName, setKeywordName] = useState("")
    const [keywordSeller, setKeywordSeller] = useState("")
    const [keywordPriceLow, setKeyWordPriceLow] = useState(-Infinity)
    const [keywordPriceHigh, setKeyWordPriceHigh] = useState(Infinity)

    const handleButton = async (e) => {
        e.preventDefault()
        if (keywordName.length === 1 || keywordName.length > 10) alert('2글자 이상 10글자 이하')
        else if (keywordSeller.length === 1 || keywordSeller.length > 4) alert('판매자 아이디 1글자 이상 4글자 이하')
        if(false) {}
        else {
            let high = Infinity
            let low = -Infinity
            if(!typeof(keywordPriceHigh) === 'string' || !(keywordPriceHigh.length === 0)) high = keywordPriceHigh
            if(!typeof(keywordPriceLow) === 'string' || !(keywordPriceLow.length === 0)) low = keywordPriceLow
            props.setKeyword({
                kName: keywordName,
                kSeller: keywordSeller,
                kPriceRange: [low, high]
            })
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        {props.usage}
                    </Typography>
                    <Search>
                        <StyledInputBase
                            placeholder="상품 이름"
                            inputProps={{ 'aria-label': 'search' }}
                            defaultValue={''}
                            onChange={(e) => {
                                setKeywordName(e.target.value)
                            }}
                        />
                        <StyledInputBase
                            placeholder="판매자 ID"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => {
                                setKeywordSeller(e.target.value)
                            }}
                        />
                        <StyledInputBase
                            placeholder="가격하한(원)"
                            inputProps={{ 'aria-label': 'search' }}
                            type='number'
                            min={0}
                            maw={100000000}
                            onChange={(e) => {
                                setKeyWordPriceLow(e.target.value)
                            }}
                        />
                        <StyledInputBase
                            placeholder="가격상한"
                            inputProps={{ 'aria-label': 'search' }}
                            type='number'
                            min={0}
                            maw={100000000}
                            onChange={(e) => {
                                setKeyWordPriceHigh(e.target.value)
                            }}
                        />
                    </Search>
                    <Button variant='contained' color='secondary' onClick={handleButton}>검색</Button>
                    <LogoutButton></LogoutButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}