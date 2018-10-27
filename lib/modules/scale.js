export default shower => {
    const { container } = shower;
    const onResize = () => {
        const maxRatio = Math.max(
            container.offsetWidth / window.innerWidth,
            container.offsetHeight / window.innerHeight,
        );

        container.style.transform = `scale(${1 / maxRatio})`;
    };

    shower.addEventListener('modechange', () => {
        if (shower.isFullMode) {
            window.addEventListener('resize', onResize);
            onResize();
        } else {
            window.removeEventListener('resize', onResize);
            container.style.transform = 'none';
        }
    });
};
