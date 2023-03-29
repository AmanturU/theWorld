
const $container = document.querySelector('.container')
const $btnPrev = document.querySelector('.prev')
const $btnNext = document.querySelector('.next')
const $page = document.querySelector(".counter")
const $continentSelect = document.querySelector("#continent-select")


const LIMIT = 10
const TOTAL_COUNTRYS = 250
const TOTAL_PAGES = Math.ceil(TOTAL_COUNTRYS / LIMIT)
let pageCounter = 1
let offsetCounter = 0

let api = {
   main: 'https://restcountries.com/v3.1/all',
   detail: 'https://restcountries.com/v3.1/alpha/',
   region: 'https://restcountries.com/v3.1/region/'
}


window.addEventListener('load', () => {
   setData(`${api.main}?offset=${offsetCounter}&limit=${LIMIT}`).then(data => {
      let temp = data.map((country) => TitleCountryCard(country)).join('')

      $container.innerHTML = temp
   })

   $continentSelect.addEventListener("change", (e) => {
      const selectedContinent = $continentSelect.value
      setData(`${api.region}${selectedContinent}?offset=${offsetCounter}&limit=${LIMIT}`).then((data) => {
         let temp = data.map((country) => TitleCountryCard(country)).join('')
         $container.innerHTML = temp
      })

   })
})



const setInfoCountry = (cca3) => {
   setData(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(data => {
         $container.innerHTML = CardCountry(data)
      })
}

const setData = (url) => fetch(url).then((res) => res.json())


// Сами карточки
function TitleCountryCard(country) {
   return `
   <div class="card" onClick="setInfoCountry('${country.cca3}')">
   <img src="${country.flags.svg}" alt="${country.name.common}">
      <h1>${country.name.common}</h1> 
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
   </div>`
}

function CardCountry(info) {
   console.log(info)
   console.log(info)

   const {
      name: { common, nativeName },
      flags: { svg },
      capital,
      region,
      subregion,
      population,
      area,

      borders,
      callingCodes,
      name
   } = info[0]
   console.log(name.nativeName)
   const languages = Object.keys(info[0].languages).map(key => info[0].languages[key])
   const nativeNamee = Object.keys(name.nativeName).map(key => name.nativeName[key])
   const currency = Object.keys(info[0].currencies).map(key => info[0].currencies[key])

   const currencyName = currency[0].name
   const currencySymbol = currency[0].symbol
   const timezones = info[0].timezones
   const carSide = info[0].car.side

   return `
      <div class="countryInfo">
         <div class="countryDetailsMainInfo">
            <img class="countryDetailsFlag" src="${svg}" alt="${common} flag">
            <div class="countryDetailsInfomations">
               <h1 class="countryDetailsName">${common}</h1>
               <p><strong>Capital:</strong> ${capital}</p>
               <p><strong>Region:</strong> ${region}</p>
               <p><strong>Population:</strong> ${population.toLocaleString()}</p>
               <p><strong>Area:</strong> ${area.toLocaleString()} km²</p>

            </div>
         </div>
         <div class="countryDetailsSecondary">
            <h2>Additional Information:</h2>
            <p><strong>Native name:</strong> ${nativeNamee[0].official}</p>
            <p><strong>Official languages:</strong> ${languages}</p>
            <p><strong>Subregion:</strong> ${subregion}</p>
            <p><strong>Road traffic:</strong> ${carSide} hand</p>
            <p><strong>Timezones:</strong> ${timezones.join(', ')}</p>
            <p><strong>Currencies:</strong> ${currencyName} (${currencySymbol})</p>
         </div>
      </div>
      <h2 class="back-link" onClick="reloadWindowFunc()">Back to main page</h2>
   `
}

function reloadWindowFunc() {
   window.location.reload()
}


/* --------------------------===>Pagination<===-------------------------- */
// Pagination 
window.addEventListener("load", () => {
   $page.innerHTML = pageCounter
   $btnPrev.setAttribute("disabled", true)
});

$btnNext.addEventListener("click", (e) => {
   e.preventDefault()
   $btnPrev.removeAttribute("disabled")
   if (pageCounter >= 1 && pageCounter <= TOTAL_PAGES) {
      if (pageCounter === TOTAL_PAGES) {
         $btnNext.setAttribute("disabled", true)
         setData(
            `${api.main}?offset=${(offsetCounter += LIMIT)}&limit=${LIMIT}`
         ).then((data) => {
            pageCounter++
            $page.innerHTML = pageCounter
            let temp = data.map((country) => TitleCountryCard(country)).join('')

            $container.innerHTML = temp
         })
      } else {
         setData(`${api.main}?offset=${(offsetCounter += LIMIT)}&limit=${LIMIT} `
         ).then((data) => {
            pageCounter++
            $page.innerHTML = pageCounter
            let temp = data.map((country) => TitleCountryCard(country)).join('')

            $container.innerHTML = temp
         })
      }
   }
})

$btnPrev.addEventListener("click", (e) => {
   e.preventDefault()
   if (pageCounter >= 1) {
      pageCounter--;

      if (pageCounter === 1) {
         $btnPrev.setAttribute("disabled", true)
         offsetCounter = 0;
         setData(`${api.main}?offset=${offsetCounter}&limit=${LIMIT}`).then(
            (data) => {
               $page.innerHTML = pageCounter
               let temp = data.map((country) => TitleCountryCard(country)).join('');

               $container.innerHTML = temp
            }
         );
      } else {
         setData(`${api.main}?offset=${offsetCounter -= LIMIT}&limit=${LIMIT}`).then(
            (data) => {
               $btnNext.removeAttribute('disabled')
               $page.innerHTML = pageCounter
               let temp = data.map((country) => TitleCountryCard(country)).join('')

               $container.innerHTML = temp
            }
         );
      }
   }
})

