export default (shower, options) => {
    const progressSelector = options.selector || '.progress';
    const bar = shower.container.querySelector(progressSelector);
    if (!bar) return;

    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', 0);
    bar.setAttribute('aria-valuemax', 100);

    const { player } = shower;
    const updateProgress = () => {
        const index = player.currentSlideIndex;
        const { length } = player.slides;
        const progress = index / (length - 1) * 100;

        bar.style.width = `${progress}%`;
        bar.setAttribute('aria-valuenow', progress);
        bar.setAttribute('aria-valuetext', `Slideshow progress: ${progress}%`);
    };

    player.addEventListener('slidechange', updateProgress);
};
