import React, { Component } from 'react';

const BANNER_AD_SLOT = process.env.NEXT_PUBLIC_BANNER_AD_SLOT;
const SQUARE_AD_SLOT = process.env.NEXT_PUBLIC_SQUARE_AD_SLOT;
const VERITCAL_AD_SLOT = process.env.NEXT_PUBLIC_VERTICAL_AD_SLOT;

export default class GoogleAd extends Component {
    constructor(props) {
        super(props);
        if (props.type === 'square') this.slot = SQUARE_AD_SLOT;
        else if (props.type === 'vertical') this.slot = VERITCAL_AD_SLOT;
        else this.slot = BANNER_AD_SLOT;
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
