// `requestID` to cancel pseudo-animation
// For more detail check this docs:
//  https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#return_value
//  https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame#parameters
let requestID = null;
const buttonsCache = {};

/**
 * Return key for {@link buttonsCache} by {@link Gamepad}.
 * @param {Gamepad} gp
 * @return {`${string} ${number}`}
 */
const getCacheId = (gp) => `${gp.id} ${gp.index}`;

/**
 * Check button is pressed
 * @param {GamepadButton || number} button
 * @return {boolean}
 */
const buttonPressed = (button) => {
    if (typeof button === 'object') {
        return button.pressed;
    }
    return button === 1.0;
};

/**
 * Check buttons is pressed by indexes in {@link Gamepad.buttons} Array
 * @param {Gamepad} gp
 * @param {number[]} buttonIndexes - Array of indexes for {@link Gamepad.buttons}
 * @param {boolean} isAny - If `true` (by default) – {@link buttonsPressed} return `true`
 * if any button is pressed, else {@link buttonsPressed} return `true` if all buttons pressed.
 * @return {boolean}
 */
const buttonsPressed = (gp, buttonIndexes, isAny = true) => {
    const { buttons } = gp;
    return buttonIndexes
        .map((btn) => buttonPressed(buttons[btn]))
        .reduce((acc, btnStatus) => (isAny ? acc || btnStatus : acc && btnStatus), false);
};

/**
 * Using axes as buttons
 * @param {number[]} axes
 * @param {'more' | 'less'} moreOrLess
 * @param {number} value
 * @return {boolean}
 */
const axesToBoolean = (axes, moreOrLess, value) => {
    return axes.reduce(
        (acc, val) => acc || (moreOrLess === 'more' ? val > value : val < value),
        false,
    );
};

/**
 * Return mapped actions by buttons on gamepad. {@link buttonMapping} can detect Joy-cons.
 * @param {Gamepad} gp
 * @return {{
 *     next: boolean,
 *     prev: boolean,
 *     toggleFull: boolean,
 *     exitFull: boolean,
 * }}
 * @see https://www.w3.org/TR/gamepad/#remapping
 */
const buttonMapping = (gp) => {
    const { id } = gp;

    /**
     * Shortcut for {@link buttonsPressed}
     * @param {number} buttonIndexes
     * @return {boolean}
     */
    const b = (...buttonIndexes) => buttonsPressed(gp, buttonIndexes);
    const axes = gp.axes.map((value, index) => (index % 2 === 1 ? -value : value));
    const exitFull = b(16);

    if (id.startsWith('Joy-Con')) {
        const toggleFull = b(9, 10);

        const axesPositive = axesToBoolean(gp.axes, 'more', 0.7);
        const axesNegative = axesToBoolean(gp.axes, 'less', -0.7);

        if (id.startsWith('Joy-Con (R)')) {
            return {
                // Buttons: A, X, SR, ZR
                // Sticks directions: Up and Right
                next: b(0, 1, 5, 7) || axesPositive,

                // Buttons: B, Y, SL, R
                // Sticks directions: Down and Left
                prev: b(2, 3, 4, 8) || axesNegative,

                // Buttons: Plus, RStick
                toggleFull,

                // Buttons: Home
                exitFull,
            };
        }

        if (id.startsWith('Joy-Con (L)')) {
            return {
                // Buttons: Up, Right, SL, ZL
                // Sticks directions: Up and Right
                next: b(2, 3, 4, 6) || axesNegative,

                // Buttons: Left, Down, SR, L
                // Sticks directions: Down and Left
                prev: b(0, 1, 5, 8) || axesPositive,

                // Buttons: Minus, LStick
                toggleFull,

                // Buttons: Screenshot (looks like a circle in a square)
                exitFull,
            };
        }

        return {
            // Buttons: A, X, ZL, ZR, Up, Right, SL (on left Joy-con), SR (on right Joy-con)
            // Sticks directions: Up and Right (On each Joy-cons)
            next: b(1, 3, 6, 7, 12, 15, 18, 21) || axesToBoolean(axes, 'more', 0.7),

            // Buttons: B, Y, L, R, Bottom, Left, SR (on left Joy-con), SL (on right Joy-con)
            // Sticks directions: Down and Left (On each Joy-cons)
            prev: b(0, 2, 4, 5, 13, 14, 19, 20) || axesToBoolean(axes, 'less', -0.7),

            // Buttons: Minus, Plus, LStick, RStick
            toggleFull: b(8, 9, 10, 11),

            // Buttons: Home
            exitFull,
        };
    }

    // Buttons name from XBox Gamepad
    return {
        // Buttons: A, X, LT, RT, Up, Right
        // Sticks directions: Up and Right (On each stick)
        next: b(0, 2, 6, 7, 12, 15) || axesToBoolean(axes, 'more', 0.7),

        // Buttons: B, Y, LB, RB, Bottom, Left
        // Sticks directions: Down and Left (On each stick)
        prev: b(1, 3, 4, 5, 13, 14) || axesToBoolean(axes, 'less', -0.7),

        // Buttons: Select, Start, LStick, RStick
        toggleFull: b(8, 9, 10, 11),

        // Buttons: XBox button (home)
        exitFull,
    };
};

const ShowerActionOnButton = {
    /** @param {Shower} shower */
    next: (shower) => shower.next(),
    /** @param {Shower} shower */
    prev: (shower) => shower.prev(),
    /** @param {Shower} shower */
    toggleFull: (shower) => {
        if (shower.isFullMode) {
            shower.exitFullMode();
        } else {
            if (shower.activeSlideIndex === -1) shower.first();
            shower.enterFullMode();
        }
    },
    /** @param {Shower} shower */
    exitFull: (shower) => shower.exitFullMode(),
};

/**
 * @param {Shower} shower
 */
const gamepadLoop = (shower) => {
    return () => {
        for (const gp of navigator.getGamepads()) {
            if (gp) {
                const index = `${gp.id} ${gp.index}`;
                if (!buttonsCache[index]) {
                    buttonsCache[index] = {};
                }

                const buttonsState = buttonMapping(gp);
                const cache = buttonsCache[index];
                for (const key of Object.keys(buttonsState)) {
                    if (buttonsState[key] && cache[key] !== buttonsState[key]) {
                        // console.log('New button:', key);
                        ShowerActionOnButton[key](shower);
                    }
                }
                Object.assign(buttonsCache[index], buttonsState);
            }
        }
        requestID = requestAnimationFrame(gamepadLoop(shower));
    };
};

/**
 * @param {Shower} shower
 */
export default function gamepad(shower) {
    window.addEventListener('gamepadconnected', (event) => {
        const gp = event.gamepad;
        // console.log(
        //     `Gamepad connected at index ${gp.index}: ${gp.id}.`,
        //     `It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`,
        // );
        buttonsCache[getCacheId(gp)] = {};
        if (!requestID) {
            requestID = requestAnimationFrame(gamepadLoop(shower));
        }
    });

    window.addEventListener('gamepaddisconnected', (event) => {
        const gp = event.gamepad;
        // console.log(`Gamepad disconnected at index ${gp.index}: ${gp.id}.`);
        delete buttonsCache[getCacheId(gp)];
        if (Object.keys(buttonsCache).length === 0) {
            cancelAnimationFrame(requestID);
            requestID = null;
        }
    });
}
