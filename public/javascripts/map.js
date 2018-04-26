document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("map")) {
    console.log("mapita");
    const map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 43.392513,
        lng: -3.698211
      },
      zoom: 10
    });

    //Marks
    let bounds = new google.maps.LatLngBounds();
    let changedUse = window.plans.map(plan => {
      console.log(plan);
      let mappeduse = {
        title: plan.title,
        pos: {
          lat: plan.location.coordinates[0],
          lng: plan.location.coordinates[1]
        },
        id: plan._id,
        date: plan.date,
        genre: plan.genre,
        subgenre: plan.subgenre
      };
      //console.log(plan.username)
      bounds.extend(mappeduse.pos);
      return mappeduse;
    });
    map.fitBounds(bounds);

    changedUse.forEach(plan => {
      console.log(plan.date);
      let infowindow = new google.maps.InfoWindow({
        content: `<h3>${plan.title}</h3>
      <p>${plan.date.split("T")[0]}</p>
      <a class="btn btn-warning" href="/plans/${plan.genre}/${plan.subgenre}/${plan.id}">Go to plan</a>`
      });

      let marker = new google.maps.Marker({
        position: plan.pos,
        map: map,
        title: plan.name
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
    });

    var infoWindow = new google.maps.InfoWindow({
      map: map
    });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      console.log("jesus");
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Usted esta Aquí");
          map.setCenter(pos);
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
    }
  }
});
