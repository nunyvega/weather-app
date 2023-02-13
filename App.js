import React, { useEffect, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Alert,
  Button,
} from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import config from "./config";
import bgImgDark from "./assets/dark.jpeg";
import bgImgLight from "./assets/light.jpeg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const lightTheme = {
  background: 'rgba(255, 255, 255, 0.5)',
  contrastBackground: "white",
  title: "palevioletred",
  text: "black",
  bgImage: bgImgLight,
};

const darkTheme = {
  background: 'rgba(0, 0, 0, 0.5)',
  contrastBackground: "black",
  title: "white",
  text: "white",
  bgImage: bgImgDark,
};

const stringEnglish = {
  home: "Home",
  detailedWeather: "Detailed Weather",
  feelsLike: "Feels like",
  high: "High",
  humidity: "Humidity",
  low: "Low",
  wind: "Wind",
  rain: "Rain",
  errorTitle: "Error finding city",
  errorMessage: "The city you are looking for is not found. Please try again.",
  errorButton: "Cancel",
  toggleTheme: "Toggle Theme to ",
  toggleLanguage: "Toggle Language to 🇪🇸",
  NoWeatherToShow: `No weather to show.${"\n"} Add your first city!`,
};

const stringSpanish = {
  home: "Inicio",
  detailedWeather: "Clima detallado",
  feelsLike: "Se siente como",
  high: "Alto",
  humidity: "Humedad",
  low: "Bajo",
  wind: "Viento",
  rain: "Lluvia",
  errorTitle: "Error al encontrar la ciudad",
  errorMessage: "La ciudad que busca no se encuentra. Por favor, inténtelo de nuevo.",
  errorButton: "Cancelar",
  toggleTheme: "Cambiar tema a ",
  toggleLanguage: "Cambiar idioma a 🇬🇧",
  NoWeatherToShow: `No hay clima para mostrar.${"\n"} Agregue su primera ciudad!`,
};

const Stack = createStackNavigator();

