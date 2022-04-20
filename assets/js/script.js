// set the modal menu element
const modalEl = document.getElementById('search-modal');
const btn = document.getElementById("search-btn");








// Global variables
var destination = ""
var date=""
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var globalLat = ""
var globalLon= ""
var dateSorted=""
var currentEvents=[]
var savedEvents= []


// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayContainer = document.querySelector('#today');
var todayLabel = document.querySelector('#today-label');
var forecastLabel = document.querySelector('#forecast-label');
var eventLabel = document.querySelector('#event-label');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');
var weather = document.querySelector('#weather');
var eventGrid = document.querySelector('#event-grid');
var sidebar = document.querySelector('#sidebar');
var sidebarContent = document.querySelector('#sidebarContent');
/* Weather API */
/* -------------------------------------------------------------------------------------------------------- */

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);



// Function to display the current weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather, timezone) {
  var date = dayjs().tz(timezone).format('M/D/YYYY');

  // Store response data from our fetch request in variables
  var tempF = weather.temp;
  var windMph = weather.wind_speed;
  var humidity = weather.humidity;
  var uvi = weather.uvi;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');
  var uvEl = document.createElement('p');
  var uviBadge = document.createElement('button');

  card.setAttribute('class', 'p-5 flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 justify-center  border-2 border-black');/* ALL CARD ELEMENTS CLASSES */
  cardBody.setAttribute('class', 'flex flex-col');
  card.append(cardBody);

  heading.setAttribute('class', 'font-bold text-xl mb-2');
  tempEl.setAttribute('class', 'text-gray-700 text-base');
  windEl.setAttribute('class', 'text-gray-700 text-base');
  humidityEl.setAttribute('class', 'text-gray-700 text-base');

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'w-1/3 place-self-center');
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(weatherIcon, heading, tempEl, windEl, humidityEl);

  uvEl.textContent = 'UV Index: ';
  uviBadge.classList.add('btn', 'btn-sm');

  if (uvi < 3) {
    uviBadge.classList.add('btn-success');
  } else if (uvi < 7) {
    uviBadge.classList.add('btn-warning');
  } else {
    uviBadge.classList.add('btn-danger');
  }

  uviBadge.textContent = uvi;
  uvEl.append(uviBadge);
  cardBody.append(uvEl);

  todayLabel.innerHTML="<h2>Today's Forecast</h2>"
  todayContainer.innerHTML = "";
  todayContainer.append(card);
}

// Function to display a forecast card given an object from open weather api
// daily forecast.
function renderForecastCard(forecast, timezone) {
  // variables for data from api
  var unixTs = forecast.dt;
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.temp.day;
  var { humidity } = forecast;
  var windMph = forecast.wind_speed;

  // Create elements for a card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute('class', 'my-5 h-fit flex flex-col max-w-sm rounded overflow-hidden justify-center grow');
  col.classList.add('five-day-card');
  card.setAttribute('class', ' h-fit m-auto p-5 flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 justify-center grow  border-2 border-black');
  cardBody.setAttribute('class', 'flex flex-col');
  cardTitle.setAttribute('class', 'font-bold text-xl mb-2');
  tempEl.setAttribute('class', 'text-gray-700 text-base');
  windEl.setAttribute('class', 'text-gray-700 text-base');
  humidityEl.setAttribute('class', 'text-gray-700 text-base');

  // Add content to elements
  cardTitle.textContent = dayjs.unix(unixTs).tz(timezone).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'm-auto');
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(col);
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast, timezone) {
  // Create unix timestamps for start and end of 5 day forecast
  var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
  var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

  forecastLabel.innerHTML="<h2>5-Day Forecast:</h2>";
  var headingCol = document.createElement('div');

  headingCol.setAttribute('class', 'col-12');

  forecastContainer.innerHTML = '';
  forecastContainer.append(headingCol);
  for (var i = 0; i < dailyForecast.length; i++) {

    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      renderForecastCard(dailyForecast[i], timezone);
    }
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.current, data.timezone);
  renderForecast(data.daily, data.timezone);
}


function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  console.log(lat)
  globalLat = lat
  globalLon= lon
  console.log(globalLat,globalLon)
  findEvents();
  var city = location.name;
  var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
  console.log(apiUrl)
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        destination=''
        saveDestination();
        alert('Location not found');
      } else {

        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleSearchFormSubmit(e) {
  // Don't continue if there is nothing in the search form
  if (destination==="" || date==='') {
    return;
  }
console.log('here')
  fetchCoords(destination);
}



/* Ticketmaster API */
/* ------------------------------------------------------------------------------------------------------------------------------------ */

var findEvents = function(){
    if(dateSorted===""){
        var url="https://app.ticketmaster.com/discovery/v2/events.json?geoPoint="+globalLat+","+globalLon+"&size=16&sort=distance,date,asc&apikey=8UdWWSAEfJjf1RGj4bqCNcwoMkxqFtFR"    
    }
    else{
        var url="https://app.ticketmaster.com/discovery/v2/events.json?geoPoint="+globalLat+","+globalLon+"&startDateTime="+dateSorted+"&size=16&sort=distance,date,asc&apikey=8UdWWSAEfJjf1RGj4bqCNcwoMkxqFtFR"
    }
    console.log(url)
    fetch(url)
    .then(function(response) {
    // request was successful
    if (response.ok) {
        response.json().then(function(data) {
            console.log(data);
            displayEvents(data);
        });
    } else {
        alert('Error: GitHub User Not Found');
    }
    })
    .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
    });
}

