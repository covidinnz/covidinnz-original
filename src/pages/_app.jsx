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
    const [message, setMessage] = useState('Loading...');

    const [cases, setCases] = useState(null);
    const [vaccinations, setVaccinations] = useState(null);
    const [situation, setSituation] = useState(null);
    const [tracer, setTracer] = useState(null);

    const get = (url) =>
        fetch(url)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.success === true) return json.data;
                else throw new Error(json.error.message);
            });

    const fetchData = async () => {
        try {
            await get('/api/v1/cases').then((c) => setCases((s) => ({ ...s, ...c })));
            await get('/api/v1/cases/by/all').then((ca) => setCases((s) => ({ ...s, by: ca })));
            await get('/api/v1/vaccinations').then((v) => setVaccinations((s) => ({ ...s, ...v })));
            await get('/api/v1/vaccinations/by/all').then((va) => setVaccinations((s) => ({ ...s, by: va })));
            await get('/api/v1/situation').then((t) => setSituation((s) => ({ ...s, ...t })));
            await get('/api/v1/tracer/7').then((t) => setTracer((s) => ({ ...s, ...t })));
            setMessage('');
        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
    };

    useEffect(() => {
        const scroll = () => window.scrollTo(0, 0);
        Router.events.on('routeChangeComplete', scroll);
        fetchData();
        return () => setMessage('Failed');
    }, []);

    return (
        <>
            <Head>
                <title>COVID in New Zealand</title>
                <link rel="shortcut icon" href="/images/logo_yellow.png" />
            </Head>

            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722227635911083"
                crossorigin="anonymous"
            />

            {message !== '' ? (
                <>{message}</>
            ) : (
                <>
                    <Header data={{ cases, vaccinations }} />
                    <NavigationBar />
                    <Page>
                        <Content style={{ minHeight: '100vh' }}>
                            <Component {...pageProps} data={{ cases, vaccinations, situation, tracer }} />
                        </Content>
                    </Page>
                    <Footer />
                </>
            )}
        </>
    );
}
