import a11y from './a11y';
import keys from './keys';
import location from './location';
import next from './next';
import progress from './progress';
import timer from './timer';
import title from './title';
import view from './view';
import touch from './touch';
import mouse from './mouse';

export default (shower) => {
    a11y(shower);
    progress(shower);
    keys(shower);
    next(shower);
    timer(shower); // should come after `keys` and `next`
    title(shower);
    location(shower); // should come after `title`
    view(shower);
    touch(shower);
    mouse(shower);

    // maintains invariant: active slide always exists in `full` mode
    if (shower.isFullMode && !shower.activeSlide) {
        shower.first();
    }
};
