import React from 'react';
import styled from '@emotion/styled';
import { Container } from '@styles/styled';
import { COLOURS, FONTS, SIZES } from '@constants/variables';

export default function Handler({ data }) {
    const totalBoard = data.vaccinations.by.board.find(b => b.id === -1);
    const first = totalBoard.partiallyPercent;
    const second = totalBoard.fullyPercent;
    const change = data.cases.current.increase;

    return <Header>
        <Container>
            <Branding href='/'>
                <img
                    alt="COVID in NZ logo banner"
                    style={{ width: '33%' }}
                    src='/images/banner_black.png' />
            </Branding>

            <Statistics>
                <Item>
                    <span>{first}%</span>
                    <span>Vaccinated<br />(first dose, 5+)</span>
                </Item>
                <Item>
                    <span>{second}%</span>
                    <span>Vaccinated<br />(second dose, 5+)</span>
                </Item>
                <Item>
                    <span>{change}</span>
                    <span>New cases<br />(past 24 hours)</span>
                </Item>
            </Statistics>
        </Container>
    </Header>
}

const Header = styled.header`
    overflow: hidden;
    padding: 20px 0;
    background-color: ${COLOURS.YELLOW};
    background: ${COLOURS.striped(COLOURS.YELLOW, COLOURS.WHITE)};
    font-family: ${FONTS.SANS_SERIF};
`;

const Branding = styled.a`
    @media (max-width: ${SIZES.MOBILE_WIDTH}) {
        display: none;
    }
`;

const Statistics = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    text-align: center;

    @media (max-width: ${SIZES.MOBILE_WIDTH}) {
        margin-right: auto;
    }
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px;

    span:first-child {
        margin: 0;
        font-size: ${FONTS.XXL};
        font-weight: ${FONTS.BOLD};
        color: ${COLOURS.BLACK};
    }

    span:last-child {
        margin: 0;
        font-size: ${FONTS.XXS};
        color: ${COLOURS.BLACK};
    }
`;
