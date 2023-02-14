// Description: This component displays the weather details for a city
import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Button,
} from "react-native";
import { stringEnglish, stringSpanish } from "../lib/translations";
import { lightTheme, darkTheme } from "../lib/themes";
import styled from "styled-components/native";
import Toggles from "./Toggles";

const WeatherDetails = ({
  theme,
  weatherData,
  toggleTheme,
  navigation,
  index,
  language,
  toggleLanguage,
}) => {
  const cityWeather = weatherData[index];

  // if the weather data is not loaded yet, display a loading message
  if (!cityWeather) {
    return (
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <Text>
          Loading{"\n"} weather data{"\n"}-----{"\n"}maybe try again
        </Text>
      </ImageBackground>
    );
  }

  // destructure the weather data
  // if the data is not available, set it to null
  // this is to avoid errors when the data is not available
  const { name, weather, main, wind } = cityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const tempMin = main ? Math.round(main.temp_min) : null;
  const tempMax = main ? Math.round(main.temp_max) : null;
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
          <AppTitle>Lovely Weather 🌡️</AppTitle>
          <Toggles
            toggleTheme={toggleTheme}
            toggleLanguage={toggleLanguage}
            language={language}
            theme={theme}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <DetailedForecastContainer>
              <CityView>
                <DetailsRow>
                  <CityName>{name}</CityName>
                  <CityTempView>
                    {weather && (
                      <ApiImg
                        source={{
                          //Using format from  https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
                          uri: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </CityTempView>
                </DetailsRow>
                <DetailsRow>
                  <CityDegrees>{temp}°C</CityDegrees>
                  <Description>{weather && weather[0].description}</Description>
                </DetailsRow>
                <DetailsRow>
                  <DetailsView>
                    <Subtitle>
                      {/* display the correct string based on the language */}
                      {language === "english"
                        ? stringEnglish.feelsLike
                        : stringSpanish.feelsLike}
                    </Subtitle>
                    <Details>{feelsLike}°C</Details>
                  </DetailsView>
                  <DetailsView>
                    <Subtitle>
                      {language === "english"
                        ? stringEnglish.humidity
                        : stringSpanish.humidity}
                    </Subtitle>
                    <Details>{humidity}%</Details>
                  </DetailsView>
                </DetailsRow>
                <DetailsRow>
                  <DetailsView>
                    <Subtitle>
                      {language === "english"
                        ? stringEnglish.tempMin
                        : stringSpanish.tempMin}
                    </Subtitle>
                    <Details>{tempMin}°C</Details>
                  </DetailsView>
                  <DetailsView>
                    <Subtitle>
                      {language === "english"
                        ? stringEnglish.tempMax
                        : stringSpanish.tempMax}
                    </Subtitle>
                    <Details>{tempMax}°C</Details>
                  </DetailsView>
                </DetailsRow>
                <DetailsRow>
                  <DetailsView>
                    <Subtitle>
                      {language === "english"
                        ? stringEnglish.rain
                        : stringSpanish.rain}
                    </Subtitle>
                    <Details>{rain} MM</Details>
                  </DetailsView>
                  <DetailsView>
                    <Subtitle>
                      {language === "english"
                        ? stringEnglish.wind
                        : stringSpanish.wind}
                    </Subtitle>
                    <Details>{windSpeed}m/s</Details>
                  </DetailsView>
                </DetailsRow>
              </CityView>
            </DetailedForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

// styled components for the weather details
const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
`;

const AppTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 25px;
  color: ${({ theme }) => theme.text};
`;

const CityName = styled.Text`
  padding: 10px;
  margin: 10px;
  font-size: 30px;
  font-weight: bold;
  align-self: center;
  color: ${({ theme }) => theme.text};
`;

const CityTempView = styled.View`
  padding: 5px;
  margin: 10px 0px;
  width: 100px;
`;

const ApiImg = styled.Image`
  width: 80px;
  height: 80px;
`;

const CityDegrees = styled.Text`
  padding: 5px;
  font-size: 22px;
  text-align: center;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
  padding: 5px;
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const DetailsRow = styled.View`
  flex-direction: row;
  margin: 10px;
  border-width: 1px;
  border-radius: 15px;
  border-color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.background};
  padding: 8px;
  justify-content: space-around;
  margin-bottom: 5px;
`;

const DetailedForecastContainer = styled.View`
wi
  margin: 20px 10px;
`;

const CityView = styled.View`
  padding: 20px;
  border-radius: 20px;
`;

const DetailsView = styled.View`
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

export default WeatherDetails;
