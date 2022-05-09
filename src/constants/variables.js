export const COLOURS = {
    BLUE: '#007BFF',
    INDIGO: '#6610F2',
    PURPLE: '#6F42C1',
    PINK: '#E83E8C',
    RED: '#DC3545',
    ORANGE: '#FD7E14',
    YELLOW: '#FFC107',
    GREEN: '#28A745',
    TEAL: '#20C997',
    CYAN: '#17A2B8',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    LIGHT_GREY: '#F0F0F0',
    GREY: '#6C757D',
    DARK_GREY: '#343A40',
    PRIMARY: '#007BFF',
    SECONDARY: '#6C757D',
    SUCCESS: '#28A745',
    INFO: '#17A2B8',
    WARNING: '#FFC107',
    DANGER: '#DC3545',
    LIGHT: '#F8F9FA',
    DARK: '#343A40',

    addAlpha: function (hex, alpha) {
        const rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${rgb},${alpha})`;
    },

    striped: function (hex1, hex2) {
        return `repeating-linear-gradient(
            -45deg,
            ${hex1},
            ${hex1} 100px,
            ${hex2} 100px, 
            ${hex2} 200px
        );`;
    },
};

export const FONTS = {
    SANS_SERIF: "'Baloo 2', Helvetica, sans-serif",

    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,

    XXS: '0.8rem',
    XS: '1.2rem',
    SM: '1.4rem',
    MD: '1.8rem',
    LG: '2rem',
    XL: '2.2rem',
    XXL: '2.4rem',

    H1: '3.6rem',
    H2: '3.2rem',
    H3: '2.8rem',
    H4: '2.2rem',
    H5: '1.8rem',
    H6: '1.6rem',
};

export const SIZES = {
    MOBILE_WIDTH: '768px',
    MAX_MOBILE_WIDTH: '956px',
};
