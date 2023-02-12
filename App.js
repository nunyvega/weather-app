import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, ImageBackground, View, Text, Alert } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import config from "./config";
import bgImgDark from "./assets/dark.jpeg";
import bgImgLight from "./assets/light.jpeg";

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

const App = () => {
  const [city, setCity] = useState("Toronto");
  const [myCities, setMyCities] = useState(["Frankfurt"]);
  const [weatherData, setWeatherData] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setWeatherData([]);
    myCities.forEach((city) => {
      fetchWeather(city);
    });
  }, [myCities]);

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
        // remove city from myCities if the city is not found
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
      <Container>
      <ImageBackground 
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage } 
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Title>Weather App</Title>
          <ToggleThemeButton onPress={toggleTheme}>
          <ToggleThemeButtonText>Toggle theme</ToggleThemeButtonText>
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
            <FutureForecastContainer>
              {weatherData.length ? (
                weatherData.map((data, index) => (
                  <CityForecast
                    key={index}
                    CityWeather={data}
                    setMyCities={setMyCities}
                    index={index}
                  />
                ))
              ) : (
                <NoWeather>
                  No Weather to show, Add your first fav city!
                </NoWeather>
              )}
            </FutureForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  </ThemeProvider>
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

const CityForecast = ({ CityWeather, setMyCities, index }) => {
  const { name, weather, main, wind } = CityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const low = main ? Math.round(main.temp_min) : null;
  const high = main ? Math.round(main.temp_max) : null;
  const humidity = main ? main.humidity : null;
  const windSpeed = wind ? wind.speed : null;
  const rain = CityWeather.rain ? CityWeather.rain : 0;

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
      <SecondaryInfoContainer>
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
      </SecondaryInfoContainer>
      <CloseButton onPress={handleDelete}>
        <CloseButtonText>X</CloseButtonText>
      </CloseButton>
    </CityView>
  );
};

const Title = styled.Text`
  font-size: 25px;
  text-align: center;
  color: ${props => props.theme.title};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const NoWeather = styled.Text`
  text-align: center;
  color: ${props => props.theme.text};
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContainerSearch = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
`;

const SearchBy = styled.View`
  display: flex;
  flex-direction: row;
  color: ${props => props.theme.background};
  margin-top: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  max-width: 700px;
`;

const SearchCity = styled.TextInput`
  height: 50px;
  margin: 12px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 15px;
  border-radius: 10px;
  width: 95%;
  max-width: 700px;
`;

const CityView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CityTempView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MainInfoContainer = styled.View`
`;

const Description = styled.Text`
color: ${props => props.theme.text};
font-size: 15px;
  text-transform: capitalize;
`;

const SecondaryInfoContainer = styled.View`
  background-color: ${props => props.theme.background};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 10px;
  width: 95%;
  max-width: 478px;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const CityName = styled.Text`
  color: ${props => props.theme.text};
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

const CityDegrees = styled.Text`
  color: ${props => props.theme.text};
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 60px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  color: ${props => props.theme.background};
`;

const DetailsBox = styled.View`
  display: flex;
`;

const Label = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.text};
`;

const Details = styled.Text`
  color: ${props => props.theme.text};
  font-size: 15px;
  text-transform: capitalize;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: ${props => props.theme.background};
  padding: 5px 10px;
  border-radius: 10px;
`;

const CloseButtonText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 20px;
`;

const ToggleThemeButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px; 
  top: 60px;
  background-color: ${props => props.theme.background};
  padding: 5px 10px;
  border-radius: 10px;
`;

const ToggleThemeButtonText = styled.Text`
  color: ${props => props.theme.text};
  font-size: 10px;
`;

export default App;
