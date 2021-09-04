/**
 *
 * @param selector
 * @param parent
 * @return {Element[]}
 */
export function find(selector,parent){
    return Array.from((parent||document).querySelectorAll(selector))
}
