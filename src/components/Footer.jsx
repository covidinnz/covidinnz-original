import React from 'react';
import styled from '@emotion/styled';
import { COLOURS, SIZES, FONTS } from '@constants/variables';

export default function _Footer() {
    return (
        <Footer>
            <Container>
                <Item>
                    Join the{' '}
                    <a rel="noreferrer" href="https://discord.gg/vZQbMhwsKY" target="_blank">
                        Discord server
                    </a>
                    .<br />
                    <a rel="noreferrer" href="/docs/index.html" target="_blank">
                        COVID in New Zealand API
                    </a>
                    .<br />
                    Created by{' '}
                    <a href="https://apteryx.xyz/" target="_blank">
                        Apteryx
                    </a>
                    .
                </Item>
                <Item>
                    Data displayed on this site is sourced from the
                    <br />
                    <a rel="noreferrer" href="https://health.govt.nz/" target="_blank">
                        Ministry of Health
                    </a>
                    .
                </Item>
                <Item>
                    Site design and logo
                    <br />© 2021 COVID in New Zealand
                </Item>
            </Container>
        </Footer>
    );
}

const Footer = styled.footer`
    height: max-content;
    width: 100%;
    background-color: ${COLOURS.DARK_GREY};
    font-family: ${FONTS.SANS_SERIF};
`;

const Container = styled.div`
    height: 100%;
    max-width: 960px;
    margin: auto;
    padding: 16px;
    align-items: center;
    text-align: center;
    display: grid;
    grid-auto-flow: column;
    @media (max-width: ${SIZES.MOBILE_WIDTH}) {
        grid-auto-flow: row;
    }
`;

const Item = styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    color: ${COLOURS.WHITE};
    a {
        color: ${COLOURS.TEAL};
    }
`;
