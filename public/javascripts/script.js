document.addEventListener(
  "DOMContentLoaded",
  () => {
    const labels = window.plans.map(e => e._id);
    const data = window.plans.map(e => e.total);
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["#FF463B", "#F0FF54", "#1B76CC"],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        legend: { display: false }
      }
    });

    const ironhackMAD = { lat: 40.392491, lng: -3.697986 };
    // Map initialization
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: ironhackMAD
    });

    const myPlaces = window.places;
    console.log(myPlaces);

    // Add restaurant markers to map
    let markers = [];
    myPlaces.forEach(function(place) {
      let title = place.name;
      let position = {
        lat: place.location.coordinates[0],
        lng: place.location.coordinates[1]
      };
      var pin = new google.maps.Marker({
        position: position,
        map: map,
        title: title
      });
      markers.push(pin);
    });
    //  var bounds = new google.maps.LatLngBounds();
    // bounds.extend(myPlaces);
    // map.fitBounds(bounds);
  },
  false
);
