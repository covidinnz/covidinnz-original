import React, { Component } from 'react';

export const AdUnit = {
    GraphDivider: '1484929993'
}

export default class GoogleAd extends Component {
    constructor(props) {
        super(props);
        this.slot = props.slot;
    }

    componentDidMount() {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
    }

    render() {
        return (
            <ins
                className={`adsbygoogle ${this.props.className}`}
                style={{ display: 'block ' }}
                data-ad-client="ca-pub-5722227635911083"
                data-ad-slot={this.slot}
                data-ad-format="auto"
                data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
                data-full-width-responsive="true"
            />
        );
    }
}
