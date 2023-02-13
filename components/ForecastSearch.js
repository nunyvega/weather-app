// Description: This component is used to search for a city and add it to the list of cities
import styled from "styled-components/native";
import { stringEnglish, stringSpanish } from "../translations";

const ForecastSearch = ({ city, setCity, setMyCities, language }) => {
  // handle the submit event of the search input
  const handleSubmit = () => {
    // add the city to the list of cities
    // don't store duplicate values, only store unique values
    setMyCities((prevCities) =>
      [...prevCities, city].filter(
        (city, index, self) => self.indexOf(city) === index
      )
    );
  };

  // return the search input component, add placeholder text based on the language
  return (
    <ContainerSearch>
      <SearchCity
        onChangeText={setCity}
        value={city}
        placeholder={
          language === "english"
            ? stringEnglish.searchPlaceholder
            : stringSpanish.searchPlaceholder
        }
        onSubmitEditing={handleSubmit}
      />
    </ContainerSearch>
  );
};

// styled components for the forecast search component
const ContainerSearch = styled.View`
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchCity = styled.TextInput`
  background-color: ${({ theme }) => theme.contrastBackground};
  opacity: 0.6;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  font-color: ${({ theme }) => theme.text};
`;

export default ForecastSearch;
