// MAPBOX DISPLAY
function showEventsOnMap() {

    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWpnYWJsIiwiYSI6ImNsZXFyN2pmaDBsbmQzcmxrdDN1bWR2dWQifQ.X2m-VshHfJA_ZpBixUPCaw';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-123.116226, 49.246292], // Starting position
        zoom: 12 // Starting zoom
    });

    // Add the control to the map.
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());


    // Adds map features
    map.on('load', () => {
        const features = []; // Defines an empty array for information to be added to

        // Defines map pin icon
        map.loadImage(
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                // Add the image to the map style.
                map.addImage('eventpin', image); // Pin Icon

                // Get the Firestore database instance
                var db = firebase.firestore();

                // Get a reference to the userinfo collection
                var userinfoRef = db.collection("userinfo");

                // Get a reference to the livestock_Emergency_Capacity collection
                // var livestockRef = db.collection("livestock_Emergency_Capacity");

                // READING information from "userinfo" collection in Firestore
                userinfoRef.get().then(allEvents => {
                    allEvents.forEach(doc => {
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
                        capacityType = doc.data().type; // User livestock capacity type instance
                        capacityAmount = doc.data().quantity; // User livestock capacity type amount
                        userID = doc.data().userID; // to get userID

                        // Pushes information into the features array
                        features.push({
                            'type': 'Feature',
                            'properties': {
                                'description': `<strong>${"User Info: " + event_name}</strong>
                                         <p>${"Mobile: " + mobile}</p>
                                         <p>${"Phone: " + phone}</p> 
                                         <p>${"Email: " + email}</p>  
                                         <a href="otherUserDetails.html?id=${userID}" target="_blank" title="Opens the users profile in a new window">Read more</a>`
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coordinates
                            }
                        });
                        //     })
                        // })
                    })

                    // Adds features as a source to the map
                    map.addSource('places', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': features
                        }
                    });

                    // Creates a layer above the map displaying the pins
                    map.addLayer({
                        'id': 'places',
                        'type': 'symbol',
                        'source': 'places',
                        'layout': {
                            'icon-image': 'eventpin', // Pin Icon
                            'icon-size': 0.2, // Pin Size
                            'icon-allow-overlap': true // Allows icons to overlap
                        }
                    });

                    // Map On Click function that creates a popup, displaying previously defined information from "events" collection in Firestore
                    map.on('click', 'places', (e) => {
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
                    map.on('mouseenter', 'places', () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    // Defaults cursor when not hovering over the places layer
                    map.on('mouseleave', 'places', () => {
                        map.getCanvas().style.cursor = '';
                    });

                })

            });


    })
}

showEventsOnMap()

if ("geolocation" in navigator) { 
    navigator.geolocation.getCurrentPosition(position => { 
        var map = new mapboxgl.Map({
        // container id specified in the HTML
          container: 'map',

          style: 'mapbox://styles/mapbox/streets-v11', // Styling URL

         // initial position in [lon, lat] format
          center: [position.coords.longitude, position.coords.latitude],

         // initial zoom

         zoom: 14
        });
    }); 
} else { /* geolocation IS NOT available, handle it */ }