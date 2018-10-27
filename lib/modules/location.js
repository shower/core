export default shower => {
    const changeMode = () => {
        const url = new URL(location);
        const isFull = url.searchParams.has('full');
        if (isFull) {
            shower.enterFullMode();
        } else {
            shower.enterListMode();
        }
    };

    const findSlideByHash = () => {
        const id = location.hash.slice(1);
        return shower.slides.find(slide => slide.id === id);
    };

    const changeSlide = () => {
        const slide = findSlideByHash();
        if (slide) {
            slide.activate();
        } else if (!shower.currentSlide) {
            if (shower.isFullMode || location.hash) {
                shower.first();
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
        const slide = shower.currentSlide;
        const query = shower.isFullMode ? '?full' : '';

        return slide ? `${query}#${slide.id}` : query;
    };

    shower.addEventListener('modechange', () => {
        history.replaceState(null, document.title, getNewURL());
    });

    shower.addEventListener('slidechange', () => {
        history.pushState(null, document.title, getNewURL());
    });
};
