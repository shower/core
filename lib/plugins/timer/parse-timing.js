export default (timing = '') => {
    const [
        sec,
        min = 0,
    ] = timing.split(':', 2).reverse().map(Number);

    return (sec + min * 60) * 1000;
};
