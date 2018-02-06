export default shower => {
    const { player } = shower;
    const changeMode = () => {
        const url = new URL(location);
        const isFull = url.searchParams.has('full');
        if (isFull) {
            shower.enterFullMode();
        } else {
            shower.exitFullMode();
        }
    };

    const findSlideByHash = () => {
        const id = location.hash.slice(1);
        return player.slides.find(slide => slide.id === id);
    };

    const changeSlide = () => {
        const slide = findSlideByHash();
        if (slide) {
            slide.activate();
        } else if (!player.currentSlide) {
            if (shower.isFullMode || location.hash) {
                player.first();
            }
        }
    };

    const onPopState = () => {
        changeMode();
        changeSlide();
    };

    window.addEventListener('popstate', onPopState);
    onPopState();

    const getNewURL = () => {
        const query = shower.isFullMode ? '?full' : '';
        const slide = player.currentSlide;
        if (!slide) return query;

        return `${query}#${slide.id}`;
    };

    shower.addEventListener('modechange', () => {
        history.replaceState(null, null, getNewURL());
    });

    player.addEventListener('slidechange', () => {
        history.pushState(null, null, getNewURL());
    });
};
