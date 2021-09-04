var format = function (string, params) {
    return string.replace(/{(\w+)}/g, function (match, value) {
        return typeof params[value] != "undefined" ? params[value] : match;
    });
};
var find = function (selector, parent) {
    return (parent || document).querySelector(selector);
};
var findAll = function (selector, parent) {
    return [].slice.call((parent || document).querySelectorAll(selector));
};
var forEach = function (object, callback, context) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            callback.call(context || null, object[prop], prop, object);
        }
    }
};
var createElement = function(tag){
    return document.createElement(tag);
};
var element = function (tag, className , attrs, events) {
    var el = createElement(tag);
    el.className = className;
    forEach(attrs, function (value, name) {
        el.setAttribute(name, value);
    });
    forEach(events, function (value, name) {
        el.addEventListener(name, value);
    });
    return el;
};
var radio = function(name,value,callback){
    var label = createElement('label');
    var input = createElement('input');
    var span  = createElement('span');
    input.type  = 'radio';
    input.name  = name;
    input.value = value;
    input.onclick = callback;
    label.appendChild(input)
    label.appendChild(span);
    return label;
};

var appendChild = function(parent,child){
    return parent.appendChild(child);
};

var getTouchOrClick = function (event) {
    return event.touches ? event.touches[0] : event
};

var touchStart = function (ev) {
    if(hasScroll(ev.target)) return;
    this.isDragging = true;
    this.touches.startX = getTouchOrClick(ev).clientX;
    this.touches.startY = getTouchOrClick(ev).clientY;
};

var touchEnd = function (ev) {
    if(hasScroll(ev.target)) return;
    if (this.endDirection) {
        this.switchView(this.endDirection);
    }
    this.isDragging = false
    this.touches.startX = null
    this.touches.startY = null
    this.startDirection = null
    this.endDirection = null
};

var touchMove = function (ev) {
    if (!this.touches.startX || !this.touches.startY) {
        return
    }
    if(hasScroll(ev.target)) return;
    this.touches.endX = getTouchOrClick(ev).clientX;
    this.touches.endY = getTouchOrClick(ev).clientY;
    this.touches.differenceX = this.touches.startX - this.touches.endX;
    this.touches.differenceY = this.touches.startY - this.touches.endY;
    if (Math.abs(this.touches.differenceX) > Math.abs(this.touches.differenceY)) {
        this.endDirection = this.touches.differenceX > 0 ? 'right' : 'left'
    } else {
        this.endDirection = this.touches.differenceY > 0 ? 'down' : 'up'
    }
    this.draggingEffect();
};

var hasScroll = function(el){
    if(el.nodeType !== 1 ) return false;
    if(el.classList.contains('slider-buttons')) return true;
    var hasScrollableContent = el.scrollHeight > el.clientHeight;
    var overflowYStyle   = window.getComputedStyle(el).overflowY;
    var isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;
    var result = hasScrollableContent && !isOverflowHidden;
    if( result ) {
        return true;
    }
    if( el.parentNode ) {
        return hasScroll(el.parentNode);
    }
    return false;
};

var swipeOnWheel = function (ev) {
    var direction;
    if( ev.shiftKey === false && hasScroll(ev.target)) return;
    if (ev.shiftKey === false) {
        direction = (ev.deltaY > 0) ? 'down' : 'up';
    } else {
        direction = (ev.deltaY > 0) ? 'right' : 'left';
    }
    if (!this.waitAnimation) {
        this.switchView(direction)
    }
};
var blockPosition = function(elem,prop,type){
    elem.style[prop] = format('calc(50% - {0}px',[ elem.getBoundingClientRect()[type] / 2 ]);
};
var swipeWithKeyboard = function (ev) {
    var direction;
    if (ev.keyCode === 37 || ev.code === 'ArrowLeft') {
        direction = 'left'
    } else if (ev.keyCode === 38 || ev.code === 'ArrowUp') {
        direction = 'up'
    } else if (ev.keyCode === 39 || ev.code === 'ArrowRight') {
        direction = 'right'
    } else if (ev.keyCode === 40 || ev.code === 'ArrowDown') {
        direction = 'down'
    }
    if (direction && !this.waitAnimation) {
        this.switchView(direction);
    }
};
/**
 *
 * @param options
 * @constructor
 */
function PageSlider(options) {
    this.options = options;
    this.draggingPercent = 20;
    this.timeToAnimate = 500;
    this.width = 100;
    this.height = 100;
    this.startDirection = null;
    this.endDirection = null;
    this.waitAnimation = false;
    this.ticks = 0;
    this.touches = {
        startX: null,
        startY: null,
        endX: null,
        endY: null,
        differenceX: null,
        differenceY: null
    };
    this.initElements();
    this.initControls();
    this.setupEventListeners();
}

