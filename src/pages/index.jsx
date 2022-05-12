import React from 'react';
import Table from '@components/Table';
import Chart from '@components/Chart';
import { Page, Content, Column, Row, Item } from '@styles/styled';
import { COLOURS } from '@constants/variables';
import { toNewZealandTime } from '@functions/parseDate';
import { stringifyProperties } from '@functions/formatValue';

function formatVaccinationChartData(data) {
    const twTotalBoard = data.vaccinations.by.board.find((b) => b.id === -1);
    const population = twTotalBoard.population;
    const partically = twTotalBoard.partially;
    const fully = twTotalBoard.fully;

    return [
        { label: 'Not Vaccinated', value: population - fully, colour: COLOURS.RED },
        { label: 'Partially Vaccinated', value: partically - fully, colour: COLOURS.YELLOW },
        { label: 'Fully Vaccinated', value: fully, colour: COLOURS.GREEN },
    ];
}

function formatCasesChartData(data) {
    const activeCount = data.cases.active;
    const recoveredCount = data.cases.recovered;
    const deceasedCount = data.cases.deceased;

    return [
        { label: 'Active', value: activeCount, colour: COLOURS.YELLOW },
        { label: 'Recovered', value: recoveredCount, colour: COLOURS.GREEN },
        { label: 'Deceased', value: deceasedCount, colour: COLOURS.RED },
    ];
}

export default function Home({ data }) {
    return (
        <Page>
            <Content>
                <Row>
                    <Item>
                        <h1>Summary</h1>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{data.situation.summaryText}</p>
                    </Item>

                    <Item>
                        <h1>Active Cases</h1>
                        <h2>Nationwide status</h2>
                        <Table
                            type="left"
                            headers={[
                                { field: 'increase', headerName: 'New', type: 'number', flex: 1 },
                                { field: 'active', headerName: 'Total Active', type: 'number', flex: 1 },
                                { field: 'fromCommunity', headerName: 'In the Community', type: 'number', flex: 1 },
                                { field: 'fromBorder', headerName: 'At the Border', type: 'number', flex: 1 },
                                {
                                    field: 'underInvestigation',
                                    headerName: 'Under Investigation or Other',
                                    type: 'number',
                                    flex: 1,
                                },
                            ]}
                            cells={[stringifyProperties({ ...data.cases, ...data.cases.current })]}
                        />
                        <caption>This data is as of {toNewZealandTime(data.cases.updatedAt)}</caption>
                    </Item>
                </Row>

                <Row>
                    <Item>
                        <h1>Vaccinations (5+)</h1>
                        <Chart type="doughnut" data={formatVaccinationChartData(data)} />
                        <caption>This data is as of {toNewZealandTime(data.vaccinations.updatedAt)}</caption>
                    </Item>

                    <Item>
                        <h1>All Cases</h1>
                        <Chart type="doughnut" data={formatCasesChartData(data)} />
                        <caption>This data is as of {toNewZealandTime(data.cases.updatedAt)}</caption>
                    </Item>
                </Row>
            </Content>
        </Page>
    );
}
