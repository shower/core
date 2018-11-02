export default shower => {
    const { container } = shower;
    const updateScale = () => {
        const maxRatio = Math.max(
            container.offsetWidth / window.innerWidth,
            container.offsetHeight / window.innerHeight,
        );

        container.style.transform = `scale(${1 / maxRatio})`;
    };

    shower.addEventListener('modechange', () => {
        if (shower.isFullMode) {
            window.addEventListener('resize', updateScale);
        } else {
            window.removeEventListener('resize', updateScale);
            container.style.transform = '';
        }
    });

    window.addEventListener('load', () => {
        if (shower.isFullMode) {
            updateScale();
        }
    });
};
