function debounce(callback, delay) {
    let timer;

    return function(...args){
        clearTimeout(timer);

        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    }
}


const search = debounce(((query) => {
    console.log("query is", query)
}), 300);

search("J");
search("Ja");
search("Java");
search("Javascript");