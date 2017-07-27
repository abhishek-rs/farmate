# Farmate
##### (powered by [NASA World Wind](https://worldwind.arc.nasa.gov/) - built for the [NASA Europa Challenge 2017](http://www.nasaeuropachallenge.com/))
![NASA Logo](https://github.com/abhishek-rs/farmate/blob/master/public/NASA_logo.png)

## Table of contents

1. [Introduction](https://github.com/abhishek-rs/farmate#introduction)
2. [How to Launch]()
3. [Theoretical Background]()
4. [Backend]()   
    a. [Introduction]()   
    b. [Dependencies]()       
    c. [Functions]()   
      i. [Update]()    
      ii. [Predict]()

5. [APIs]()
6. [Database]()    
   a. [Structure]()
7. [Connection]()
8. [Front-end client]()  
   a. [Planning]()   
   b. [User research]()   
   c. [Design]()   
   d. [Implementation]()

9. [Limitations & Future Work]()

10. [Acknowledgements]()

11. [References]()


## Introduction
70% of all freshwater worldwide is used for irrigation practices. Of this roughly 45% is used for the irrigation of ricefields. Due to freshwater shortage that already exists and is predicted to get worse we decided to develop Farmate. Farmate is a platform built on [NASA World Wind](https://worldwind.arc.nasa.gov/) for the [NASA Europa Challenge](http://www.nasaeuropachallenge.com/). 

Farmate is a platform, helping farmers to keep track of the water levels on their field which can help to save the water on irrigation.

### Key features include:

* Dashboard listing all fields owned by the user
* Charts in the dashboard about each field with water level, rainfall and water losses metrics 
* Recommendation for how much each field should be irrigated
* Weather widget with the daily forecast, helping to plan the farming actions for the day
* World Wind component displaying all the fields owned by the user and others registered in the system visually.
* New fields can be added to the dashboard and the map via new field page.
* About page with information about the project and some tips and instructions.

Farmate has a python based backend which employs various mathematical models to predict the current water level. A variety of APIs are used to get the necessary data with regards to soil and weather. The frontend is based on react.js, improving the app speed and providing an intuitive interface for the farmer. 

## How to Launch:
The client is hosted online [here.](https://farmate-f4c81.firebaseapp.com)
This will provide all functionalities except running the update script when the user updates the data on a field. 
As we use a web scraper to get historical rainfall information, we had trouble hosting and scheduling a daily job on our update script on free hosting platforms like PythonAnywhere, as they usually don’t white label those sites for access. 

If you would like to see the update script in action, you can run the instance locally. To do this follow the steps below. You will need to have node, npm, python 2.7 and pip installer on your computer. 
1. Clone the repo 
> git clone https://github.com/abhishek-rs/farmate.git
> cd farmate
2. Install node dependencies 
> npm install 
3. Install python dependencies
> pip install -r ./update_script/requirements.txt
4. Start the flask server that creates a RESTful API for the client to access
> python ./update_script/main.py

This will start the flask server on the current terminal. 

5. Open a new terminal or a new tab on the terminal. 

6. Change directory to project folder ‘farmate’. Run the client.
> npm start 

You should be able to see the same client hosted on firebase now running locally. It will access the update api when you perform updates on your field.


## Theoretical Background
70% of all freshwater in the world is used for irrigations practices [1]. Of this, 45% is used for irrigating rice paddies [2]. For this reason we decided to focus on implementing our MVP for irrigation of rice fields specifically. However, the models employed can be extended to different types of crops.  

Khepar et al. [3] offer an elaborate model to calculate the water level at a given time in a field. Although the overall formula is deceivingly simple, the separate components are not. 

The water level on a given day is as follows:

> HP<sub>J</sub> = HP<sub>J-1</sub> + RF<sub>J</sub> + IR<sub>J</sub> - ET<sub>J</sub> - DP<sub>J</sub> - RO<sub>J</sub>  (1)

HP<sub>J</sub> = is the ponding depth (water height) on day J, given in cm
RF<sub>J</sub> = is the rainfall on day J, in cm
IR<sub>J</sub> = is the irrigation applied on day J, in cm
ET<sub>J</sub> = Is the crop evotranspiration (cm), this is both the water that evaporated as well as water taken in by the crop. 
DP<sub>J</sub> = Depth percolation on day J, the water that is lost through the ground (cm)
RO<sub>J</sub> = Run Off, surface runoff on day J (cm)

The model is run every 24 hours, at the end of everyday. It takes into account the different factors that were relevant during the day. HP, is therefore the water height at the end of day J. 

For DP a simplified model and a constant was used based on the granularity of the ground. For the model suggested in the paper a significant amount of measurements on location were needed. The farmer and our team would not have been able to do this, due to accuracy and specific machinery that is needed, therefore we decided to make an approximation. The impact of this is present, though limited. 

The ET also uses a simplified model. Our model is based on the Modified Penman Method, however, it does not take the different stages of the crop into account. Again this was due to similar reasons, in a research environment this can be easily measured. However, the model is not capable of assuming. 

## Backend

### Introduction
The backend is completely in python. This language was chosen for its excellent webdeployment, the documentation and community is extremely active as well as that we were familiar with it. We hope by making the backend python, it will be easier pick-up by other people who want to continue on our work. 

It calls a variety of APIs to get, mainly weather related, data needed for the model described earlier. The data is used to update the water level on the fields as well as to predict the water level over the next five days. We use a firebase database to keep track of all values for each rice field. Pyrebase is used as an interface with our database. Furthermore we use flask to create all callable APIs for the front-end. In this chapter we will discuss the different functions in the back end and show a flowchart on how they are related. After that we will discuss the different APIs we used. Finally we will explain the structure of our database. 

### Dependencies
fao_eto (included)
Requests (standard with python >= 2.7)
time (standard with python >= 2.7)
Re (standard with python >= 2.7)
datetime
pyrebase
urllib
flask

## Functions
The backend consists of two major parts. First of all there is the update half of the backend. This uses historical data of what happened during the day to update the history arrays, as well as predict the current water level. 

The second half is the prediction. This uses the current data as well as weather forecasts to predict the water level, seepage, evapotranspiration and rainfall for the next five days. In this, it is assumed that that the farmer does not irrigate. 

### Update

The flowchart shows the input and outputs for each function, as well as how they are related to each other. This is a global explanation of the flowchart. 

![Update flowchart](https://github.com/abhishek-rs/farmate/blob/master/public/farmate/update.png)

The update has three ways to be called. Per field, for all fields of a user and for all fields in the database. This respectively requires field_id, user_id or no input. In all cases this triggers the function get_field_data. This connects to the database and retrieves all relevant data. The update all fields should be run once every 24 hours, and only once.  

From here, three separate function are called. The first function is used to calculate the water seepage through the ground (depthperlocation). In the current version this is based on the user input of how granular the ground is. This can be extended to a relevant API, as well as have a more sophisticated algorithm, as suggested in Water Balance Model [3]. 

The second function uses the [fao_eto library](http://pyeto.readthedocs.io/en/latest/) that is included to calculate evapotranspiration. This uses various inputs, such as humidity, temperature and wind speed to calculate the amount of water that is evaporated and taken up by plants. We get this data from the [darksky API](https://darksky.net/dev/docs/). 

Finally, we get the rain, since this is a paid feature for almost all APIs. We use regular expression to parse the darksky webpage, which shows the relevant data. In the future this should become an API for more robustness and accuracy. 

These three inputs are combined with desired and critical depth charts, as well as the height of the dike (embankment) around the field to calculate the new water level (HP) at the end of the previous day. How this is done can be found in the flowchart.

Finally all data is pushed again to the database.         

### Predict
The flowchart shows the input and outputs for each function, as well as how they are related to each other. This is a global explanation of the flowchart. 	

![Predict flowchart](https://github.com/abhishek-rs/farmate/blob/master/public/farmate/predict.png)

The predict half is extremely similar as the update half. However, it makes use of predictions for the next five days in order to predict the future water level. In its essence this is the most relevant for the farmers, since this allows them to schedule their irrigation more optimally.

The prediction can be called in three different ways. Per field, per user or for all fields. In each case the water level, rainfall, depth percolation and evapotranspiration are predicted for the next five days. This uses roughly the same function as the update half, only it requires a date in the future input (1 being tomorrow, 2 being the day after tomorrow, etc.). For both the rainfall as well as the evapotranspiration. 

We loop the prediction for the next 5 days, starting at tomorrow. We use the outputs of the previous day as input for the next day.

The certainty of our prediction, however, is dependent on the accuracy of the weather forecast provided by the API we are using.
APIs
The main API in the backend is for weather prediction and historical weather data. We use darksky for this. It allows for many free API calls, as well as providing clear and accurate data. For historical data we scrape their website, since this is not a free feature. 

Another API that has been under our consideration was [soilgrids](https://rest.soilgrids.org/). They promoted themselves as a worldwide soil data RESTful api. However, after implementation it proved to not be reliable enough, it was offline without notice as well as not worldwide. Hence it was decided to drop this from our final product. However, we are keeping track on similar services for future implementation. 


## Database

We are using firebase by google as our database. In this we keep track of our users and fields. We connect with the database in our backend with the help of pyrebase. A library for easy communication with firebase. The data base contains all data from the fields and users, with 30 day history. 

On the user side we save the user's data, such as email. But most importantly we save also a list of field_ids that belong to that user. We use this for the predict/user_fields function. 

On the field side we save a lot of different types of data. From the coordinates that are used to draw the field on worldwind, towards a prediction of water level. Below is a graphic that show our database structure, as well as all components in it.  

### Database Structure

![Database structure](https://github.com/abhishek-rs/farmate/blob/master/public/farmate/database.png)

## Connection
To connect the frontend with the backend we used the Flask library for python. This allows us to change python functions into RESTful APIs that we can call in our frontend. Hence we have four different RESTful calls the frontend can make:

> /api/update/single_field/<field_id>

> /api/update/user_field/<user_id>

> /api/update/all_fields

> /api/predict/single_field/<field_id>

> /api/predict/user_field/<user_id>

> /api/predict/all_fields

In practice the /update/single_field and /update/user_field are never used. This is because we should only update once a day. This is done with calling update/all_fields accordingly.

With regards to prediction, we use /predict/user_field on a user login, as well as when an user updates the fields. /predict/all_fields is never used, except for testing purposes. This is because of the amount of computation required.

## Front-end client 
We decided to use ReactJS to build the client application as we had a fair bit of experience in building web apps using it from our earlier work. As we knew WorldWind would be a major  part of the client we wanted to explore possibilities to incorporate WorldWind in React’s component based structure and hook up react’s selective rendering to improve the app’s performance on the browser while still using WorldWind and most of its features. 

### Planning
We started off by listing our key features and discussing what would be the best way to let the user make full use of all these features - 
* Create and manage your fields. 
* Monitor key statistics about your field. 
* Check up on fields in your vicinity and world wide to see how your fellow farmers are doing.  
* Get calculated daily information on how much water you should supply to each of your registered fields based on various factors mentioned earlier. 

### User research
We validated our plans and design ideas by starting discussions in farming forums: ozfarmer.com.au and thefarmingforum.co.uk. One of the important things that came out there was the importance of having access to the most relevant information about each field easily. 

Based on the feedback we go from the mentor and the interaction we had with farmers on farming forums we decided to display the following - 
* Current water level in the field and the predicted water level for the next week. 
* Rainfall (past and future) 
* Major factors if water losses (Evaporation, Seepage and Run-off)

### Design
We set about designing the application based on these features and the information we had access to based on the backend implementation and data sources. We looked at several options of  incorporating all this information onto worldwind and settled for a way that would be the easiest for the user to consume.

Our design uses WorldWind’s map capabilities and uses the ability to plot lines and polygon’s to enable the user to draw his field on the globe and monitor it effortlessly. WorldWind is surrounded by widgets on either sides that are influenced by user’s interaction with WorldWind and vice versa. We will discuss the views in detail in the next section.  

The data is displayed to the user predominantly using interactive charts. We wanted to minimize the amount of cognitive load on the user and decided that irrigation to be done today would be the only number we would directly put on the dashboard. All the other above discussed data is displayed as area charts. 

### Implementation
One of the first challenges we had to tackle was using WorldWind as a full fledged react component that takes props, has states and rerenders based on the change in these values. As we would be using WorldWind in two major functionalities i.e drawing new fields and displaying existing fields we started off by creating two versions of the WorldWind react components that support each of these functions. 

Most of the input and form components in the application are build using PrimeReact components. The charts are built using ReCharts, another excellent react component library based on D3.js. We’ll discuss most of views and their composition briefly in the next section.   
The app currently has four major UI screens - 
1. **Login/Register screen** - Here we use Firebase’s authentication system to register new users and allow existing users to login to the application. 

2. **About page** - Here we provide details about what purpose the application serves and how to use it. This also serves as our landing page to provide information to new users. 

3. **Create new field** -  We use a different worldwind component called create world wind to allow the user to draw fields using WorldWind’s Path object. The new field form expects the user to enter the following data about a field. We have tried to make the terms user friendly by using tool-tips to explain what each of the fields mean.  

    * Name of field
    * Area of the field *(in hectares)*
    * Dike height *(in cms)*
    * Current water level *(in cms)* 
    * Soil type *(from clay to fine sand)* 
    * Crop type *(currently we support only rice but we believe the service can be easily extended to other crops in the future)* 
    * Date of planting 
    * Date of irrigation 

After these are entered the user plots the field and creates it. 

4. **Main Dashboard** - This is our key view which enables the user to monitor his fields, look at neighbouring fields and see useful data about them. 
The view mainly consists of three parts.

* The **display WorldWind component** serves as the background while providing options to select fields and look around the globe. We use worldwind polygon objects to draw the fields. The user can click to pick various fields and this renders appropriate data on the right section. The three components are synchronized through shared states, so that all the three components are always aware of which field is currently selected.   

* The **left panel** consists of a weather widget that fetches data from the Apixu API, this displays the weather in the current location of the user. Besides this we have a field display widget that showcases all of the current user’s fields and some information about them. All these are clickable and on click the relevant field is highlighted on the WorldWind and a detail view of the field’s current and future statistics is displayed on the right panel. 

* The **right panel** is the detail view for the field data. It consists of three charts displaying the field’s historical and predicted data with respect to water level, rainfall and water losses (evaporation, seepage and run-off). Besides these, we also provide information on how much the user needs to irrigate today and this is a toggle switch that the user can change when he completes irrigation and the database will get updated with the new data. 

* The **Update modal** - Besides the above views we also have a modal to allow users to update irrigation done on previous days or correct field water level if the information being displayed by the service is incorrect.  
    
## Limitations & Future Work

In the current implementation there are some significant limitations. First of all our mathematical model, although accurate is not the most accurate model. We let the the user adjust the water level accordingly, and this solves the symptoms but not the problem. There are several better solutions to this problem. First of all we could implement more accurate models, especially with evapotranspiration and depth percolation this can cause a significant improvement, however inaccuracies will remain. A second solution, one that most likely would cause better results, is to learn from the users correction. When correlating the user’s adjustments with past data, in this way we can adjust depth percolation and evapotranspiration on a field by field basis. However, this would require some hefty adjustments on the backend.

Another limitation is that the desired and critical water level is currently hard-coded and limited to rice. This differs per location and crop type. Hence this should be adjustable by the user in future iterations. This is something that cannot be universal world-wide.     

From the user interface side, a future improvement could be adding the possibility to edit current fields, especially if possibility to have more than one crop type was added in the future. In addition, the possibility to remove field from the map or choose which of his fields the user would like to be visible to his neighbours could be introduced. Nevertheless, we make the current possibilities of the system very clear to the user prior registering to farmate in the about page as well as the principle of collaboration and sharing the information with neighbours upon which this system was built on.

## Acknowledgements 
We would like to thank our mentor Matti Kummu. Since we are all HCI students he has been a true help in understanding agriculture and pointing us to to right directions. 

## References

[1] https://www.ifad.org/topic/facts_figures/overview

[2] http://irri.org/blogs/bas-bouman-s-blog-global-rice-science-partnership/does-rice-really-use-too-much-water 

[3] Water Balance Model for rice paddy fields under intermittent irrigation practices (2002)
