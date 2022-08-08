const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const cancelAnimationFrame  = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

export function debounce(fn) {
    let frame, params;
    return function () {
        params = arguments;
        if (frame) {
            cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(function () {
            fn.apply(null, params);
        });
    }
}
