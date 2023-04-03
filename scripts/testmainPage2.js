// MAPBOX DISPLAY
function showEventsOnMap() {

  // TO MAKE THE MAP APPEAR YOU MUST
  // ADD YOUR ACCESS TOKEN FROM
  // https://account.mapbox.com
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWpnYWJsIiwiYSI6ImNsZXFyN2pmaDBsbmQzcmxrdDN1bWR2dWQifQ.X2m-VshHfJA_ZpBixUPCaw";
  const map = new mapboxgl.Map({
    container: "map", // Container ID
    style: "mapbox://styles/mapbox/streets-v11", // Styling URL
    center: [-123.116226, 49.246292], // Starting position
    zoom: 12, // Starting zoom
  });

  // Add the control to the map.
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })
  );

  // Add user controls to map
  map.addControl(new mapboxgl.NavigationControl());

  // Adds map features
  map.on("load", () => {
    const features = []; // Defines an empty array for information to be added to

    // Defines map pin icon
    map.loadImage(
      "https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png",
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage("eventpin", image); // Pin Icon

        // Get the Firestore database instance
        var db = firebase.firestore();

        // Get a reference to the userinfo collection
        var userinfoRef = db.collection("userinfo");
        var livestockCapacity = db.collection("livestock_Emergency_Capacity");

        // Get a reference to the livestock_Emergency_Capacity collection
        // var livestockRef = db.collection("livestock_Emergency_Capacity");

        // Get user location permission and show it on the map
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const userCoordinates = [
              position.coords.longitude,
              position.coords.latitude,
            ];

            // Add a marker for the user's location
            const userMarker = new mapboxgl.Marker()
              .setLngLat(userCoordinates)
              .addTo(map);

            // Change the center of the map to the user's location
            map.setCenter(userCoordinates);
          },
          function () {
            // Handle location permission denied or unavailable
            console.log("Could not get user location");
          }
        );




        livestockCapacity.get().then((capacities) => {




          // READING information from "userinfo" collection in Firestore
          userinfoRef.get().then((allEvents) => {
            allEvents.forEach((doc) => {

              // get user address Coordinates
              lat = doc.data().latitude;
              lng = doc.data().longitude;
              console.log(lat, lng);
              coordinates = [lng, lat];
              console.log(coordinates);
              //read name and the details of userinfo
              event_name = doc.data().Name; // Event Name
              mobile = doc.data().mobile; // User mobile number
              email = doc.data().email; // User email
              phone = doc.data().phone; // User phone number
              userID = doc.data().userID; // to get userID


              var capacityByIds = capacities.docs.filter(element => element.data().userID === doc.data().userID);

              let emergencyCapacitiesHtml = '';
              capacityByIds.forEach(capacity => {
                emergencyCapacitiesHtml += ` <p>Type: ${capacity.data().type}</p><p>Quantities: ${capacity.data().quantity}</p>`
              });

              // Pushes information into the features array
              features.push({
                type: "Feature",
                properties: {
                  description: `<strong>${"User Info: " + event_name}</strong>
                                         <p>${"Mobile: " + mobile}</p>
                                         <p>${"Phone: " + phone}</p> 
                                         <p>${"Email: " + email}</p> 
                                         ${emergencyCapacitiesHtml}
                                          
                                         <a href="otherUserDetails.html?id=${userID}" target="_blank" title="Opens the users profile in a new window">Read more</a>`,
                },
                geometry: {
                  type: "Point",
                  coordinates: coordinates,
                },
              });
              //     })
              // })
            });

            // Adds features as a source to the map
            map.addSource("places", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
              },
            });

            // Creates a layer above the map displaying the pins
            map.addLayer({
              id: "places",
              type: "symbol",
              source: "places",
              layout: {
                "icon-image": "eventpin", // Pin Icon
                "icon-size": 0.2, // Pin Size
                "icon-allow-overlap": true, // Allows icons to overlap
              },
            });

            // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
            map.on("click", "places", (e) => {
              // Copy coordinates array.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on("mouseenter", "places", () => {
              map.getCanvas().style.cursor = "pointer";
            });

            // Defaults cursor when not hovering over the places layer
            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
            });
          });
        })
      }
    );
  });
}


showEventsOnMap();
