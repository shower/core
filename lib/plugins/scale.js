export default shower => {
    const { container } = shower;
    const resizeObserver = new ResizeObserver(entries => {
        const [ entry ] = entries;
        const { width, height } = entry.contentRect;
        const maxRatio = Math.max(
            container.clientWidth / width,
            container.clientHeight / height,
        );

        container.style.transform = `scale(${1 / maxRatio})`;
    });

    shower.addEventListener('modechange', () => {
        if (shower.isFullMode) {
            resizeObserver.observe(container.parentElement);
        } else {
            container.style.transform = 'none';
            resizeObserver.disconnect();
        }
    });
};
