const getDate = async () => {
  try {
    const response = await fetch("http://worldtimeapi.org/api/ip");
    const data = await response.json();
    const date = new Date(data.datetime);
    const timeZone = data.timezone;
    return { date, timeZone };
  } catch (error) {
    console.error("Get Date :: getDate :: error: ", error);
    return null;
  }
};

module.exports = getDate;
