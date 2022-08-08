const isFunction = (v) => typeof v === 'function'
const hasProp = (o, v) => o && o.hasOwnProperty(v)

const stringFormat = (value, params, regexp) => {
    regexp = regexp || /{{(.+?)}}/g
    return value.replace(regexp, (match, prop) => {
        prop = prop.trim()
        if (isFunction(params)) {
            return params(prop) || match
        } else {
            return typeof prop in params ? params[prop] : match
        }
    })
}

const getPath = (path, context) => {
    const props = path.trim().split('.')
    const root = context || window
    const first = props.shift()
    let value = null
    if (hasProp(root, first)) {
        value = root[first]
        props.forEach((name) => {
            value = hasProp(value, name) ? value[name] : null
        })
    }
    return value
}

const createElement = (name, attr = {}) => {
    const element = document.createElement(name)
    Object.entries(attr).forEach(([name, value]) => {
        element.setAttribute(name, value)
    })
    return element
}

const parseUrl = (value) => {
    const link = createElement('a', { href: value })
    const { origin, hostname, href, host, pathname, search, hash } = link
    return {
        origin,
        hostname,
        pathname,
        href,
        hash,
        host,
        search,
        query: parseQuery(search),
        path: pathname.split('/').filter((i) => i),
    }
}

const parseQuery = (search) => {
    const params = {}
    if (search.charAt(0) === '?') {
        search = search.slice(1)
    }
    if (search === '') {
        return params
    }
    search.split('&').forEach((chunk) => {
        let [name, value] = chunk.split('=')
        if (value === undefined) {
            if (name) {
                value = true
            } else {
                return
            }
        }
        name = decodeURIComponent(name).trim()
        value = decodeURIComponent(value).trim()
        params[name] = value
    })
    return params
}

const scripts = []

const arrayFind = (array, callback) => {
    return array.filter(callback).shift()
}

const getScript = (endpoint) => {
    if (endpoint in scripts) {
        return scripts[endpoint]
    }
    scripts[endpoint] = new Promise((resolve, reject) => {
        const script = createElement('script', {
            async: true,
            src: endpoint,
        })
        script.addEventListener('load', resolve)
        script.addEventListener('error', reject)
        document.body.appendChild(script)
    })
    return scripts[endpoint]
}

const getJsonCallback = (endpoint, params) => {}

const providers = []

class EmbedProvider {
    constructor(element, config, params) {
        this.element = element
        this.config = config
        this.params = params
        this.render()
    }
    format(string) {
        return stringFormat(string, (prop) => {
            return getPath(prop, this)
        })
    }
    scope(namespace) {
        return getPath(namespace)
    }
    endpoint() {
        const url = this.config.endpoint
        return url ? getScript(this.format(url)) : Promise.resolve()
    }
    render() {
        this.modify()
        this.template()
        this.endpoint().then(() => {
            this.callback()
        })
    }
    modify() {
        this.url = this.params.href
        if (isFunction(this.config.modify)) {
            this.url = this.config.modify.call(this, this.params)
        }
    }
    template() {
        this.html = ''
        if (isFunction(this.config.template)) {
            this.html = this.format(this.config.template.call(this))
        }
        this.element.innerHTML = this.html
    }
    callback() {
        if (isFunction(this.config.callback)) {
            this.config.callback.call(this)
        }
    }
}

providers.push({
    name: 'youtube',
    hosts: ['www.youtube.com', 'youtu.be'],
    modify(params) {
        const [, pathId] = params.path
        const { v: queryId } = params.query
        const id = pathId || queryId || false
        return id ? `//www.youtube.com/embed/${id}?wmode=transparent` : false
    },
    template() {
        return `<iframe src="{{ url }}"
                    loading="lazy" 
                    allowfullscreen>
                </iframe>`
    },
})

providers.push({
    name: 'telegram',
    hosts: ['t.me'],
    endpoint: '//telegram.org/js/telegram-widget.js',
    modify(params) {
        const [channel, post] = params.path
        return [channel, post].join('/')
    },
    template() {
        return `<blockquote class="telegram-post" 
                    data-width="100%" 
                    data-telegram-post="{{ url }}">
                </blockquote>`
    },
})

providers.push({
    name: 'instagram',
    hosts: ['www.instagram.com', 'instagram.com', 'instagr.am'],
    endpoint: '//platform.instagram.com/{{ config.locale }}/embeds.js',
    locale: 'uk_UA',
    version: 14,
    template() {
        return `<blockquote class="instagram-media" 
                data-instgrm-captioned 
                data-instgrm-permalink="{{ url }}" 
                data-instgrm-version="{{ config.version }}">
                </blockquote>`
    },
})

providers.push({
    name: 'facebook',
    hosts: ['www.facebook.com', 'facebook.com', 'fb.com'],
    endpoint: '//connect.facebook.net/{{ config.locale }}/sdk.js#xfbml=1&version=v14.0',
    locale: 'uk_UA',
    template() {
        return `<div class="fb-post" 
                data-show-text="true" 
                data-width="auto" 
                data-href="{{ url }}">
                </div>`
    },
    callback() {
        const sdk = this.scope('instgrm.Embeds')
        if (sdk) sdk.process()
    },
})

providers.push({
    name: 'twitter',
    hosts: ['twitter.com'],
    endpoint: '//platform.twitter.com/widgets.js',
    modify(params) {
        return params.href
    },
    template() {
        return `<blockquote class="twitter-tweet">
                <a href="{{ url }}"></a>
                </blockquote>`
    },
    callback() {
        const sdk = this.scope('twttr.widgets')
        if (sdk) sdk.load()
    },
})



class EmbedElement extends HTMLElement {
    constructor() {
        super()
        this.match()
    }
    match() {
        const params = parseUrl(this.getAttribute('url'))
        const config = arrayFind(providers, (config) => {
            return config.hosts.indexOf(params.host) >= 0
        })
        if (config) {
            new EmbedProvider(this, config, params)
        }
    }
}

const embedElements = (selector,getUrl,getWrapper) => {
    const list = [].slice.call(document.querySelectorAll(selector))
    list.forEach((el)=>{
        const url = getUrl(el)
        if( url ) {
            const params = parseUrl(url)
            const config = arrayFind(providers, (config) => {
                return config.hosts.indexOf(params.host) >= 0
            })
            if (config) {
                el = getWrapper(el)
                el.classList.add(config.name)
                new EmbedProvider(el, config, params)
            }
        }
    })
}

embedElements('p > a:only-child',(el) =>{
    return el.getAttribute('href') || el.innerText
}, (el) => {
    const parent = el.parentNode
    const wrapper = document.createElement('figure')
    wrapper.classList.add('embed')
    parent.parentNode.replaceChild(wrapper,parent)
    return wrapper
})



