//https://tarotapi.dev/api/v1/cards
let cardList = document.querySelector(`.card__list`);
let mainHeading = document.querySelector("main");
let loadingBackground = document.querySelector(`.loading__background`)
let searchBar = document.querySelector('.searchbar')


async function renderCards (filter, searchBarValue){
    let response = await fetch(`https://tarotapi.dev/api/v1/cards`);
    let data = await response.json();
    let allCards = data.cards;
    let onlyMajorCards = allCards.filter((element) => element.type === "major");

    
    //EDITING THE CARDS TO MY LIKING
    let storeIn = onlyMajorCards.splice(-2, 1);
    storeIn[0].value = "0";
    onlyMajorCards.unshift(storeIn[0]);
    onlyMajorCards.find((element) => (element.name === "Fortitude" ? (element.name = "Strength") : null));
    onlyMajorCards.find((element) => (element.name === "The Last Judgment" ? (element.name = "Judgement") : null));
    let newMajorCards = onlyMajorCards;

    let mergedCards = [...newMajorCards, ...allCards.filter((card) => card.type !== "major")];
    let majorMergedCards = mergedCards.filter((element) => element.type === "major");
    let minorMergedCards = mergedCards.filter((element) => element.type === "minor");
    console.log(allCards);
    console.log(searchBarValue);

    minorMergedCards.find((element) => {
        if (["page", "knight", "queen", "king"].includes(element.value)){
                element.category = "face";
        }
    });

    let faceMergedCards = minorMergedCards.filter((element) => element.category);

    //NOW ADDING IMAGES TO EVERY CARD

    mergedCards.forEach((card) => {
        if (card.type === "major") {
            card.image = `./assets/tarotImages/majorArcana/${card.name}.jpg`;
        }
        if (card.type === "minor"){
            if (!card.category){
                card.image = `./assets/tarotImages/minorArcana/${card.name}.jpg`;
            }
            else if (card.category){
                card.image = `./assets/tarotImages/faceImages/${card.name}.jpg`
            }
        }
    });

    // If searchBarValue is provided, filter the cards to show only those containing the searchBarValue in their name
    if (searchBarValue) {
        mergedCards = mergedCards.filter(card => card.name.toLowerCase().includes(searchBarValue.toLowerCase()));
    }

    if (searchBarValue && mergedCards.length === 0) {
        cardList.innerHTML = `<div class="no-results">The card you are looking for does not exist in our database</div>`;
        return;
    }


    //EDITING THE DOM
    cardList.innerHTML = mergedCards.map((element) => renderCardsHTML(element)).join(``);

    if (filter === 'MAJOR'){
        cardList.innerHTML = majorMergedCards.map((element) => renderCardsHTML(element)).join(``);
    }
    else if (filter === 'MINOR'){
        cardList.innerHTML = minorMergedCards.map((element) => renderCardsHTML(element)).join(``);
    }
    else if (filter === 'FACE'){
        cardList.innerHTML = faceMergedCards.map((element) => renderCardsHTML(element)).join(``);
    }

    loadingBackground.remove();

    // Scroll to the first card if a search is performed
    if (searchBarValue && mergedCards.length > 0) {
        mainHeading.scrollIntoView({ behavior: 'smooth' });
    }
}

//USED A SETTIMEOUT FOR A LOADING STATE
setTimeout(() => {
    renderCards();
}, 3000);


function renderCardsHTML (element) {
    return `<div class="card">
                <figure class="card__img--wrapper">
                    <img src="./assets/Tarot back design.jpg" alt="" class="tarot__frontimg">
                    <img src="${element.image}" alt="" class="tarot__backimg">
                </figure>

                <p class="tarot__name">${element.name}</p>
                <p class="tarot__category">${element.type.toUpperCase()}</p>
                <p class="tarot__number">${element.value_int}</p>
            </div>`
}

function singleCardSearch() {
    let searchBarValue = searchBar.value;
    renderCards(undefined, searchBarValue);
}

function handleKeyDown (event){
    if (event.key === `Enter`){
        singleCardSearch()
    }
}

function filterCards (event){
    renderCards(event.target.value)
}

function openMenu (){
    document.body.classList += (` menu__open`)
}

function closeMenu (){
    document.body.classList.remove(`menu__open`)
}