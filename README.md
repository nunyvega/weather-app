# Lovely Weather App

Lovely Weather is a mobile app that makes it easy to check the weather in different cities around the world. Whether you're planning a trip or just want to keep up with the weather in your favorite cities, Lovely Weather is a great way to stay informed.


## Features
- Search for cities and get basic weather information
- Add new cities and remove existing ones from the list
- Customize the app with language and theme options
- Get detailed weather information for specific cities


## Technologies Used
- React Native
- Expo
- OpenWeather API
- @react-native-async-storage/async-storage
- @react-navigation/native
- @react-navigation/stack


## Getting Started
To install and run the app, first install
- iOS simulator and 
- Android studio
- Node
- NPM
- Expo

Then follow these steps:

1- Clone the repository to your local machine.
```
git clone https://github.com/nunyvega/weather-app.git
```

2- Install the dependencies by running the following command:
```
npm install
```

3- Create a .env file in the root directory and add your OpenWeather API key to it. For example:
```
API_KEY=your-api-key
```
You can then import/export this key.

4- Start the app by running the following command:
```
expo start
```
This will start the Expo development server, and you'll be prompted to open Android/iOS/web. From there, you can choose to run the app in an iOS or Android simulator or scan the QR code to run it on your mobile device.

Note: You will need to have an emulator or a device to run the app. You can follow the instructions on the Expo website to set up the development environment on your machine.


## Screenshots
<img src="https://example.com/homepage.png" alt="Lovely Weather Homepage" style="width: 50%; height: auto;">
<p style="text-align: center; font-style: italic;">The Lovely Weather homepage</p>
<img src="https://example.com/weather-details.png" alt="Lovely Weather Weather Details Page" style="width: 50%; height: auto;">
<p style="text-align: center; font-style: italic;">The Lovely Weather weather details page</p>


## Customization Options - Language Toggle
The language toggle allows you to switch between English and Spanish language options. When you switch between languages, the UI and the weather information provided by the API will also change accordingly.

## Customization Options -Theme Toggle
The theme toggle allows you to switch between light and dark themes. This changes the color of the components, text, and background of the app. It also changes the color of the menu using ThemeProvider and styling the Stack Navigator. Both the language and theme options are also persistent, and they are saved using async storage.


## Styling
Lovely Weather uses styled-components for styling. The styles for each component are defined in their own file, and then imported into the component as needed. This makes it easy to keep the styles organized and maintainable.


## Future Work
In the future, I plan to add more customization options to the app, such as the ability to change the units for temperature and wind speed. I also plan to add more detailed weather information, such as the chance of rain and humidity. If you have any suggestions for features you'd like to see in the app, please let me know!
