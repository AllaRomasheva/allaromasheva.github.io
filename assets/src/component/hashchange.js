import {debounce} from '../utils/debounce';
import {bind} from '../utils/bind';

const regexp       = new RegExp(/^#[^ ]+$/);

const getCssNumber = (element,prop) => {
    let value = null;
    if( element ) {
        value = getComputedStyle(element)[prop];
    }
    return parseInt(value) || 0;
}

const position = (elem) => {
    return elem.getBoundingClientRect();
}

const getOffset = (elem) => {
    let header   = document.querySelector('.app-header');
    let previous = elem.previousElementSibling;
    return Math.round(header.offsetHeight) + (getCssNumber(previous,'marginBottom') || 0 );
}

const scroll = () => {
    let offset,rect,elem,hash;
    hash = location.hash;
    elem = hash ? document.querySelector(hash) : null;
    if( elem ) {
        rect = position(elem);
        offset = window.pageYOffset + Math.round(rect.top) - getOffset(elem);
        window.scrollTo({ top: offset, left: window.scrollX, behavior: 'smooth' });
    }
}

const click = (ev) => {
    if(ev.target.hash && ev.target.hash === location.hash){
        ev.preventDefault();
    }
}

const match = () => {
    let href = location.href, expr , attr;
    let list = document.querySelectorAll('a[href],[data-rel]');
    [].slice.call(list).filter(function (el) {
        el.classList.remove('active');
        expr = el.getAttribute('data-rel');
        attr = el.getAttribute('href');
        if( attr === '#') return;
        return expr ? href.match(expr) : el.href ? href.indexOf(attr) !== -1 : false;
    }).map(function (el) {
        el.classList.add('active');
    });
}

const callback = debounce(scroll);

bind(document,'click','a',click);

window.addEventListener('hashchange', match , {passive: true});
window.addEventListener('hashchange', callback, {passive: true});
window.addEventListener('load', callback, {passive: true});

match();

