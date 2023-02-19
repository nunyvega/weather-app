// Description: This is the main component of the app. 
// It is the root component of the app and contains the navigation and the theme provider.
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { stringEnglish, stringSpanish } from "./lib/translations";
import { lightTheme, darkTheme } from "./lib/themes";
import Home from "./components/Home";
import WeatherDetails from "./components/WeatherDetails";
import { fetchWeather, storeData, getData } from "./lib/apiFunctions";

// create the stack navigator to navigate between the home and weather details screens
const Stack = createStackNavigator();

const App = () => {
  const [city, setCity] = useState("");
  const [myCities, setMyCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [theme, setTheme] = useState("light");
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState("english");

  // get the data from async storage when the app starts
  useEffect(() => {
    getData(setTheme, setMyCities, setLanguage);
  }, []);

  // fetch the weather data for each city in myCities when myCities changes
  useEffect(() => {
    setWeatherData([]);
    const promises = myCities.map(city =>
      fetchWeather(city, language, setCity, myCities, setMyCities)
    );
    // Using this method to guarantee that cities are rendered in the order they were added
    Promise.all(promises)
      .then(results => {
        // Filter out any null values
        const orderedData = results.filter(Boolean);
        setWeatherData(orderedData);
      })
      .catch(error => {
        console.error(error);
        // Handle error as needed
      });
    storeData("@myCities", myCities);
  }, [myCities, language]);

  // toggle the language between english and spanish and store the language in async storage
  const toggleLanguage = () => {
    storeData("@language", language === "english" ? "spanish" : "english");
    setLanguage(language === "english" ? "spanish" : "english");
  };

  // toggle the theme between light and dark mode and store the theme in async storage
  const toggleTheme = () => {
    storeData("@theme", theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {/*pass the theme to the theme provider and stack navigator*/}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerMode: "screen",
            headerTintColor:
              theme === "light" ? lightTheme.text : darkTheme.text,
            headerStyle: {
              backgroundColor:
                theme === "light"
                  ? lightTheme.contrastBackground
                  : darkTheme.contrastBackground,
            },
          }}
        >
          {/*pass the props to the home and weather details screens*/}
          <Stack.Screen
            name="Home"
            options={{
              title:
                language === "english"
                  ? stringEnglish.home
                  : stringSpanish.home,
            }}
          >
            {({ navigation }) => (
              <Home
                city={city}
                myCities={myCities}
                setCity={setCity}
                setMyCities={setMyCities}
                weatherData={weatherData}
                toggleTheme={toggleTheme}
                navigation={navigation}
                theme={theme}
                setIndex={setIndex}
                language={language}
                toggleLanguage={toggleLanguage}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="WeatherDetails"
            options={{
              title:
                language === "english"
                  ? stringEnglish.detailedWeather
                  : stringSpanish.detailedWeather,
            }}
          >
            {({ navigation }) => (
              <WeatherDetails
                navigation={navigation}
                theme={theme}
                weatherData={weatherData}
                toggleTheme={toggleTheme}
                index={index}
                language={language}
                toggleLanguage={toggleLanguage}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;