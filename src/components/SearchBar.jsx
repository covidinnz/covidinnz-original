import React, { useRef, useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import { COLOURS } from '@constants/variables';

export default function SearchBar({ onCancel, onChange, onRequestSearch, ...inputProps }) {
    const inputRef = useRef();
    const [value, setValue] = useState(inputProps.value);

    useEffect(() => {
        setValue(inputProps.value);
    }, [inputProps.value]);

    const handleInput = useCallback((e) => setValue(e.target.value) || onChange(e.target.value), [onChange]);
    const handleCancel = useCallback(() => setValue('') || onCancel(), [onCancel]);
    const handleRequestSearch = useCallback(() => onRequestSearch?.(value), [onRequestSearch, value]);

    const handleKeyUp = useCallback(
        (e) => {
            if (e.charCode === 13 || e.key === 'Enter') handleRequestSearch();
            else if (e.charCode === 27 || e.key === 'Escape') handleCancel();
            if (inputProps.onKeyUp) inputProps.onKeyUp(e);
        },
        [handleRequestSearch, handleCancel, inputProps.onKeyUp],
    );

    return (
        <ExtendedPaper>
            <SearchContainer>
                <Input
                    {...inputProps}
                    inputRef={inputRef}
                    value={value}
                    onChange={(event) => handleInput(event)}
                    onKeyUp={(event) => handleKeyUp(event)}
                    fullWidth
                    style={{ width: '100%' }}
                    disableUnderline
                />
            </SearchContainer>

            <ExtendedIconButton onClick={handleRequestSearch} style={{ ...(value ? hidden : {}) }}>
                <SearchIcon />
            </ExtendedIconButton>

            <ExtendedIconButton onClick={handleCancel} style={{ ...(!value ? hidden : {}) }}>
                <ClearIcon />
            </ExtendedIconButton>
        </ExtendedPaper>
    );
}

const ExtendedPaper = styled(Paper)`
    height: 48px;
    display: flex;
    justify-content: space-between;
`;

const SearchContainer = styled.div`
    margin: auto 16px;
    width: 100%;
`;

const ExtendedIconButton = styled(IconButton)`
    color: ${COLOURS.BLACK};
    transform: scale(1, 1);
    transition: color 0.2s ease-in-out;

    &:hover {
        color: ${COLOURS.DARK_GREY};
    }
`;

const hidden = {
    display: 'none',
};
