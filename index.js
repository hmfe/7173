window.addEventListener("load", function(){
    saveList = document.getElementById('saved');
    templateSave = document.getElementById("saved-item");
    templateResult = document.getElementById("result-item");
    resultsField = document.getElementById('results');


    let searchInput = document.getElementById('searchInput'),
        clearButton = document.getElementById('clearButton');

    clearButton.addEventListener("click", () => {clearHistory()});

    let delay = (() => {
        let timer = 0;
        return (callback, ms) => {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    searchInput.addEventListener("keyup", function(event){
        delay(() =>{
            searchWiki(this, event)
        }, 200 );
    });
});


function searchWiki (term) {
    if (term) {
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                format: 'json',
                search: term.value
            },
            success: function(response){
                if(response[1].length > 0) {
                    createElements(response[1], term.value)
                }
            }
        }).promise();
    }
}

function createElements(response, term){
    let clone = templateResult.content.cloneNode(true);

    resultsField.innerHTML = '';
    resultsField.classList.remove("is-open");

    response.forEach(function(item, index) {
        if(index > 0){
            item = item.toLowerCase();
            let editedItem = item.replace(term, "");

            let target = document.importNode(clone, true),
                listButton = target.querySelector(".a-button");
            listButton.innerHTML = "<strong>"+term+"</strong>"+editedItem;

            listButton.addEventListener("click", () =>{
                saveItem(item);
            });

            resultsField.appendChild(target);
            resultsField.classList.add("is-open");
        }
    });
}

function saveItem(item){

    let clone = templateSave.content.cloneNode(true),
        date = getTimestamp(),
        target = document.importNode(clone, true),
        listItem = target.querySelector(".a-item"),
        deleteBtn = target.querySelector(".a-delete");

    deleteBtn.addEventListener("click", function(){
        deleteItem(this);
    });

    listItem.innerHTML = item;
    target.querySelector(".date").innerHTML = date;
    saveList.appendChild(target);

}

function getTimestamp(){
    let d = new Date,
        fix = function(nr){
            return ('0' + nr).slice(-2)
        },
        date = [d.getFullYear(),
            fix(d.getMonth()+1),
            fix(d.getDate())].join('-'),
        time = ' '+ [d.getHours(),
            fix(d.getMinutes()),
            fix(d.getSeconds())].join(':');

    return date+", "+time;

}

function deleteItem(item){
    item.parentNode.remove();
}

function clearHistory(){
    saveList.innerHTML = "";
}