export default (shower, options) => {
    const stepsSelector = options.selector || '.next';
    const { player } = shower;
    const { activeClass } = shower.options.slide;

    let innerSteps;
    let innerAt;

    const onSlideActivate = () => {
        innerSteps = getInnerSteps();
        innerAt = getInnerAt();

        const slide = player.currentSlide;
        slide.state.innerStepsCount = innerSteps.length;
    };

    const getInnerSteps = () => {
        const { layout } = player.currentSlide;
        const slideElement = layout.getElement();

        return [...slideElement.querySelectorAll(stepsSelector)];
    };

    const getInnerAt = () => {
        return innerSteps
            .filter(step => step.classList.contains(activeClass))
            .length;
    };

    const toggleActive = () => {
        innerSteps.forEach((step, index) => {
            step.classList.toggle(activeClass, index < innerAt);
        });
    };

    const onNext = event => {
        const canGoNext = shower.isFullMode
            && innerAt < innerSteps.length;

        if (!canGoNext) return;

        event.preventDefault();
        innerAt++;
        toggleActive();
    };

    const onPrev = event => {
        const canGoPrev = shower.isFullMode
            && innerAt > 0
            && innerAt < innerSteps.length;

        if (!canGoPrev) return;

        event.preventDefault();
        innerAt--;
        toggleActive();
    };

    shower.player.events.group()
        .on('activate', onSlideActivate)
        .on('next', onNext)
        .on('prev', onPrev);
};
