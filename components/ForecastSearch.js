import styled from "styled-components/native";

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

const ContainerSearch = styled.View`
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchCity = styled.TextInput`
  height: 50px;
  border: 3px solid ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
`;

export default ForecastSearch;
