import React from 'react';
import styled from '@emotion/styled';
import { Container } from '@styles/styled';
import { COLOURS, FONTS } from '@constants/variables';
import NextLink from 'next/link';

export default function NavigationBar() {
    return (
        <Nav>
            <Container>
                <Link href="/">Home</Link>
                <Link href="/cases">Cases</Link>
                <Link href="/vaccinations">Vaccinations</Link>
            </Container>
        </Nav>
    );
}

const Nav = styled.nav`
    height: 75px;
    width: 100%;
    background-color: ${COLOURS.DARK_GREY};
    font-family: ${FONTS.SANS_SERIF};

    div {
        a {
            height: 75%;
            width: 100%;
            margin: 4.5px 0;
            float: left;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            background-color: ${COLOURS.DARK_GREY};
            font-weight: ${FONTS.BOLD};
            color: ${COLOURS.WHITE};
            transition: 0.3s ease-in-out;
        }

        a:hover {
            background-color: ${COLOURS.GREY};
            transition: 0.3s ease-in-out;
        }

        a:active active {
            background-color: ${COLOURS.GREY};
            transition: 0.3s ease-in-out;
        }
    }
`;

const Link = styled(NextLink)`
    height: 75%;
    width: 100%;
    margin: 4.5px 0;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: ${COLOURS.DARK_GREY};
    color: ${COLOURS.WHITE};
    transition: 0.3s ease-in-out;

    &:hover {
        background-color: ${COLOURS.GREY};
        transition: 0.3s ease-in-out;
    }

    &.active {
        background-color: ${COLOURS.GREY};
        transition: 0.3s ease-in-out;
    }
`;
