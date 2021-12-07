module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'purple-1000': '#21074b',
            },
        },
        fontFamily: {
            sans: ['Lato', 'sans-serif'],
            heading: ['Oswald', 'sans-serif'],
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
