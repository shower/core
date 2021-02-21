import { contentLoaded } from '../utils';

export default (shower) => {
    contentLoaded(() => {
        let action = false;
        let clickable = false;

        document.addEventListener('touchstart', (ev) => {
            if (ev.touches.length > 1) {
                action = false;
                return true;
            }
            const touch = ev.touches[0];
            const x = touch.clientX;
            const { target } = touch;
            clickable =
                target.getAttribute('onclick') != null || target.getAttribute('href') != null;
            if (!clickable) {
                if (target.tagName.toLowerCase() === 'html') {
                    if (ev.cancelable) ev.preventDefault();
                    action = true;
                    return false;
                }
                if (shower.isFullMode) {
                    if (ev.cancelable) ev.preventDefault();
                    if (window.innerWidth / 2 < x) {
                        shower.next();
                    } else {
                        shower.prev();
                    }
                    return false;
                }
                return false;
            }
            return true;
        });
        document.addEventListener('touchend', (ev) => {
            if (ev.touches.length > 1) return true;
            if (!clickable) {
                if (shower.isFullMode) ev.preventDefault();
                if (action) {
                    ev.preventDefault();
                    action = false;
                    shower.exitFullMode();
                }
            }
            return false;
        });
    });
};