PageSlider.prototype = {
    name: 'PageSlider',
    initElements: function () {
        this.root      = document.documentElement;
        this.container = find(this.options.container);
        this.container.dataset.current = '0';
        this.sections = findAll(this.options.section, this.container);
        this.pages = [];
        this.sections.forEach(function (item) {
            item.dataset.current = '0';
            this.pages.push(
                findAll(this.options.page, item)
            );
        }, this);
    },
    initControls: function () {
        var sectionButtons = element('div', 'slider-buttons right');
        appendChild(this.container,sectionButtons);
        this.sections.forEach(function (section, sectionIndex) {
            var pageButtons = element('div', 'slider-buttons bottom');
            var button     = radio(this.name,sectionIndex,this.switchLink.bind(this));
            appendChild(sectionButtons,button);
            if( this.pages[sectionIndex].length > 1 ){
                this.pages[sectionIndex].forEach(function (page, pageIndex) {
                    var button = radio([this.name,sectionIndex].join('-'),pageIndex,this.switchLink.bind(this));
                    appendChild(pageButtons,button);
                }, this);
                appendChild(section,pageButtons);
                blockPosition(pageButtons,'left','width');
            }
        }, this);
        if(this.sections.length > 1) {
            blockPosition(sectionButtons,'top','height');
        }
        this.highlightItems();
    },
    switchPrepare: function (direction) {
        this.currentIndex = Number(this.container.dataset['current']);
        if (direction === 'down' || direction === 'up') {
            this.parent  = this.container;
            this.items   = this.sections;
            this.direction = 'Y';
        }
        if (direction === 'left' || direction === 'right') {
            this.parent  = this.sections[this.currentIndex];
            this.items   = this.pages[this.currentIndex];
            this.currentIndex = Number(this.parent.dataset['current']);
            this.direction    = 'X';
        }
        this.position   = Number(this.currentIndex);
        this.totalItems = this.items.length - 1;
        if (direction === 'down' || direction === 'right') {
            this.currentIndex++;
            this.offset = +this.draggingPercent;
        }
        if (direction === 'up' || direction === 'left') {
            this.currentIndex--;
            this.offset = -this.draggingPercent;
        }
        this.isDragging = false;
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.totalItems));
    },
    transformItems: function (axis, value) {
        this.items.forEach(function (item) {
            item.style.transform = format('translate{0}({1}%)', [axis, -value]);
        }, this);
    },
    switchLink: function (event) {
        var element = event.target;
        var section = this.container.dataset.current;
        var name    = element.name.split('-');
        var direction;
        var current = 0;
        if (this.waitAnimation) {
            return event.preventDefault();
        }
        this.waitAnimation = true;
        if (name.length === 1) {
            current = element.value;
            if (section > element.value) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        }
        if (name.length === 2) {
            current = element.value;
            if (this.sections[name[1]].dataset.current > element.value) {
                direction = 'left';
            } else {
                direction = 'right';
            }
        }
        this.switchPrepare(direction);
        this.transformItems(this.direction, (this.width * current));
        this.parent.dataset.current = current;
        this.highlightItems();
        this.afterAnimate();
    },
    switchView: function (direction) {
        if (this.waitAnimation === true) return;
        this.waitAnimation = true;
        if (this.startDirection && this.startDirection !== direction) {
            direction = this.startDirection;
        }
        this.switchPrepare(direction);
        this.root.classList.add('--animated');
        this.transformItems(this.direction,(this.width * this.currentIndex));
        this.parent.dataset.current = this.currentIndex;
        this.highlightItems();
        this.afterAnimate();
    },
    afterAnimate: function(){
        setTimeout(function(){
            this.waitAnimation = false;
            this.root.classList.remove('--animated');
            this.root.classList.remove('--dragging');
            if(this.removeScroll){
                this.root.classList.remove('--has-scroll');
            }
        }.bind(this),this.timeToAnimate);
    },
    checkToggler: function(name,value){
        var input = find(format('[name="{0}"][value="{1}"]',[name,value]));
        if( input ) input.checked = true
        return input;
    },
    togglePageScroll: function(page){
        if(page.classList.contains('slider-scroll')){
            this.removeScroll = false;
            this.root.classList.add('--has-scroll');
        } else {
            this.removeScroll = true;
        }
    },
    highlightItems:function(){
        var current   = this.container.dataset.current;
        var section   = this.sections[current];
        var page      = this.pages[current][section.dataset.current];
        var className = 'slider-active';
        this.togglePageScroll(page);
        this.sections.forEach(function(item,index){
            item.classList.remove(className);
            this.pages[index].forEach(function(item){
                item.classList.remove(className);
            });
        },this);
        section.classList.add(className);
        page.classList.add(className);
        this.checkToggler(this.name,current);
        this.checkToggler([this.name,current].join('-'),section.dataset.current);
    },
    draggingEffect: function () {
        if (this.isDragging === false) return;
        this.switchPrepare(this.startDirection = this.endDirection);
        if (this.waitAnimation === false) {
            this.transformItems(this.direction, ((this.width * this.position) + this.offset));
            this.root.classList.add('--dragging');
        }
        this.touches.startX = null;
        this.touches.startY = null;
        this.isDragging = false;
    },
    addEvent: function(name,callback){
        window.addEventListener(name,callback.bind(this));
    },
    setupEventListeners: function () {
        this.addEvent('wheel',swipeOnWheel);
        this.addEvent('mousedown',touchStart);
        this.addEvent('mousemove',touchMove);
        this.addEvent('mouseup',touchEnd);
        this.addEvent('touchstart',touchStart);
        this.addEvent('touchmove',touchMove);
        this.addEvent('touchend',touchEnd);
        this.addEvent('keyup',swipeWithKeyboard);
    }
}

module.exports = PageSlider;