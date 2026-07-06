export const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords);
    },
    (error) => {
      alert("There was an error getting location");
      console.error(error);
    }
  );
};