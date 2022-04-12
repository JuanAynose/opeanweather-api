let key_id = "---";
const cardForecast = document.getElementById("card__forecast")
const button = document.getElementById("uwu")
const listContainer = document.getElementById("forecast__container")

listContainer.addEventListener("click", (e)=>{
   if(e.target.classList=="content__item"){
      e.target.nextElementSibling.classList.toggle("hidden")
      e.target.children[2].children[1].classList.toggle("active")
   }
})


const date = new Date();
const [month, day]       = [date.getMonth(), date.getDate()];
const [hour, minutes] = [date.getHours(), date.getMinutes()];

let monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
let weakNames= ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

window.addEventListener("load", ()=>{
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=argentina&units=metric&lang=sp&appid=${key_id}`)
  .then(res=>res.ok ? Promise.resolve(res) : Promise.reject(res))
  .then(res=> res.json())
  .then(res =>{
    let countryName = cardForecast.children[0].children[1].textContent=res.name;
    let descriptionTime = cardForecast.children[0].children[2].textContent=`Se siente como ${res.main.feels_like}°C. Descripción: ${res.weather[0].description}`
    forecastFuture(res.coord.lat,res.coord.lon,);
    let tempNow = cardForecast.children[1].children[0].children[1].textContent=Math.round(res.main.temp)+"°C"
    let windSpeed = cardForecast.children[1].children[1].children[0].children[0].textContent=res.wind.speed;
    let humidity = cardForecast.children[1].children[1].children[1].children[0].textContent=res.main.humidity;
    let visibility = cardForecast.children[1].children[1].children[2].children[0].textContent= res.visibility/1000
    let clouds = cardForecast.children[1].children[1].children[3].children[0].textContent= res.clouds.all;
  })
  let timeToday = cardForecast.children[0].children[0].textContent=`${monthNames[month]} ${day}, ${hour}:${minutes}`
    
})

/*call target direct, just if i use the of geoapi*/
let timeFuture=[];
let iconsTime = [];

let fragment = document.createDocumentFragment();
const forecastFuture = (lat,lon,id) =>{
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${key_id}`)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
      let count=0;
      for(const iconMarker of res.daily){
        let imageuwu = document.createElement("img")
        timeFuture.push(iconMarker.weather[0].icon)
        fetch(`assets/icons/${iconMarker.weather[0].icon}.png`)
          .then(res => res.blob())
          .then(blob=>{
            const objectURL = URL.createObjectURL(blob);
            if(count==0) image.src=objectURL;
            listContainer.children[count].children[0].children[1].children[0].src=objectURL;
            listContainer.children[count].children[1].children[0].children[0].src=objectURL;
            imageuwu.src=objectURL;
            fragment.append(imageuwu)   
          count+=1;
          })
      }
      
      forecastCardFuture(res)
      let count__aux=0;
      let daySpecific = new Date().getDay();
      let month = new Date().getMonth();

      /*this give the day/month correct to the future forecast*/
      for(let i=0; i<8; i++){
        listContainer.children[i].children[0].children[2].children[0].textContent=res.daily[i].weather[0].description;
        let monthCount = day+i;
        listContainer.children[i].children[0].children[0].children[0].children[1].textContent=`${monthNames[month]} ${monthCount}`; 

        let plusCount = daySpecific+count__aux;

        if(plusCount>6){
          count__aux=0;
          listContainer.children[i].children[0].children[0].children[0].children[0].textContent=weakNames[count__aux]
          daySpecific=0;
        }else{listContainer.children[i].children[0].children[0].children[0].children[0].textContent=weakNames[plusCount]}
        
        count__aux+=1;
      } 
    })
    
}

let temperatureFuture__day=[];
let temperatureFuture__next=[];
const forecastCardFuture =(res) => {
  for(const tempfuture of res.daily){
    temperatureFuture__next.push(tempfuture.feels_like)
    temperatureFuture__day.push(tempfuture.temp)
  }
  asingWeather(res)
}

