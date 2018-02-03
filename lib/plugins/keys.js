import { isInteractiveElement, isModifierUsed } from '../utils';

export default shower => {
    const { player } = shower;
    const slideActions = event => {
        switch (event.key.toUpperCase()) {
            case 'ENTER':
                if (event.metaKey && shower.isListMode) {
                    if (event.shiftKey) {
                        event.preventDefault();
                        player.first();
                    }

                    break;
                }

                event.preventDefault();
                if (event.shiftKey) {
                    player.prev();
                } else {
                    player.next();
                }
                break;

            case 'PAGEUP':
            case 'ARROWUP':
            case 'ARROWLEFT':
            case 'H':
            case 'K':
            case 'P':
                if (!isModifierUsed(event)) {
                    event.preventDefault();
                    player.prev({ cancelable: event.shiftKey });
                }
                break;

            case 'PAGEDOWN':
            case 'ARROWDOWN':
            case 'ARROWRIGHT':
            case 'L':
            case 'J':
            case 'N':
                if (!isModifierUsed(event)) {
                    event.preventDefault();
                    player.next({ cancelable: event.shiftKey });
                }
                break;

            case ' ':
                if (!isModifierUsed(event) && showre.isFullMode) {
                    event.preventDefault();
                    if (event.shiftKey) {
                        player.prev();
                    } else {
                        player.next();
                    }
                }
                break;

            case 'HOME':
                event.preventDefault();
                player.first();
                break;

            case 'END':
                event.preventDefault();
                player.last();
                break;
        }
    };

    const modeActions = event => {
        switch (event.key.toUpperCase()) {
            case 'ESCAPE':
                if (shower.isFullMode) {
                    event.preventDefault();
                    shower.exitFullMode();
                }
                break;

            case 'ENTER':
                if (event.metaKey && shower.isListMode) {
                    event.preventDefault();
                    shower.enterFullMode();
                }
                break;

            case 'P':
                if (event.metaKey && event.altKey && shower.isListMode) {
                    event.preventDefault();
                    shower.enterFullMode();
                }
                break;

            case 'F5':
                if (event.shiftKey && shower.isListMode) {
                    event.preventDefault();
                    shower.enterFullMode();
                }
                break;
        }
    };

    shower.container.addEventListener('keydown', event => {
        if (event.defaultPrevented) return;
        if (isInteractiveElement(event.target)) return;

        slideActions(event);
        modeActions(event);
    });
};
