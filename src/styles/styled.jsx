import React from 'react';
import styled from '@emotion/styled';
import { HiOutlineArrowsExpand, HiLink } from 'react-icons/hi';
import { COLOURS, FONTS, SIZES } from '@constants/variables';

export function Title({ title, subtitle, url, id }) {
    const link = url ? url.startsWith('http') ?
        <a href={url} target='_blank'> <HiLink /></a> :
        <a href={url}> <HiOutlineArrowsExpand /></a> : null;
    return <>
        {title ? <h1>{title}{link}</h1> : null}
        {subtitle ? <h2>{subtitle}</h2> : null}
    </>
}

export const Page = styled.div`
    height: 100%;
    max-width: 100%;
    background: ${COLOURS.GREY};
    font-family: ${FONTS.SANS_SERIF};
`;

export const Content = styled.div`
    height: 100;
    max-width: 960px;
    margin: auto;
    padding: 0;
    align-items: center;
    background: ${COLOURS.DARK_GREY};
`;

export const Container = styled.div`
    height: 100%;
    max-width: 960px;
    margin: auto;
    display: flex;
    align-items: center;
    vertical-align: middle;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    
    @media (max-width: ${SIZES.MOBILE_WIDTH}) {
        flex-direction: column;
    }
`;

export const Item = styled.div`
    display: flex;
    flex-direction: column;
    font-family: ${FONTS.SANS_SERIF};
    padding: 5%;
    width: 90%;
    color: ${COLOURS.WHITE};
    width: fill-content;
    
    h1 {
        font-weight: ${FONTS.SEMI_BOLD};
        font-size: ${FONTS.XXL};
        margin: 16px 0 0 0;
    }

    h2 {
        font-size: ${FONTS.XS};
        margin: 0;
        margin-bottom: 8px;
    }

    caption {
        margin: 0;
        margin-top: 8px;
        display: block;
        text-align: right;
        font-size: ${FONTS.XXS};
        color: ${COLOURS.WHITE};
    
        a {
            color: ${COLOURS.TEAL};
        }
    }

    @media (max-width: ${SIZES.MOBILE_WIDTH}) {
        width: auto;
    }
`;

export const Link = styled.a`
    color: ${COLOURS.TEAL};
    transition: 0.3s ease-in-out;

    &:hover {
        color: ${COLOURS.WHITE};
        transition: 0.3s ease-in-out;
    }

    * {
        vertical-align: middle;
    }
`;