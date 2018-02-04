export default shower => {
    const { player } = shower;
    const findSlideByHash = () => {
        const id = location.hash.slice(1);
        return player.slides.find(slide => slide.id === id);
    };

    player.addEventListener('slidechange', () => {
        location.hash = player.currentSlide.id;
    });

    const onHashChange = () => {
        const slide = findSlideByHash();
        if (slide) {
            slide.activate();
        } else if (!player.currentSlide) {
            if (shower.isFullMode || location.hash) {
                player.first();
            }
        }
    };

    window.addEventListener('hashchange', onHashChange);
    onHashChange();
};
