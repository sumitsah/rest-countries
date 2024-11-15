const img = document.querySelector("body > main > section > div:nth-child(1) > img");
const countryName = new URLSearchParams(location.search).get('name')
const countryHeading = document.querySelector('.country-heading');
const btn = document.querySelector('.btn');
const modeContainer = document.querySelector('.mode-container');
const nativeName = document.querySelector('.native-name')
const population = document.querySelector('.population')
const region = document.querySelector('.region')
const subRegion = document.querySelector('.sub-region')
const capital = document.querySelector('.capital')
const topLevelDomain = document.querySelector('.top-level-domain')
const currencies = document.querySelector('.currencies')
const languages = document.querySelector('.languages')
const borderCountries = document.querySelector('.border-container')

let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
if (isDarkMode) {
    updateMode();
}
btn.addEventListener('click', () => {
    console.log(history)
    history.back()
})

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((res) => res.json())
    .then(([country]) => {

        img.setAttribute('src', country.flags.svg ? country.flags.svg : country.flags.png);
        countryHeading.innerText = country.name.common;
        capital.innerText = country.capital?.[0];
        subRegion.innerText = country.subregion;

        if (country.name.nativeName) {
            nativeName.innerText = Object.values(country.name.nativeName)[0].common
        } else {
            nativeName.innerText = country.name.common
        }

        if (country.currencies) {
            currencies.innerText = Object.values(country.currencies)
                .map((currency) => currency.name)
                .join(', ')
        }

        if (country.languages) {
            languages.innerText = Object.values(country.languages).join(', ')
        }

        if (country.borders) {
            country.borders.forEach((border) => {
                fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                    .then((res) => res.json())
                    .then(([borderCountry]) => {
                        const borderCountryTag = document.createElement('a')
                        borderCountryTag.classList.add('border');
                        borderCountryTag.innerText = borderCountry.name.common
                        borderCountryTag.href = `country.html?name=${borderCountry.name.common}`
                        borderCountries.append(borderCountryTag)
                    })
            })
        }
    })


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