var displayEvents= function(data){
    if (data.length === 0) {
        return;
    }
    eventLabel.innerHTML="<h2>Events in the Area</h2>";
    console.log("working...");
    for (var i = 0; i < data._embedded.events.length; i++) {
    
        var eventID= data._embedded.events[i].id;
        var eventURL = data._embedded.events[i].url;
        var eventName = data._embedded.events[i].name;
        var eventImg = data._embedded.events[i].images[6].url
        var eventDateTime = data._embedded.events[i].dates.start.dateTime;
        var eventTime = data._embedded.events[i].dates.start.localTime;
        var eventDate = data._embedded.events[i].dates.start.localDate;
        var card = document.createElement('div');
        var cardImage = document.createElement('img');
        var cardTitle = document.createElement('div');
        var cardTime = document.createElement('p');
        var cardDate = document.createElement('p');
        var cardButtons = document.createElement('div');
        var cardSave= document.createElement('button');
        var cardVisit= document.createElement('button');

        
        
        card.setAttribute('class', ' h-1/8 m-5 flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 justify-center grow  border-2 border-black xs:w-1/2 sm:w-1/3 md:w-1/4 ');
        card.setAttribute('id', 'event'+i);
        cardTitle.setAttribute('class', 'p-2 font-bold text-xl mb-2');
        cardButtons.setAttribute('class', 'p-2 font-bold text-xl mb-2');
        cardTime.setAttribute('class', 'p-2 text-gray-700 text-base');
        cardDate.setAttribute('class', 'p-2 text-gray-700 text-base');
        cardSave.setAttribute('class', 'p-2 w-1/3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm');
        cardSave.setAttribute('id', 'saveEvent'+i);
        cardVisit.setAttribute('class', 'mt-3 p-2 w-1/3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm');
        cardVisit.setAttribute('id', 'visitCurrentEvent'+i);

        // Add content to elements
        cardTitle.textContent = eventName
        cardImage.setAttribute('src', eventImg);
        cardImage.setAttribute('class', 'shrink grow w-full h-1/3 border-b-2 border-black');
        cardDate.textContent = 'Event Date: '+eventDate;
        cardTime.textContent = 'Start Time: '+eventTime;
        cardSave.textContent = `Save`;
        cardVisit.textContent = `Visit`;

        cardButtons.append(cardVisit, cardSave);

        card.append(cardImage, cardTitle,cardDate, cardTime, cardButtons);
        
        eventGrid.append(card);
        tempArray= {
            cardId: "event"+i,
            id: eventID,
            url: eventURL,
            image:eventImg,
            name: eventName,
            date: eventDate,
            time: eventTime,
        };
        currentEvents.push(tempArray);
        console.log(currentEvents);
}}

var saveEvents = function(){
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
}

var saveDestination = function(){
    localStorage.setItem("destination", JSON.stringify(destination));
}

var saveDate = function(){
  localStorage.setItem("date", JSON.stringify(date));
}

var retrieveEvents = function(){
    savedEvents=JSON.parse(localStorage.getItem("savedEvents"));
    if (savedEvents===null){
        savedEvents=[];
    }
};

var retrieveDestination = function(){
    destination=JSON.parse(localStorage.getItem("destination"));
    if (destination===null){
        destination="";
    }
};

var retrieveDate = function(){
  date=JSON.parse(localStorage.getItem("date"));
  if (date===null){
      date="";
  }
};

