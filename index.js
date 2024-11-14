const customSelect = document.getElementById("customSelect");
const customDropdown = document.getElementById("customDropdown");
const dropdownOptions = document.querySelectorAll(".dropdown-option");
const countryContainer = document.querySelector(".country-container");
const search = document.querySelector("#search");
const modeContainer = document.querySelector('.mode-container');
const loadMoreButton = document.querySelector('.loadMoreButton');
const cardCountElem = document.querySelector('.cardCountElem');
const footerContainer = document.querySelector('.footer-container');
let countryList;

let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
if (isDarkMode) {
    updateMode();
}

const countryInfoList = ['Population: ', 'Region: ', 'Capital: ']

if (customSelect && customDropdown) {
    // Toggle dropdown on select click
    customSelect.addEventListener("click", function (event) {
        event.stopPropagation();
        customDropdown.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!customDropdown.classList.contains("hidden")) {
            customDropdown.classList.add("hidden");
        }
    });

    // Add click event to each option
    dropdownOptions.forEach(option => {
        option.addEventListener("click", function () {
            const selectedValue = option.getAttribute("data-value"); // Get the value of the clicked option
            const selectedText = option.textContent; // Get the text of the clicked option

            // Set the selected option as the customSelect's text
            customSelect.textContent = selectedText;

            // Close the dropdown
            customDropdown.classList.add("hidden");

            console.log("Selected Value:", selectedValue); // Log the value
            console.log("Selected Text:", selectedText); // Log the text    

            countryContainer.innerHTML = '';
            if (selectedValue === 'All') {
                addCards(1);
                footerContainer.classList.remove('hide');
            } else {
                footerContainer.classList.add('hide');
                let countries = countryList.filter(country => country.countryDetails[1] === selectedValue);
                countries.forEach(country => { addCountry(country) })
            }
        });
    });
}

fetch('data.json').then(
    res => res.json()
).then(data => data.map(country => ({
    name: country.name,
    countryDetails: [country.population, country.region, country.capital],
    flag: country.flag,
    nativeName: country.nativeName,
    subregion: country.subregion,
    topLevelDomain: country.topLevelDomain,
    currencies: country.currencies,
    languages: country.languages,
}))).then(countries => {
    countryList = countries;
    // countries.forEach(country => addCountry(country))
})

search.addEventListener('input', (e) => {
    let [country] = countryList.filter(country => country.name.toLowerCase() === e.target.value.toLowerCase());
    countryContainer.innerHTML = '';
    if (country) {
        addCountry(country);
        footerContainer.classList.add('hide');
    } else {
        addCards(1);
        footerContainer.classList.remove('hide');
    }
})

function addCountry(country) {
    const countryCard = document.createElement('article');
    countryCard.classList.add('country-card');
    countryCard.setAttribute('data-value', country?.name);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('country-img');

    const img = document.createElement('img');
    img.setAttribute('src', country?.flag);
    img.setAttribute('alt', 'Country Flag');
    imgContainer.append(img)

    countryCard.append(imgContainer);

    const countryContent = document.createElement('div');
    countryContent.classList.add('country-content');
    const h2 = document.createElement('h2');
    h2.textContent = country?.name;
    h2.classList.add('country-heading');
    countryContent.append(h2);

    const countryInfo = document.createElement('div');
    countryInfo.classList.add('country-info');

    for (let i = 0; i < 3; i++) {
        const p = document.createElement('p')
        const b = document.createElement('b')
        const span = document.createElement('span')
        b.textContent = countryInfoList[i]
        span.textContent = country?.countryDetails[i];
        p.append(b, span);
        countryInfo.append(p);
    }

    countryContent.append(countryInfo);

    countryCard.append(countryContent)
    countryContainer.append(countryCard)
}

countryContainer.addEventListener('click', showCard);

function showCard() {
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        card.addEventListener('click', (e1) => {
            e1.stopPropagation();
            let [country] = countryList.filter(country => country.name === e1.currentTarget.getAttribute('data-value'))
            window.location.replace(`${window.location.origin}/country.html`);
            localStorage.setItem('country', JSON.stringify(country));
        })
    })
}

function modeSwitcher() {
    const [icon, mode] = modeContainer.children;
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
        document.body.classList.add('dark');
        icon.classList.add('fa-sun', 'fa-solid');
        icon.classList.remove('fa-moon', 'fa-regular');
        mode.innerText = 'Light mode'
    } else {
        document.body.classList.remove('dark');
        icon.classList.remove('fa-sun', 'fa-solid');
        icon.classList.add('fa-moon', 'fa-regular');
        mode.innerText = 'Dark mode'
    }
}

function updateMode() {
    const [icon, mode] = modeContainer.children;
    document.body.classList.add('dark');
    icon.classList.add('fa-sun', 'fa-solid');
    icon.classList.remove('fa-moon', 'fa-regular');
    mode.innerText = 'Light mode'
}

let currentPage = 1;
modeContainer.addEventListener('click', modeSwitcher)

// window.onload = showCard;
const cardIncrease = 50, cardLimit = 250, pageCount = 5;
const handleButtonStatus = () => {
    if (pageCount === currentPage) {
        loadMoreButton.classList.add("disabled");
        loadMoreButton.setAttribute("disabled", true);
    }
};
const addCards = (pageIndex) => {
    currentPage = pageIndex;
    handleButtonStatus();
    const startRange = (pageIndex - 1) * cardIncrease;
    const endRange =
        pageIndex * cardIncrease > cardLimit ? cardLimit : pageIndex * cardIncrease;

    cardCountElem.innerHTML = endRange;
    for (let i = startRange + 1; i <= endRange; i++) {
        addCountry(countryList[i]);
    }
};

window.onload = () => {
    addCards(currentPage);
    showCard();
    footerContainer.classList.remove('hide');
    loadMoreButton.addEventListener("click", (e) => {
        addCards(currentPage + 1);
    });
};