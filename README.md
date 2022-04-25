# event-planner
# Project 1: Front-End Website
## Summary
As a user I am looking to plan a day in a city. This app uses the Ticketmaster APi and the Openweather API to bring you the weather for the day and a five day forecast 
along with the the next 16 Ticketmaster events in that city, allw=owing you to plan which events to attend based on the upcoming weather. 

## Steps and Process
### Wireframing
This process began with basic wireframing. the initial wireframing gave a rough estimate of the layout which allowed me to create the beginning HTML.  
Even though the wireframing is not exactly the same as the end result, it provided enough context to start. Along the way as the different processes were established  the HTMl layout was changed to have a better and more seamless flow.

### HTML
The next step was to outline the website with HTML. There were a few issues when starting like arranging the HTML to accommodate the seach modal and saved events popout.
Along with this  elements needed to be setup for all the dynamically generated HTML pieces.

### Javascript
Javascript was the longest and most tedious section. It took a lot of effort to learn how the data the Ticketmaster returned was structured. Along with the use of the APIs the popout saved events tab was a new experience for me to tackle. A few other challenges I ran into along the way were:  
-Modal useage  
-API return timing  
-data structuing  
-event card indexing  
and a few other smaller challenges that took some time and effort to debug.

### CSS
Within this project CSS posed a unique challenge becasue of the use of a new framework: Tailwind. This has a number of similarities to Bootstrap, however the flex and grid options changed the interaction between the HTML and the final look of the website. 

## Features
-HTML layout adapts to screen size  
-Search modal with date selection  
-Add/remove events to a saved events list
-Store most recent search and saved events in local storage

## Future Additions
This app was meant to be a day planner for event scheduling. When you go to an event, typically you plan your entire day around that event, so the next additions would be the addition of food, drinks, and local attractions in the city you search in order to provide more information and options to the user. Also allowing the user to create custom saved lists for their saved events. Following that implementing drag and drop for the saved events, allowing the user to organize their saved events would be a good addition to the UI.

## Links
[Repository Link](https://github.com/ecarlson0123/event-planner)  
[Deployed Website](https://ecarlson0123.github.io/event-planner/)  
