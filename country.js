const img = document.querySelector("body > main > section > div:nth-child(1) > img");
const countryHeading = document.querySelector('.country-heading');
const btn = document.querySelector('.btn');
const modeContainer = document.querySelector('.mode-container');

const country = JSON.parse(localStorage.getItem('country'));

let isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
if (isDarkMode) {
    updateMode();
}

img.setAttribute('src', country.flag);
countryHeading.innerText = country.name;

btn.addEventListener('click', () => {
    // console.log(history.back());
    window.location.replace(`${window.location.origin}`);
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
