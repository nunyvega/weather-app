import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Alert,
  Button,
} from "react-native";
import { stringEnglish, stringSpanish } from "../translations";
import { lightTheme, darkTheme } from "../themes";
import styled from "styled-components/native";

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
  if ( !cityWeather) {
    return (
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <Text
          style={{
            fontSize: 50,
            color: "white",
            textAlign: "center",
            marginTop: 140,
          }}
        >
          Loading{"\n"} weather data{"\n"}-----{"\n"}maybe try again
        </Text>
      </ImageBackground>
    );
  }

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
          <TogglesContainer>
            <ToggleLanguageButton onPress={toggleLanguage}>
              <ToggleLanguageButtonText>
                {language === "english"
                  ? stringEnglish.toggleLanguage
                  : stringSpanish.toggleLanguage}
              </ToggleLanguageButtonText>
            </ToggleLanguageButton>
            <ToggleThemeButton onPress={toggleTheme}>
              <ToggleThemeButtonText>
                {language === "english"
                  ? stringEnglish.toggleTheme
                  : stringSpanish.toggleTheme}
                {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}{" "}
              </ToggleThemeButtonText>
            </ToggleThemeButton>
          </TogglesContainer>
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
                    <WeatherIcon
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

                <DetailedInfoContainer>
                  <DetailsRow>
                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.feelsLike
                          : stringSpanish.feelsLike}
                      </Subtitle>
                      <Details>{feelsLike}°C</Details>
                    </DetailsBox>
                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.humidity
                          : stringSpanish.humidity}
                      </Subtitle>
                      <Details>{humidity}%</Details>
                    </DetailsBox>
                  </DetailsRow>
                  <DetailsRow>
                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.tempMin
                          : stringSpanish.tempMin}
                      </Subtitle>
                      <Details>{tempMin}°C</Details>
                    </DetailsBox>

                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.tempMax
                          : stringSpanish.tempMax}
                      </Subtitle>
                      <Details>{tempMax}°C</Details>
                    </DetailsBox>
                  </DetailsRow>
                  <DetailsRow>
                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.rain
                          : stringSpanish.rain}
                      </Subtitle>
                      <Details>{rain} MM</Details>
                    </DetailsBox>
                    <DetailsBox>
                      <Subtitle>
                        {language === "english"
                          ? stringEnglish.wind
                          : stringSpanish.wind}
                      </Subtitle>
                      <Details>{windSpeed}m/s</Details>
                    </DetailsBox>
                  </DetailsRow>
                </DetailedInfoContainer>
              </CityView>
            </DetailedForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
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
  font-size: 44px;
  font-weight: bold;
  align-self: center;
  color: ${({ theme }) => theme.text};
`;

const CityTempView = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
  height: 100px;
`;

const WeatherIcon = styled.Image`
  width: 80px;
  height: 80px;
`;

const CityDegrees = styled.Text`
  font-size: 40px;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
font-size: 40px;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;  color: ${({ theme }) => theme.text};
`;

const DetailedInfoContainer = styled.View`
  margin: 10px 0;
`;

const DetailsRow = styled.View`
  margin: 10px 0;
  border-width: 1px;
  border-radius: 20px;
  border-color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 5px;
`;

const TogglesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
  display: flex;
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

const DetailedForecastContainer = styled.View`
  margin: 40px 10px;
  padding: 10px;
`;

const CityView = styled.View`
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
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

export default WeatherDetails;
