// Description: This file contains the functions to fetch the weather data from the open weather api
// and to store and get data from async storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config";
import { stringEnglish, stringSpanish } from "./translations";
import { Alert } from "react-native";

// function to show an alert if the city is not found
// this function is used in the fetchWeather function
const showAlert = (setCity, language) => {
  Alert.alert(
    // show the correct title and message based on the language setting
    language === "english"
      ? stringEnglish.errorTitle
      : stringSpanish.errorTitle,
    language === "english"
      ? stringEnglish.errorMessage
      : stringSpanish.errorMessage,
    [
      {
        text:
          language === "english"
            ? stringEnglish.errorButton
            : stringSpanish.errorButton,
        onPress: () => setCity(""),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      // when the alert is dismissed, set the city to an empty string
      // this will clear the input field since the city was wrong
      onDismiss: () => setCity(""),
    }
  );
};

// function to fetch the weather data from the open weather api
const fetchWeather = async (city, language, setCity, myCities, setMyCities) => {
  try {
    // fetch the weather data from the open weather api
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${
        config.API_KEY
      }&units=metric&lang=${
        // ternary operator to request data in the correct language based on the language setting
        // used for the weather description
        language === "english"
          ? stringEnglish.languageCode
          : stringSpanish.languageCode
      }`
    );
    // if the response is not ok, throw an error
    if (!response.ok) {
      // Remove the city from the list of cities if no result is found for it
      let newCities = myCities.filter((cityIter) => cityIter !== city);
      setMyCities(newCities);
      // if the response is 404, show an alert
      showAlert(setCity, language);
      // throw an error with the response status
      throw new Error(
        `Unable to fetch weather for ${city}. Response status: ${response.status}`
      );
    } else {
      // if the response is ok, return the data
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // if there is an error, return null
    console.error(error);
    return null;
  }
};

// function to store data in async storage using the key and value parameters
// this function is used in the SearchBar component to store the list of cities
// and in the Settings component to store the theme and language settings
const storeData = async (key, value) => {
  try {
    let values;
    key == "@myCities" && value
      ? (values = JSON.stringify(value))
      : (values = value);
    await AsyncStorage.setItem(key, values);
  } catch (e) {
    console.error(e);
  }
};

// function to get data from async storage using the key parameter and set the state
// this function is used in the App component to get the list of cities, theme and language settings
const getData = async (setTheme, setMyCities, setLanguage) => {
  try {
    const storedCities = await AsyncStorage.getItem("@myCities");
    const storedLanguage = await AsyncStorage.getItem("@language");
    const storedTheme = await AsyncStorage.getItem("@theme");

    storedTheme && setTheme(storedTheme);
    storedCities && setMyCities(JSON.parse(storedCities));
    storedLanguage && setLanguage(storedLanguage);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { fetchWeather, storeData, getData };
