export const getData = async () => {
  let url = "";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// in the component where you want to use the data

// import { getData } from "../hooks/getData";
// import { useQuery } from "react-query";

// const { data, isLoading, isError } = useQuery("pokemon", () =>
//   fetchData().then((res) => res.results)
// );
// if (isLoading) return <div>Loading...</div>;
// if (isError) return <div>Error: {data.message}</div>;
// if (data) {
//   console.log(data);
// }
