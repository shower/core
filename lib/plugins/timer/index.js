import parseTiming from './parse-timing';

export default shower => {
    let id;

    const { player } = shower;
    const setTimer = () => {
        clearTimeout(id);
        if (shower.isListMode) return;

        const slide = player.currentSlide;
        if (slide.state.visited > 1) return;

        const timing = parseTiming(slide.element.dataset.timing);
        if (!timing) return;

        const { innerStepsCount } = slide.state;
        if (innerStepsCount) {
            const stepTiming = timing / (innerStepsCount + 1);
            id = setInterval(() => player.next(), stepTiming);
        } else {
            id = setTimeout(() => player.next(), timing);
        }
    };

    shower.addEventListener('modechange', setTimer);
    player.addEventListener('slidechange', setTimer);

    shower.container.addEventListener('keydown', event => {
        if (!event.defaultPrevented) {
            clearTimeout(id);
        }
    });
};
