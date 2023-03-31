
const $container = document.querySelector('.container')
const $continentSelect = document.querySelector("#continent-select")

const $prevPageBtn = document.querySelector('.prev_page')
const $nextPageBtn = document.querySelector('.next_page')
const $currentPage = document.querySelector(".counter_page")


const LIMIT = 24
const TOTAL_COUNTRYS = 250
const TOTAL_PAGES = Math.ceil(TOTAL_COUNTRYS / LIMIT)
let offset = 0
let page = 1

let result = []

let api = {
   main: 'https://restcountries.com/v3.1/all',
   detail: 'https://restcountries.com/v3.1/alpha/',
   region: 'https://restcountries.com/v3.1/region/'
}


window.addEventListener('DOMContentLoaded', () => {
   setData(api.main, offset)

   // Фильтрация стран
   $continentSelect.addEventListener("change", (e) => {
      const selectedContinent = $continentSelect.value
      setData(`${api.region}${selectedContinent}`), offset.then((data) => {
         let temp = data.map((country) => TitleCountryCard(country)).join('')
      })
   })
})

async function setData(url, offset) {
   try {
      if (!result.length) {
         const response = await fetch(url)
         result = await response.json()
      }

      $currentPage.innerHTML = page

      const slicedCountries = result.slice(offset, offset + LIMIT)
      const template = slicedCountries.reduce((acc, country) => acc + TitleCountryCard(country), '')

      $container.innerHTML = template

      // Проверка на первую page и неактивная кнопка назад 
      $prevPageBtn.disabled = page === 1

      // Проверка на последнию page и неактивная кнопка вперед 
      $nextPageBtn.disabled = offset + LIMIT >= result.length

   } catch (e) {
      console.error(e)
   }
}

// Получение всех стран
const setDataa = (url) => fetch(url).then((res) => {
   const result = res.json()
   $currentPage.innerHTML = page

   return result
})


// Функция для получения инфы о стране
const setInfoCountry = (cca3) => {
   setDataa(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(data => {
         $container.innerHTML = CardCountry(data)
      })
}

// Сами карточки (превью)
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

// Подробная инфа о стране
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
$nextPageBtn.addEventListener('click', () => {
   page++
   setData(api.main, offset += LIMIT)
})

$prevPageBtn.addEventListener('click', () => {
   page--
   setData(api.main, offset -= LIMIT)
})






// Pagination
// window.addEventListener("load", () => {
//    $currentPage.innerHTML = pageCounter
//    $prevPageBtn.setAttribute("disabled", true)
// });

// $nextPageBtn.addEventListener("click", (e) => {
//    e.preventDefault()
//    $prevPageBtn.removeAttribute("disabled")
//    if (pageCounter >= 1 && pageCounter <= TOTAL_PAGES) {
//       if (pageCounter === TOTAL_PAGES) {
//          $nextPageBtn.setAttribute("disabled", true)
//          setData(
//             `${api.main}?offset=${(offset += LIMIT)}&limit=${LIMIT}`
//          ).then((data) => {
//             pageCounter++
//             $currentPage.innerHTML = pageCounter
//             let temp = data.map((country) => TitleCountryCard(country)).join('')

//             $container.innerHTML = temp
//          })
//       } else {
//          setData(`${api.main}?offset=${(offset += LIMIT)}&limit=${LIMIT} `
//          ).then((data) => {
//             pageCounter++
//             $currentPage.innerHTML = pageCounter
//             let temp = data.map((country) => TitleCountryCard(country)).join('')

//             $container.innerHTML = temp
//          })
//       }
//    }
// })

// $prevPageBtn.addEventListener("click", (e) => {
//    e.preventDefault()
//    if (pageCounter >= 1) {
//       pageCounter--;

//       if (pageCounter === 1) {
//          $prevPageBtn.setAttribute("disabled", true)
//          offset = 0;
//          setData(`${api.main}?offset=${offset}&limit=${LIMIT}`).then(
//             (data) => {
//                $currentPage.innerHTML = pageCounter
//                let temp = data.map((country) => TitleCountryCard(country)).join('');

//                $container.innerHTML = temp
//             }
//          );
//       } else {
//          setData(`${api.main}?offset=${offset -= LIMIT}&limit=${LIMIT}`).then(
//             (data) => {
//                $nextPageBtn.removeAttribute('disabled')
//                $currentPage.innerHTML = pageCounter
//                let temp = data.map((country) => TitleCountryCard(country)).join('')

//                $container.innerHTML = temp
//             }
//          );
//       }
//    }
// })

