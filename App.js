import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { stringEnglish, stringSpanish } from "./translations";
import { lightTheme, darkTheme } from "./themes";
import Home from "./components/Home";
import WeatherDetails from "./components/WeatherDetails";
import { fetchWeather, storeData, getData } from "./apiFunctions";

const Stack = createStackNavigator();

const App = () => {
  const [city, setCity] = useState("Add your city here");
  const [myCities, setMyCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [theme, setTheme] = useState("light");
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    getData(setTheme, setMyCities, setLanguage);
  }, []);

  useEffect(() => {
    setWeatherData([]);
    myCities.forEach((city) => {
      fetchWeather(city, language, myCities, setMyCities, setWeatherData, setCity);
    });
    storeData("@myCities", myCities);
  }, [myCities]);

  const toggleLanguage = () => {
    storeData("@language", language === "english" ? "spanish" : "english");
    setLanguage(language === "english" ? "spanish" : "english");
  };

  const toggleTheme = () => {
    storeData("@theme", theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
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