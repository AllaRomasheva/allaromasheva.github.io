import {bind} from '../utils/bind';
import {find} from '../utils/find';

const provider = {
    facebook: 'https://www.facebook.com/dialog/feed?app_id=2114681162110682&display=popup&link={link}',
    twitter: 'https://twitter.com/intent/tweet?text={text}&url={link}&via={via}&hashtags={hashtags}',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url={link}',
    telegram: 'https://t.me/share/url?url={link}&text={text}',
    reddit: 'https://www.reddit.com/submit?url={link}&title={text}',
    pinterest: 'https://www.pinterest.com/pin/create/button/?url={link}&media={image}&description={text}',
    viber: 'viber://forward?text={link}',
    messenger: 'https://www.facebook.com/dialog/send?link={link}&app_id=2114681162110682&redirect_uri={link}'
};


const params = function () {
    const meta = {};
    const data = {};
    const canonical = find('link[rel="canonical"]')[0].getAttribute('href');
    find('meta').forEach( (e, i) =>{
        if ((i = e.getAttribute('property') || e.getAttribute('name'))) {
            meta[i] = e.getAttribute('content');
        }
    });
    data.text = encodeURIComponent(meta['og:description'] || meta['og:title'] || '');
    data.link = encodeURIComponent(canonical || meta['og:url']);
    data.image = meta['og:image'];
    if (meta['twitter:creator']) {
        data.via = String(meta['twitter:creator']).slice(1);
    } else {
        data.via = '';
    }
    if (meta['og:keywords']) {
        data.hashtags = meta['og:keywords'];
    } else {
        data.hashtags = '';
    }
    return data;
};

const format = (string,params)=>{
    return string.replace(/{(\w+)}/g, function (match, slot) {
        return typeof params[slot] != "undefined" ? params[slot] : match
    });
};

const popup = (url, params) => {
    let idle = null;
    const width = 800;
    const height = 750;
    const template = 'scrollbars=0,resizable=0,menubar=0,toolbar=0,status=0,left={0},top={1},width={2},height={3}';
    const config = format(template, [(screen.width / 2) - (width / 2), (screen.height / 2) - (height / 2), width, height]);
    const popup  = window.open(url, params.name || '', config);
    popup.focus();
    idle = setInterval(function () {
        if (popup.closed === true) {
            clearInterval(idle);
            if (typeof (params.close) == 'function') {
                params.close();
            }
        }
    }, 200);
};

bind(document,'click','[data-share]', (ev)=>{
    ev.preventDefault();
    const elem = ev.target.closest('[data-share]');
    const type = elem.getAttribute('data-share');
    popup(format(provider[type], params()), {
        close: function () {
            if (elem.getAttribute('data-reload')) {
                location.reload();
            }
        }
    });
})


