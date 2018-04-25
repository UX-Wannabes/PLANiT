document.addEventListener("DOMContentLoaded",() => {
  document.getElementById('date').onchange = function(){
    console.log('i')
    let address = document.getElementById('adress').value
    address = address.replace(/\s+/g,'+')
    console.log(address)
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCgsMC659ayWxa7vhbI_ykWqzdavn8ZOxg`)
    .then(function (response) {
      console.log(response)
      console.log(response.data.results[0].geometry.location)
      let lat = response.data.results[0].geometry.location.lat
      let long = response.data.results[0].geometry.location.lng
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=a68b6bdea8f65c2b91544b4501750026`).then(w=>{
        console.log(w)
      })
    })
    .catch(function (error) {
      console.log(error);
    });

  }
})