import React from 'react';
import Table from '@components/Table';
import GoogleAd from '@components/GoogleAd';
import { Page, Content, Column, Row, Item } from '@styles/styled';
import { toNewZealandTime } from '@functions/parseDate';
import { stringifyProperties } from '@functions/formatValue';

export default function Cases({ data }) {
    return <Page>
        <Content>
            <Column>
                <Item>
                    <h1>Cases</h1>
                    <h2>Nationwide cases by health board</h2>
                    <Table
                        type='top'
                        headers={[
                            { field: 'board', headerName: 'District', type: 'string', sortable: true },
                            { field: 'active', headerName: 'Active (+New)', type: 'number', flex: 1, sortable: true },
                            { field: 'recovered', headerName: 'Recovered', type: 'number', flex: 1, sortable: true },
                            { field: 'deceased', headerName: 'Deceased', type: 'number', flex: 1, sortable: true },
                            { field: 'total', headerName: 'Total', type: 'number', flex: 1, sortable: true },
                        ]}
                        cells={stringifyProperties(data.cases.by.board)
                            .map(b => ({ ...b, active: b.increase > 0 ? `${b.active} (+${b.increase})` : b.active }))
                            .filter(b => b.id !== '-1')}
                    />
                    <caption>This data is as of {toNewZealandTime(data.cases.updatedAt)}</caption>
                </Item>

                <Row>
                    <Item>
                        <h1>Demographics</h1>
                        <h2>Cases by age group</h2>
                        <Table
                            type='top'
                            headers={[
                                { field: 'age', headerName: 'Group', type: 'string', sortable: true },
                                { field: 'active', headerName: 'Active', type: 'number', flex: 1, sortable: true },
                                { field: 'recovered', headerName: 'Recovered', type: 'number', flex: 1, sortable: true },
                                { field: 'deceased', headerName: 'Deceased', type: 'number', flex: 1, sortable: true },
                                { field: 'total', headerName: 'Total', type: 'number', flex: 1, sortable: true },
                            ]}
                            cells={stringifyProperties(data.cases.by.age)
                                .filter(a => a.id !== '-1')}
                        />
                        <caption>This data is as of {toNewZealandTime(data.cases.updatedAt)}</caption>

                        <h2>Cases by ethnicity</h2>
                        <Table
                            type='top'
                            headers={[
                                { field: 'ethnicity', headerName: 'Ethnicity', type: 'string', sortable: true },
                                { field: 'active', headerName: 'Active', type: 'number', flex: 1, sortable: true },
                                { field: 'recovered', headerName: 'Recovered', type: 'number', flex: 1, sortable: true },
                                { field: 'deceased', headerName: 'Deceased', type: 'number', flex: 1, sortable: true },
                                { field: 'total', headerName: 'Total', type: 'number', flex: 1, sortable: true },
                            ]}
                            cells={stringifyProperties(data.cases.by.ethnicity)
                                .filter(e => e.id !== '-1')}
                        />
                        <caption>This data is as of {toNewZealandTime(data.cases.updatedAt)}</caption>

                        <h2>Cases by gender</h2>
                        <Table
                            type='top'
                            headers={[
                                { field: 'gender', headerName: 'Gender', type: 'string', sortable: true },
                                { field: 'active', headerName: 'Active', type: 'number', flex: 1, sortable: true },
                                { field: 'recovered', headerName: 'Recovered', type: 'number', flex: 1, sortable: true },
                                { field: 'deceased', headerName: 'Deceased', type: 'number', flex: 1, sortable: true },
                                { field: 'total', headerName: 'Total', type: 'number', flex: 1, sortable: true },
                            ]}
                            cells={stringifyProperties(data.cases.by.gender)
                                .filter(g => g.id !== '-1')}
                        />
                    </Item>

                    <GoogleAd type='vertical' />
                </Row>
            </Column>
        </Content>
    </Page>
}