const asingWeather = (res) =>{
  let table__topSide = listContainer.children[0].children[1].children[2].children[1].children[0];
  let table__bottomSide = listContainer.children[0].children[1].children[2].children[1].children[1];
  let count=0;
  for(const varHelper of listContainer.children){
    /*temperature info top side row*/
    varHelper.children[1].children[2].children[1].children[0].children[1].textContent=temperatureFuture__day[count].morn+"°C";
    varHelper.children[1].children[2].children[1].children[0].children[2].textContent=temperatureFuture__day[count].day+"°C";
    varHelper.children[1].children[2].children[1].children[0].children[3].textContent=temperatureFuture__day[count].eve+"°C";
    varHelper.children[1].children[2].children[1].children[0].children[4].textContent=temperatureFuture__day[count].night+"°C";

    /*temperature info bottom side row*/
    varHelper.children[1].children[2].children[1].children[1].children[1].textContent=temperatureFuture__next[count].morn+"°C";
    varHelper.children[1].children[2].children[1].children[1].children[2].textContent=temperatureFuture__next[count].day+"°C";
    varHelper.children[1].children[2].children[1].children[1].children[3].textContent=temperatureFuture__next[count].eve+"°C";
    varHelper.children[1].children[2].children[1].children[1].children[4].textContent=temperatureFuture__next[count].night+"°C";

    /*give advanced stats to forecast future*/
    listContainer.children[count].children[1].children[1].children[0].children[0].textContent=res.daily[count].humidity;
    listContainer.children[count].children[1].children[1].children[1].children[0].textContent=Math.round(res.daily[count].dew_point);
    /*temperature max/min middle card*/
    let roundNumber__low=Math.round(temperatureFuture__day[count].min);
    let roundNumber__max=Math.round(temperatureFuture__day[count].max);

    varHelper.children[1].children[0].children[1].children[0].textContent=res.daily[count].weather[0].description;
    varHelper.children[1].children[0].children[1].children[1].textContent=`La temp maxima será ${roundNumber__max}°C, y la menor ${roundNumber__low}°C`;

    

    varHelper.children[0].children[1].children[1].textContent=` ${roundNumber__max} / ${roundNumber__low}°C`
    
    count+=1;
  }

}
/*
        // console.log(dayReal+count__aux)

  // for(let i = 0; i<temperatureFuture__day.length; i++) asingWeather()

console.log("se siente como",res.daily[0].feels_like)

console.log("temperatura maxima",res.daily[0].temp.max)
      console.log("temperatura minima",res.daily[0].temp.min)
      console.log("humedad",res.daily[0].humidity)
      console.log("velocidad viento",res.daily[0].wind_speed,"km/h")
      console.log("nubes",res.daily[0].clouds,"%")
      console.log(`Se siente como ${res.daily[0]}°C. Descripción: ${res}`)
      console.log(res.daily[0])

      console.log("fecha del pronostico",itemClone.children[0].children[0].children)
      console.log("icon forecast",itemClone.children[0].children[1].children[0])
      console.log("temperatura max/min list item",itemClone.children[0].children[1].children[1])
      console.log("today descripcion",itemClone.children[0].children[2].children[0])
      console.log(res.daily[0].weather[0].description)
*/

/*
let help= itemClone.cloneNode(true)
        fragment.append(help)
        let image = help.children[1].children[0];
      listContainer.append(fragment)




 const objectURL = URL.createObjectURL(blob)
            help.children[1].children[0].src=objectURL;
            console.log(objectURL)
            console.log(help.children[1].children[0])
*/


 // let icon = "10d";
  // console.log(icon)
  // fetch(`https://openweathermap.org/img/wn/${icon}@2x.png`)
  //   .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
  //   .then(res => res.blob())
  //   .then(blob => {
  //     console.log(blob)
  //     // const objectURL = URL.createObjectURL(blob);
  //     // return image.src=objectURL;
  //   })