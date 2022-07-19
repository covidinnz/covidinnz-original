import React from 'react';
import Table from '@components/Table';
import GoogleAd, { AdUnit } from '@components/GoogleAd';
import { Page, Content, Item } from '@styles/styled';
import { toNewZealandTime } from '@functions/parseDate';
import { stringifyProperties } from '@functions/formatValue';

export default function Vaccinations({ data }) {
    return (
        <Page>
            <Content>
                <Item>
                    <h1>Vaccinations (5+)</h1>
                    <h2>Nationwide vaccinations by health board</h2>
                    <Table
                        type="top"
                        headers={[
                            { field: 'board', headerName: 'District', type: 'string', sortable: true },
                            { field: 'population', headerName: 'Population', type: 'number', flex: 1, sortable: true },
                            { field: 'partially', headerName: 'Partically', type: 'number', flex: 1, sortable: true },
                            { field: 'fully', headerName: 'Fully', type: 'number', flex: 1, sortable: true },
                        ]}
                        cells={stringifyProperties(data.vaccinations.by.board).map((b) => ({
                            ...b,
                            partially: `${b.partially} (${b.partiallyPercent}%)`,
                            fully: `${b.fully} (${b.fullyPercent}%)`,
                        }))}
                    />
                    <caption>This data is as of {toNewZealandTime(data.vaccinations.updatedAt)}</caption>
                </Item>

                <GoogleAd slot={AdUnit.GraphDivider} />

                <Item>
                    <h1>Demographics (5+)</h1>
                    <h2>Vaccinations by ethnicity</h2>
                    <Table
                        type="top"
                        headers={[
                            { field: 'ethnicity', headerName: 'Ethnicity', type: 'string', sortable: true },
                            { field: 'partially', headerName: 'First Dose', type: 'number', flex: 1, sortable: true },
                            { field: 'fully', headerName: 'Second Dose', type: 'number', flex: 1, sortable: true },
                            { field: 'booster', headerName: 'Booster Shot', type: 'number', flex: 1, sortable: true },
                        ]}
                        cells={stringifyProperties(data.vaccinations.by.ethnicity).filter((e) => e.id !== '-1')}
                    />
                    <caption>
                        This data is as of {toNewZealandTime(data.vaccinations.updatedAt)}
                        <br />
                        Booster shots are only available to those 18 and over
                    </caption>
                </Item>
            </Content>
        </Page>
    );
}
