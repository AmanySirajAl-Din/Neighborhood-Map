// Finally the Last Part to load the Map -->
// Some JS -->

var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    /* ====== Load Google Map ====== */

    // Constructor creates a new map - only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), { // wher to load the Map
        center: { // what part of the world to show
            lat: 31.199478,
            lng: 29.918245
        },
        zoom: 14
        // the zoom is just a number for details to show
        // the higher the number, the more detail
        // up to level 21
    });

    /* ====== Create Locations Array ====== */

    // these are the real estate listings that will be shown to the user
    // Normally we'd have these in a database instead
    var locations = [
        {
            title: 'Bibliotheca Alexandrina',
            location: {
                lat: 31.208874,
                lng: 29.9092
            }
        },
        {
            title: 'El Raml Station',
            location: {
                lat: 31.201533,
                lng: 29.901052
            }
        },
        {
            title: 'Shaaban Fish Restaurant',
            location: {
                lat: 31.19894,
                lng: 29.89507
            }
        },
        {
            title: 'Citadel of Qaitbay',
            location: {
                lat: 31.214013,
                lng: 29.885634
            }
        },
        {
            title: 'Selsela Cafe',
            location: {
                lat: 31.210232,
                lng: 29.909239
            }
        },
        {
            title: 'Alban Sewisra',
            location: {
                lat: 31.214183,
                lng: 29.922147
            }
        },
        {
            title: 'Delices',
            location: {
                lat: 31.200107,
                lng: 29.899553
            }
        },
        {
            title: 'Montaza Palace',
            location: {
                lat: 31.288497,
                lng: 30.01597
            }
        },
        {
            title: 'Al Mamoura Beach',
            location: {
                lat: 31.290818,
                lng: 30.030668
            }
        },
        {
            title: 'San Stefano Grand Plaza',
            location: {
                lat: 31.245489,
                lng: 29.967578
            }
        },
        {
            title: 'San Stefano Cinema',
            location: {
                lat: 31.2453,
                lng: 29.9676
            }
        }
            ];

    var largeInfowindow = new google.maps.InfoWindow();
    // finally we may have listings that are outside the initial zoom area
    // So to adjust the boundaries of the map to fit everything
    // create a new latLngBounds instance
    // which captures the southwest and northeast corners of the view port
    var mapBounds = new google.maps.LatLngBounds();


    // loop through the locations to create one marker per location

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            //    label: 'G'
        });

        // Push the marker to our array of markers.
        markers.push(marker);
        // Extend the boundaries of the map for each marker position
        mapBounds.extend(markers[i].position);
    }
    
    // fit the boundaries of the map for all the markers
    map.fitBounds(mapBounds);



}
