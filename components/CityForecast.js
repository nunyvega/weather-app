// Description: This component is used to display the forecast for a city
import styled from "styled-components/native";

const CityForecast = ({ cityWeather, setMyCities, index }) => {
  // destructure the data we need from the cityWeather object
  // if the data is not available, set it to null
  // this is to avoid errors when the data is not available
  // Round values
  const { name, weather, main, wind } = cityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const tempMin = main ? Math.round(main.temp_min) : null;
  const tempMax = main ? Math.round(main.temp_max) : null;
  const humidity = main ? main.humidity : null;
  const windSpeed = wind ? wind.speed : null;
  const rain = cityWeather.rain ? cityWeather.rain : 0;

  // handle delete button press to remove city from list
  const handleDelete = () => {
    setMyCities((prevCities) => prevCities.filter((_, i) => i !== index));
  };

  // return the city forecast
  return (
    <CityView>
      <CityTempView>
        {weather && (
          <WeatherIcon
            source={{
              // use the icon code from the weather object to get the icon, more info in:
              // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
              uri: `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`,
            }}
            resizeMode={"contain"}
          />
        )}
        <CityName>{name}</CityName>
      </CityTempView>
      <CityTempView>
        <CityDegrees>{temp}°C</CityDegrees>
        <Description>{weather && weather[0].description}</Description>
      </CityTempView>
      <CloseButton onPress={handleDelete}>
        <CloseButtonText>X</CloseButtonText>
      </CloseButton>
    </CityView>
  );
};

// styled components for the city forecast component
const CityView = styled.View`
  padding: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
`;

const CityTempView = styled.View`
  margin-right: 20px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const WeatherIcon = styled.Image`
  width: 60px;
  height: 60px;
`;

const CityName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const CityDegrees = styled.Text`
  font-size: 22px;
  font-weight: bold;
  align-self: center;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.text};
  justify-content: center;
  text-align: center;
  self-align: center;
`;

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.contrastBackground};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin: 10px;
  right: 0;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

export default CityForecast;
