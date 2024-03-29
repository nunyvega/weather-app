// Description: This component is used to search for a city and add it to the list of cities
import styled from "styled-components/native";
import { stringEnglish, stringSpanish } from "../lib/translations";

const SearchBar = ({ city, setCity, setMyCities, language }) => {
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
      <CitySearch
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
  padding: 20px;
  margin-bottom: 10px;
`;

const CitySearch = styled.TextInput`
  background-color: ${({ theme }) => theme.contrastBackground};
  opacity: 0.8;
  height: 50px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export default SearchBar;
