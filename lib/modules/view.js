export default shower => {
    const { container } = shower;
    const { fullModeClass, listModeClass } = shower.options;

    const scrollIntoView = () => {
        const slide = shower.activeSlide;
        if (!slide) return;

        slide.element.scrollIntoView({
            block: 'nearest',
        });
    };

    shower.addEventListener('modechange', () => {
        if (shower.isFullMode) {
            container.classList.add(fullModeClass);
            container.classList.remove(listModeClass);
        } else {
            container.classList.add(listModeClass);
            container.classList.remove(fullModeClass);

            scrollIntoView();
        }
    });

    shower.addEventListener('slidechange', scrollIntoView);
};
