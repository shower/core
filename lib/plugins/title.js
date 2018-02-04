const mdash = '\u2014';

export default shower => {
    const { player } = shower;
    const { title } = document;

    const updateTitle = () => {
        if (shower.isFullMode) {
            const slide = player.currentSlide;
            const slideTitle = slide.title;
            if (slideTitle) {
                document.title = `${slideTitle} ${mdash} ${title}`;
                return;
            }
        }

        document.title = title;
    };

    shower.addEventListener('modechange', updateTitle);
    player.addEventListener('slidechange', updateTitle);
};
