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
  background: "dodgerblue",
  title: "palevioletred",
  text: "black",
  bgImage: bgImgLight,
};

const darkTheme = {
  background: "black",
  title: "white",
  text: "white",
  bgImage: bgImgDark,
};

const Stack = createStackNavigator();

const App = () => {
  const [city, setCity] = useState("Toronto");
  const [myCities, setMyCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    getData().then((value) => {
      setMyCities(value);
    });
  }, []);

  useEffect(() => {
    setWeatherData([]);
    myCities.forEach((city) => {
      fetchWeather(city);
    });
    storeData(myCities);
  }, [myCities]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@myCities", jsonValue);
    } catch (e) {
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@myCities");
      if (value !== null) {
        return [];
      }
    } catch (e) {
      return [];
    }
    return value;
  };

  const showAlert = () => {
    Alert.alert(
      "Error finding city",
      "The city you are looking for is not found. Please try again.",
      [
        {
          text: "Cancel",
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
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <Home
                city={city}
                setCity={setCity}
                setMyCities={setMyCities}
                weatherData={weatherData}
                toggleTheme={toggleTheme}
                navigation={navigation}
                theme={theme}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="WeatherDetails">
            {({navigation}) => (
              <WeatherDetails
                theme={theme}
                weatherData={weatherData}
                toggleTheme={toggleTheme}
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
  weatherData,
  toggleTheme,
  navigation,
  theme
}) => {
  const handlePress = (weatherData, index) => {
    navigation.navigate({ name: "WeatherDetails", params: { cityWeather: weatherData, index: index  }});
};


  return (
    <Container>
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Title>Weather App</Title>
          <ToggleThemeButton onPress={toggleTheme}>
            <ToggleThemeButtonText>
              Toggle theme {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}
            </ToggleThemeButtonText>
          </ToggleThemeButton>
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
                weatherData.map((data, index) => (
                  <CityForecastContainer
                    key={index}
                    onPress={() => handlePress(data, index)}
                  >
                    <CityForecast
                      cityWeather={data}
                      setMyCities={setMyCities}
                      index={index}
                    />
                  </CityForecastContainer>
                ))
              ) : (
                <NoWeather>
                  No Weather to show.{"\n"}
                  Add your first fav city to get started!{"\n"}
                  {"\n"}
                  🌙 ❄️ ☔️ 🌈 🌤️
                </NoWeather>
              )}
            </ForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

const WeatherDetails = ({ theme, weatherData, toggleTheme, index }) => {

  const cityWeather = weatherData[0];
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
  console.log('the cityweather is');
  console.log(`the city name is ${cityWeather.name}`);
  
  return (
    <Container>
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Title>Detailed weather</Title>
          <ToggleThemeButton onPress={toggleTheme}>
            <ToggleThemeButtonText>Toggle theme</ToggleThemeButtonText>
          </ToggleThemeButton>
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
            <Label>Feels like</Label>
            <Details>{feelsLike}°C</Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Low</Label>
            <Details>{low}°C</Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Label>High</Label>
            <Details>{high}°C</Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Wind</Label>
            <Details>{windSpeed}m/s</Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Label>Humidity</Label>
            <Details>{humidity}%</Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Rain</Label>
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
  background-color: ${({ theme }) => theme.title};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

const CityForecastContainer = styled.TouchableOpacity`
  margin: 10px;
  width: auto;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
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
  background-color: ${({ theme }) => theme.title};
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

const Label = styled.Text`
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

const ToggleThemeButton = styled.TouchableOpacity`
  width: 160px;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.text};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleThemeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.background};
`;

export default App;