var createSaved = function(){
  for(i=0; i<savedEvents.length; i++){
    var event=savedEvents[i];
    var eventID= event.id;
    var eventURL = event.url;
    var eventName = event.name;
    var eventImg = event.image
    var eventTime =event.time;
    var eventDate = event.date;
    var card = document.createElement('div');
    var cardImage = document.createElement('img');
    var cardTitle = document.createElement('div');
    var cardTime = document.createElement('p');
    var cardDate = document.createElement('p');
    var cardButtons = document.createElement('div');
    var cardDelete= document.createElement('button');
    var cardVisit= document.createElement('button');

    
    
    card.setAttribute('class', ' h-1/8 my-5 mx-auto flex flex-col max-w-sm rounded overflow-hidden shadow-lg shadow-black/50 bg-gray-200 justify-center grow  border-2 border-black w-9/10 ');
    card.setAttribute('id', 'event'+i);
    cardTitle.setAttribute('class', 'p-2 font-bold text-xl mb-2');
    cardButtons.setAttribute('class', 'p-2 font-bold text-xl mb-2');
    cardTime.setAttribute('class', 'p-2 text-gray-700 text-base');
    cardDate.setAttribute('class', 'p-2 text-gray-700 text-base');
    cardDelete.setAttribute('class', 'p-2 w-1/3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm');
    cardDelete.setAttribute('id', 'deleteEvent'+i);
    cardVisit.setAttribute('class', 'mt-3 p-2 w-1/3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm');
    cardVisit.setAttribute('id', 'visitSavedEvent'+i);

    // Add content to elements
    cardTitle.textContent = eventName
    cardImage.setAttribute('src', eventImg);
    cardImage.setAttribute('class', 'shrink grow w-full h-1/3 border-b-2 border-black');
    cardDate.textContent = 'Event Date: '+eventDate;
    cardTime.textContent = 'Start Time: '+eventTime;
    cardDelete.textContent = `Delete`;
    cardVisit.textContent = `Visit`;

    cardButtons.append(cardVisit, cardDelete);

    card.append(cardImage, cardTitle,cardDate, cardTime, cardButtons);
    
    sidebarContent.append(card);

  }
}


/* Other Stuff */
/* ------------------------------------------------------------------------------------------------------ */
var buttonHandler = function(event){
    var targetEL= event.target;
    var targetID= $(targetEL).attr('id');
    if(targetID.includes('save')){
        cardIndex=targetID.replace('saveEvent','')
        numSaved= savedEvents.length
        var eventObj = currentEvents[cardIndex];
        eventObj.cardId=numSaved;
        savedEvents.push(eventObj);
        saveEvents();
    }
    else if( targetID.includes('visit')){
      if(targetID.includes('Current')){
        cardIndex=targetID.replace('visitCurrentEvent','')
        url=currentEvents[cardIndex].url;
        window.open(url, '_blank');
      }
      else if(targetID.includes('Saved')){
        cardIndex=targetID.replace('visitSavedEvent','')
        url=savedEvents[cardIndex].url;
        window.open(url, '_blank');
      }
    }
    else if( targetID.includes('delete')){
      cardIndex=targetID.replace('deleteEvent','')
      savedEvents.splice(cardIndex,1)
      saveEvents();
      removeAllChildNodes(sidebarContent);
      createSaved();
      
  }
};

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

var initialize = function(){
  retrieveDestination();
  retrieveEvents();
  retrieveDate();
  if(date==='' || destination===''){
    return
  }
  var dateMo = date.substr(0, 2);
  var dateDay = date.substr(3, 2);
  var dateYr = date.substr(6, 9);
  dateSorted= dateYr+"-"+dateMo+"-"+dateDay+"T00:00:01Z"
  handleSearchFormSubmit();
  weather.style.display='block'
}

$('#search-btn').click(function(){
    modalEl.style.display='block'
    $('#modalDate, #modalDestination').val("");
    
}
)

$('#openSaved').click(function(){
  createSaved();
  sidebar.style.display='block'
  
}
)

$('#closeSaved').click(function(){
  removeAllChildNodes(sidebarContent);
  sidebar.style.display='none'
  
}
)

$('#reset-btn').click(function(){
    removeAllChildNodes(document.querySelector('#today-label'));
    removeAllChildNodes(document.querySelector('#today'));
    removeAllChildNodes(document.querySelector('#event-grid'));
    document.querySelector('#forecast-label').innerHTML="";
    document.querySelector('#event-label').innerHTML="";
    removeAllChildNodes(document.querySelector('#forecast'));
    weather.style.display='none'
    destination='';
    saveDestination();
    dateSorted='';
    date='';
}
)


$('#search-modal #modal-canel-btn').click(function(){
    modalEl.style.display='none'
}
)

$('#search-modal #modal-search-btn').click(function(){
    destination=$('#modalDestination').val();
    date= $('#modalDate').val().trim();
    if(destination===""){
        modalEl.style.display='none';
        return
    }
    saveDestination();
    saveDate();
    handleSearchFormSubmit();
    modalEl.style.display='none';
    weather.style.display='block'
    
    console.log(date)
    var dateMo = date.substr(0, 2);
    var dateDay = date.substr(3, 2);
    var dateYr = date.substr(6, 9);
    dateSorted= dateYr+"-"+dateMo+"-"+dateDay+"T00:00:01Z"
    console.log(date, dateYr,dateMo,dateDay)
}
)

$("#modalDate").datepicker({
    minDate: 1
  });

document.addEventListener("click", buttonHandler);

initialize();