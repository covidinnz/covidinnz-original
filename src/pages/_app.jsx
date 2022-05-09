import '@styles/index.css';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Router from 'next/router';
import Header from '@components/Header';
import NavigationBar from '@components/NavigationBar';
import Footer from '@components/Footer';
import { Page, Content } from '@styles/styled';

export default function _App({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);
    const [cases, setCases] = useState(null);
    const [vaccinations, setVaccinations] = useState(null);
    const [situation, setSituation] = useState(null);
    const [tracer, setTracer] = useState(null);

    const fetchData = async () => {
        const get = uri => fetch(uri)
            .then(res => res.json())
            .then(json => json.data);
        return Promise.all([
            get('/api/v1/cases').then(c => setCases(s => ({ ...s, ...c }))),
            get('/api/v1/cases/by/all').then(ca => setCases(s => ({ ...s, by: ca }))),
            get('/api/v1/vaccinations').then(v => setVaccinations(s => ({ ...s, ...v }))),
            get('/api/v1/vaccinations/by/all').then(va => setVaccinations(s => ({ ...s, by: va }))),
            get('/api/v1/situation').then(t => setSituation(s => ({ ...s, ...t }))),
            get('/api/v1/tracer/7').then(t => setTracer(s => ({ ...s, ...t })))
        ]);
    }

    useEffect(() => {
        const scroll = () => window.scrollTo(0, 0);
        Router.events.on('routeChangeComplete', scroll);
        fetchData().then(() => setIsLoading(false));
    }, []);

    return <>
        <Head>
            <title>COVID in New Zealand</title>
            <link rel='shortcut icon' href='/images/logo_yellow.png' />
        </Head>
        
        <Script data-ad-client='ca-pub-5722227635911083' async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' />
        
        {isLoading
            ? <h1>Loading...</h1>
            : <>
                <Header data={{ cases, vaccinations }} />
                <NavigationBar />
                <Page>
                    <Content style={{ minHeight: '100vh' }}>
                        <Component {...pageProps} data={{ cases, vaccinations, situation, tracer }} />
                    </Content>
                </Page>
                <Footer />
            </>}
    </>
}
