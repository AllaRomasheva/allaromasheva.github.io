import {debounce} from '../utils/debounce';

const html = document.documentElement;
const container = document.scrollingElement;

let scroll = 0;

const idle = (cb,ttl) => {
    clearTimeout(cb.idle)
    cb.idle = setTimeout(cb,ttl)
}

const scroller = () => {
    let scrollTop = container.scrollTop;
    let progress  = parseFloat(scrollTop / ((html.scrollHeight - html.clientHeight) / 100) ).toFixed(2);

    idle(()=>{
        html.style.setProperty('--progress',String(progress));
    },300)

    html.style.setProperty('--window-height', window.innerHeight + 'px')
    html.classList.toggle('scroll', scrollTop > 0);
    html.classList.toggle('scroll-bottom', scrollTop > 0 && (scroll < scrollTop));
    html.classList.toggle('scroll-top', scrollTop > 0 && (scroll > scrollTop));
    scroll = scrollTop;
}

const callback = debounce(scroller);

window.addEventListener('orientationchange', callback, {passive: true});
window.addEventListener('resize', callback, {passive: true});
window.addEventListener('scroll', callback, {passive: true});

scroller();
