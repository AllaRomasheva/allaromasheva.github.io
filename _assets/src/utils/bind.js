export function bind(parent,event,selector,callback){
    return parent.addEventListener(event,function(ev){
        if( ev.target.matches(selector) ||  ev.target.closest(selector)){
            var target   = ev.target.matches(selector) ? ev.target : ev.target.closest(selector);
            callback.call(target,ev);
        }
    },true);
}
