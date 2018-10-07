import a11y from './a11y';
import keys from './keys';
import location from './location';
import next from './next';
import progress from './progress';
import scale from './scale';
import timer from './timer';
import title from './title';
import view from './view';

export default shower => {
    view(shower);
    scale(shower);
    keys(shower);
    title(shower);
    location(shower);
    next(shower);
    progress(shower);
    timer(shower);
    a11y(shower);
};
