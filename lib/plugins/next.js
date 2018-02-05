export default (shower, options) => {
    const stepsSelector = options.selector || '.next';
    const { player } = shower;
    const { activeClass } = shower.options.slide;

    let innerSteps;
    let innerAt;

    const getInnerSteps = () => {
        const { element } = player.currentSlide;
        return [...element.querySelectorAll(stepsSelector)];
    };

    const getInnerAt = () => {
        return innerSteps.filter(step => {
            return step.classList.contains(activeClass);
        }).length;
    };

    const toggleActive = () => {
        innerSteps.forEach((step, index) => {
            step.classList.toggle(activeClass, index < innerAt);
        });
    };

    player.addEventListener('slidechange', () => {
        innerSteps = getInnerSteps();
        innerAt = getInnerAt();

        const slide = player.currentSlide;
        slide.state.innerStepsCount = innerSteps.length;
    });

    player.addEventListener('next', event => {
        if (event.defaultPrevented || shower.isListMode) return;
        if (innerAt === innerSteps.length) return;

        event.preventDefault();
        innerAt++;
        toggleActive();
    });

    player.addEventListener('prev', event => {
        if (event.defaultPrevented || shower.isListMode) return;
        if (innerAt === innerSteps.length || !innerAt) return;

        event.preventDefault();
        innerAt--;
        toggleActive();
    });
};
