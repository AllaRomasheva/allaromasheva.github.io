import {bind} from '../utils/bind';

bind(document, 'click', '[data-flip]', function (ev) {
    const el = ev.target;
    const card = el.closest('[data-card]');
    card.classList.toggle('active');
    if (el.hasAttribute('data-flip')) {
        ev.preventDefault();
    }
});
