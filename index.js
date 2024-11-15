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
            customSelect.textContent = selectedText;

            // Close the dropdown
            customDropdown.classList.add("hidden");

            countryContainer.innerHTML = '';
            if (selectedValue === 'All') {
                countryList.forEach(country => { addCountry(country) })
            } else {
                // footerContainer.classList.add('hide');
                let countries = countryList.filter(country => country.region === selectedValue);
                countries.forEach(country => { addCountry(country) })
            }
        });
    });
}

fetch('https://restcountries.com/v3.1/all').then(
    res => res.json()
).then(data => data.map(country => ({
    name: country.name.common,
    population: country.population.toLocaleString('en-IN'),
    region: country.region,
    capital: country.capital?.[0],
    flag: country.flags.svg,
    nativeName: country.name.nativeName ? Object.values(country.name.nativeName)[0].common : '',
    subregion: country.subregion,
    topLevelDomain: country.topLevelDomain,
    currencies: country.currencies,
    languages: country.languages,
    borders: country.borders
}))).then(countries => {
    countryList = countries;
    countries.forEach(country => addCountry(country))
})

search.addEventListener('input', (e) => {
    let [country] = countryList.filter(country => country.name.toLowerCase() === e.target.value.toLowerCase());
    countryContainer.innerHTML = '';
    if (country) {
        addCountry(country);
    } else {
        // window.onload = () => showCard();
        countryList.forEach(country => addCountry(country));
    }
})

function addCountry(country) {
    const countryCard = document.createElement('a')
    countryCard.classList.add('country-card')
    countryCard.href = `/country.html?name=${country.name}`
    countryCard.innerHTML = `<div class="img-container"> 
                <img src="${country?.flag}" alt="Country Flag">
                 </div> 
                <div class="country-content">
                    <h2 class="country-heading">${country?.name}</h2>
                    <div class="country-info">
                        <p><b>Population: </b> ${country.population}</p>
                        <p><b>Region: </b> ${country.region}</p>
                        <p><b>Capital: </b> ${country.capital}</p>
                    </div>
                </div>`
    countryContainer.append(countryCard);
}

countryContainer.addEventListener('click', showCard);

function showCard() {
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        card.addEventListener('click', (e1) => {
            e1.stopPropagation();
            let [country] = countryList.filter(country => country.name === e1.currentTarget.getAttribute('data-value'))
            console.log(country, e1.currentTarget.innerText.split('\n')[0])
            window.location.replace(`${window.location.origin}/country.html?name=${e1.currentTarget.innerText.split('\n')[0]}`);
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

modeContainer.addEventListener('click', modeSwitcher)
// window.onload = () => showCard();

// Below code enables the pagination
// let currentPage = 1;

// const cardIncrease = 50, cardLimit = 250, pageCount = 5;
// const handleButtonStatus = () => {
//     if (pageCount === currentPage) {
//         loadMoreButton.classList.add("disabled");
//         loadMoreButton.setAttribute("disabled", true);
//     }
// };
// const addCards = (pageIndex) => {
//     currentPage = pageIndex;
//     handleButtonStatus();
//     const startRange = (pageIndex - 1) * cardIncrease;
//     const endRange =
//         pageIndex * cardIncrease > cardLimit ? cardLimit : pageIndex * cardIncrease;

//     cardCountElem.innerHTML = endRange;
//     for (let i = startRange + 1; i <= endRange; i++) {
//         addCountry(countryList[i]);
//     }
// };

// window.onload = () => {
//     addCards(currentPage);
//     showCard();
//     footerContainer.classList.remove('hide');
//     loadMoreButton.addEventListener("click", (e) => {
//         addCards(currentPage + 1);
//     });
// };