const App = () => {
  const [city, setCity] = useState("Paris");
  const [myCities, setMyCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [theme, setTheme] = useState("light");
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setWeatherData([]);
    myCities.forEach((city) => {
      fetchWeather(city);
    });
    storeData('@myCities', myCities);
  }, [myCities]);

  const toggleLanguage = () => {
    storeData('@language', language === "english" ? "spanish" : "english");
    setLanguage(language === "english" ? "spanish" : "english");
  };

  const storeData = async (key, value) => {
    try {
      let values;
      key == '@myCities' && value ? values = JSON.stringify(value) : values = value;
      await AsyncStorage.setItem(key, values);
      console.log('stored values in async storage'+ key + values)
    } catch (e) {
      console.log('cagao')
    }
  };

  const getData = async () => {
    try {
      const storedCities = await AsyncStorage.getItem("@myCities");
      const storedLanguage = await AsyncStorage.getItem("@language");
      const storedTheme = await AsyncStorage.getItem("@theme");

      storedTheme && setTheme(storedTheme);
      storedCities && setMyCities(JSON.parse(storedCities));
      storedLanguage && setLanguage(storedLanguage);

    } catch (e) {
      return null;;
    }
  };

  const showAlert = () => {
    Alert.alert(
      language === "english" ? stringEnglish.errorTitle : stringSpanish.errorTitle,
      language === "english" ? stringEnglish.errorMessage : stringSpanish.errorMessage,
      [
        {
          text: language === "english" ? stringEnglish.errorButton : stringSpanish.errorButton,
          onPress: () => setCity(""),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => setCity(""),
      }
    );
  };

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}&units=metric`
      );
      if (!response.ok) {
        let newcities = myCities.filter((cityIter) => cityIter !== city);
        setMyCities(newcities);
        throw new Error(
          `Unable to fetch weather for ${city}. Response status: ${response.status}`
        );
      } else {
        const data = await response.json();
        setWeatherData((prevData) => [...prevData, data]);
      }
    } catch (error) {
      console.error(error);
      showAlert();
    }
  };

  const toggleTheme = () => {
    storeData('@theme', theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerMode: 'screen',
          headerTintColor: theme === "light" ? lightTheme.text : darkTheme.text,
          headerStyle: { backgroundColor: theme === "light" ? lightTheme.contrastBackground : darkTheme.contrastBackground },
        }}
        >
          <Stack.Screen name="Home"
          options={{ title: language==="english" ? stringEnglish.home : stringSpanish.home}}
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
          <Stack.Screen name="WeatherDetails"
          options={{ title: language==="english" ? stringEnglish.detailedWeather : stringSpanish.detailedWeather
          }}>
            {({navigation}) => (
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

const Home = ({
  city,
  setCity,
  setMyCities,
  setIndex,
  weatherData,
  toggleTheme,
  navigation,
  theme,
  language,
  toggleLanguage,
}) => {
  const handlePress = (weatherData, localIndex, setIndex) => {
    setIndex(localIndex);
    navigation.navigate({ name: "WeatherDetails"});
  };


  return (
    <Container>
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppTitle>Lovely Weather 🌡️</AppTitle>
          <TogglesContainer>
          <ToggleLanguageButton onPress={toggleLanguage}>
            <ToggleLanguageButtonText>
              {language === "english" ? stringEnglish.toggleLanguage : stringSpanish.toggleLanguage }
            </ToggleLanguageButtonText>
          </ToggleLanguageButton>
          <ToggleThemeButton onPress={toggleTheme}>
            <ToggleThemeButtonText>
              {language === "english" ? stringEnglish.toggleTheme : stringSpanish.toggleTheme }
              {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}
            </ToggleThemeButtonText>
          </ToggleThemeButton>
          </TogglesContainer>
          <ForecastSearch
            city={city}
            setCity={setCity}
            setMyCities={setMyCities}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <ForecastContainer>
              {weatherData.length ? (
                weatherData.map((data, localIndex) => (
                  <CityForecastContainer
                    key={localIndex}
                    onPress={() => handlePress(data, localIndex, setIndex)}
                  >
                    <CityForecast
                      cityWeather={data}
                      setMyCities={setMyCities}
                      index={localIndex}
                    />
                  </CityForecastContainer>
                ))
              ) : (
                <NoWeather>
                  {language === "english" ? stringEnglish.NoWeatherToShow : stringSpanish.NoWeatherToShow}
                  {"\n"} 🌙 ❄️ ☔️ 🌈 🌤️
                </NoWeather>
              )}
            </ForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

const WeatherDetails = ({ theme, weatherData, toggleTheme, navigation, index, language, toggleLanguage }) => {

  const cityWeather = weatherData[index];
  if (!cityWeather) {
    return (<Text>No weather data available</Text>);
  }

  const { name, weather, main, wind } = cityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const low = main ? Math.round(main.temp_min) : null;
  const high = main ? Math.round(main.temp_max) : null;
  const humidity = main ? main.humidity : null;
  const windSpeed = wind ? wind.speed : null;
  const rain = cityWeather.rain ? cityWeather.rain : 0;
  
  return (
    <Container>
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppTitle>
            Lovely Weather 🌡️
          </AppTitle>
          <TogglesContainer>
          <ToggleLanguageButton onPress={toggleLanguage}>
            <ToggleLanguageButtonText>
            {language === "english" ? stringEnglish.toggleLanguage : stringSpanish.toggleLanguage }
              </ToggleLanguageButtonText>
          </ToggleLanguageButton>
          <ToggleThemeButton onPress={toggleTheme}>
            <ToggleThemeButtonText>
            {language === "english" ? stringEnglish.toggleTheme : stringSpanish.toggleTheme }
            {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}            </ToggleThemeButtonText>
          </ToggleThemeButton>
          </TogglesContainer>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            
            <ForecastContainer>
            <CityView>
      <CityName>{name}</CityName>
      <CityTempView>
        {weather && (
          <WeatherIcon
            source={{
              uri: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
            }}
            resizeMode={"contain"}
          />
        )}
        <CityDegrees>{temp}°C</CityDegrees>
      </CityTempView>
      <Description>{weather && weather[0].description}</Description>
      <DetailedInfoContainer>
        <Row>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.feelsLike : stringSpanish.feelsLike}
              </Subtitle>
            <Details>{feelsLike}°C</Details>
          </DetailsBox>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.low : stringSpanish.low}
            </Subtitle>
            <Details>{low}°C</Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.high : stringSpanish.high}
            </Subtitle>
            <Details>{high}°C</Details>
          </DetailsBox>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.wind : stringSpanish.wind}
            </Subtitle>
            <Details>{windSpeed}m/s</Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.humidity : stringSpanish.humidity}
            </Subtitle>
            <Details>{humidity}%</Details>
          </DetailsBox>
          <DetailsBox>
            <Subtitle>
              {language === "english" ? stringEnglish.rain : stringSpanish.rain}
            </Subtitle>
            <Details>{rain} MM</Details>
          </DetailsBox>
        </Row>
      </DetailedInfoContainer>
    </CityView>
              
            </ForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

const ForecastSearch = ({ city, setCity, setMyCities }) => {
  const handleSubmit = () => {
    // don't store duplicate values, only store unique values
    setMyCities((prevCities) =>
      [...prevCities, city].filter(
        (city, index, self) => self.indexOf(city) === index
      )
    );
  };

  return (
    <ContainerSearch>
      <SearchCity
        onChangeText={setCity}
        value={city}
        placeholder={"Search for your city"}
        onSubmitEditing={handleSubmit}
      />
    </ContainerSearch>
  );
};


const CityForecast = ({ cityWeather, setMyCities, index }) => {
  const { name, weather, main, wind } = cityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const low = main ? Math.round(main.temp_min) : null;
  const high = main ? Math.round(main.temp_max) : null;
  const humidity = main ? main.humidity : null;
  const windSpeed = wind ? wind.speed : null;
  const rain = cityWeather.rain ? cityWeather.rain : 0;

  const handleDelete = () => {
    setMyCities((prevCities) => prevCities.filter((_, i) => i !== index));
  };

  return (
    <CityView>
      <CityName>{name}</CityName>
      <CityTempView>
        {weather && (
          <WeatherIcon
            source={{
              uri: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
            }}
            resizeMode={"contain"}
          />
        )}
        <CityDegrees>{temp}°C</CityDegrees>
      </CityTempView>
      <Description>{weather && weather[0].description}</Description>
      <CloseButton onPress={handleDelete}>
        <CloseButtonText>X</CloseButtonText>
      </CloseButton>
    </CityView>
  );
};

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.contrastBackground};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin:20px;
  right:0;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

const CityForecastContainer = styled.TouchableOpacity`
  margin: 10px;
  width: auto;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ContainerSearch = styled.View`
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchCity = styled.TextInput`
  height: 40px;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.Text `
font-size: 32px; color: ${({ theme }) =>theme.title}; margin: 10px;`;

const ForecastContainer = styled.View`
  margin: 10px;
`;

const CityView = styled.View`
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
`;

const CityName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const CityTempView = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const CityDegrees = styled.Text`
  font-size: 48px;
  font-weight: bold;
  margin-left: 10px;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const DetailedInfoContainer = styled.View`
  margin: 10px 0;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const DetailsBox = styled.View`
  align-items: center;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const NoWeather = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 50%;
  color: ${({ theme }) => theme.text};
`;

const TogglesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
  display:flex;
`;

const ToggleThemeButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleThemeButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const ToggleLanguageButton = styled.TouchableOpacity`
flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleLanguageButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const AppTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 25px;
  color: ${({ theme }) => theme.text};
`;
export default App;