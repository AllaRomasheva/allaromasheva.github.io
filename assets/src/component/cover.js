import {find} from "../utils/find";

const cover = (el) => {
    const url = el.getAttribute('data-cover');
    el.removeAttribute('data-cover');
    el.style.backgroundImage = `url(${url})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center center';
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
        entries.filter(item => {
            return item.isIntersecting;
        }).forEach(item => {
            cover(item.target);
            observer.unobserve(item.target);
        });
    });
    find('[data-cover]').forEach( el => {
        observer.observe(el);
    });
} else {
    find('[data-cover]').forEach(cover);
}
