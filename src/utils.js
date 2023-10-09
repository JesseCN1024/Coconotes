export const debounce = (func, delay=1000) => {
    let timeoutId;
    return (...args) => { // rest contains all the paras
        if (timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            // apply call the func as normally but seperate the args into vars
            func.apply(null,args);
        }, delay);
    }
}