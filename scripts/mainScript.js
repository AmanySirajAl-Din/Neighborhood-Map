/* source from https://www.w3schools.com/howto/howto_js_sidenav.asp */
/* ================================================================ */

$(".listview-toggle-btn").click(function () {
    if ($(".side-nav").css("width") == "0px") { /* Open the side-nav */
        $(".side-nav").css("width", "310px");
        $(".side-nav").css("padding", "30px");
        $(".main-container").css("margin-left", "310px");
        $(".map-container").css("left", "310px");
    } else { /* Close/hide the side-nav */
        $(".side-nav").css("width", "0");
        $(".side-nav").css("padding", "0");
        $(".main-container").css("margin-left", "0");
        $(".map-container").css("left", "0");
        $(".map-container").css("left", "0");

    }
});

// Finally the Last Part to load the Map -->
// Some JS -->
// Source from Udacity FSND 
// part 4: lesson 7: Getting Started with APIs
// Link: https://classroom.udacity.com/nanodegrees/nd004/parts/135b6edc-f1cd-4cd9-b831-1908ede75737/modules/4fd8d440-9428-4de7-93c0-4dca17a36700/lessons/8304370457/concepts/83061122970923
// includes
// load Google map
// create markers
// create infoWindow

// then use Google Geocoder Tool
// Link: https://google-developers.appspot.com/maps/documentation/utils/geocoder/
// to find the lat,lng of my locations

var map;

// Create a new blank array for all the listing markers.
var markers = [],
    locations = [],
    geocoder;

// Error handling for 
// failing to load Google map
// https://stackoverflow.com/questions/14687237/google-maps-api-async-loading
/**
 * Error callback for GMap API request
 */
function googleError() {
    alert("Failed to load Google map" + status);
};

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
    geocoder = new google.maps.Geocoder();

    /* ====== Create Locations Array ====== */

    // these are the real estate listings that will be shown to the user
    // Normally we'd have these in a database instead
    // intialize my locations array of objects
    locations = [{
            title: 'Citadel of Qaitbay',
            location: {
                lat: 31.214013,
                lng: 29.885634
            },
            placeType: "archaeological"
        },
        {
            title: 'Montaza Palace',
            location: {
                lat: 31.288497,
                lng: 30.01597
            },
            placeType: "archaeological"

        }, {
            title: 'Al Mamoura Beach',
            location: {
                lat: 31.290818,
                lng: 30.030668
            },
            placeType: "beach"
        }, {
            title: 'Delices Cafe',
            location: {
                lat: 31.200107,
                lng: 29.899553
            },
            placeType: "cafe"
        },
        {
            title: 'El-Selsela Cafe',
            location: {
                lat: 31.210232,
                lng: 29.909239
            },
            placeType: "cafe"
        }, {
            title: 'San Stefano Cinema',
            location: {
                lat: 31.2453,
                lng: 29.9676
            },
            placeType: "cinema"
        }, {
            title: 'Bibliotheca Alexandrina',
            location: {
                lat: 31.208874,
                lng: 29.9092
            },
            placeType: "library"
        }, {
            title: 'El Raml Station',
            location: {
                lat: 31.201533,
                lng: 29.901052
            },
            placeType: "station"
        }, {
            title: 'Shaaban Fish Restaurant',
            location: {
                lat: 31.19894,
                lng: 29.89507
            },
            placeType: "restaurant"
        }, {
            title: 'Alban Sewisra',
            location: {
                lat: 31.214183,
                lng: 29.922147
            },
            placeType: "restaurant"
        }, {
            title: 'San Stefano Grand Plaza',
            location: {
                lat: 31.245489,
                lng: 29.967578
            },
            placeType: "hotel"
        }
    ];

    ko.applyBindings(new ViewModel());
}




// Using Knockout.js library
var ViewModel = function () {
    var self = this;

    // make a locationTypes observableArray
    this.locationTypes = ko.observableArray([]);

    // Create observableArray of filtered markers
    this.filteredMarkers = ko.observableArray([]);

    // loop over my locations and put its data in locationTypes
    locations.forEach(function (locationItem) {
        var repeatedLocation = false;
        var locItem = "";
        self.locationTypes().forEach(function (locType) {
            if (locationItem.placeType.toLowerCase() == locType.toLowerCase()) {
                repeatedLocation = true;
            }
        });
        if (!repeatedLocation) {
            locItem = locationItem.placeType.charAt(0).toUpperCase() + locationItem.placeType.slice(1);
            self.locationTypes.push(locItem);
        }
    });

    // Sort The locationTypes observableArray
    this.locationTypes.sort();

    // Intialize infoWindow var
    var largeInfowindow = new google.maps.InfoWindow();

    // we may have listings that are outside the initial zoom area
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
        var placeType = locations[i].placeType;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            //placeId: place.place_id,
            title: title,
            map: map,
            position: position,
            animation: google.maps.Animation.DROP,
            id: i,
            placeType: placeType,
            // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            //    label: 'G'
        });

        // Push the marker to our array of markers.
        markers.push(marker);
        self.filteredMarkers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', markerClicked);

        // Extend the boundaries of the map for each marker position
        mapBounds.extend(markers[i].position);
    }

    // sort markers alphabetically by the title
    // to be displayed in the list view in alphabetical order
    // source link:
    // https://stackoverflow.com/questions/5421253/sort-javascript-array-of-objects-based-on-one-of-the-objects-properties
    markers.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });
    self.filteredMarkers.sort(function (a, b) {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });


    // fit the boundaries of the map for all the markers
    // utilize to make map display responsively 
    // by using a window resize event 
    // and call fitBounds method 
    // to make sure map markers always fit on screen
    // as user resizes their browser window
    map.fitBounds(mapBounds);
    google.maps.event.addDomListener(window, 'resize', function () {
        map.fitBounds(mapBounds); // `bounds` is a `LatLngBounds` object
    });

    this.full_address = ko.observable();

    // get location details
    // https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
    geocoder.geocode({
        'location': marker.position
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                self.full_address(results[0].formatted_address);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            var infowindowContent = '<div class="infowindow-content">';
            infowindowContent += '<div class="marker-title">' + marker.title + '</div>';
            infowindowContent += '<div class="marker-placeType">' + (marker.placeType.charAt(0).toUpperCase() + marker.placeType.slice(1));
            infowindowContent += '</div>';
            infowindowContent += '<div class="place-details">' + self.full_address() + '</div>';
            infowindowContent += '<div id="wiki-div">Wikipedia Articles</div>';
            infowindowContent += '<div id="wikiArticles-list"></div>';
            infowindowContent += '</div></div></div>';
            infowindow.setContent(infowindowContent);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.setMarker = null;
                marker.setAnimation(null);
                $(".location-list-item").removeClass("location-list-item-selected");
            });
        }




        // get Wiki articles
        var urlWiki = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";

        $.ajax({
            url: urlWiki,
            dataType: 'jsonp',
            jsonp: "callback"
        }).done(function (response) {
            var wikiArticles = response[1];
            $("#wikiArticles-list").text("");
            if (wikiArticles.length === 0) {
                $("#wikiArticles-list").text("No Wikipedia Articles was found");
            }
            for (var i = 0; i < wikiArticles.length; i++) {
                var articleStr = wikiArticles[i];
                var url = "https://en.wikipedia.org/wiki/" + articleStr;
                $("#wikiArticles-list").append("<li><a href='" + url + "'>" +
                    articleStr + "</a></li>");
            }

            // success to get wikipedia resources
        }).fail(function (jqXHR, textStatus) {
            $("#wikiArticles-list").text("failed to get wikipedia resources");
        });
    }

    function markerClicked() {
        var thisMarker = this;
        self.toggleMarkerClick(thisMarker);
        $(".location-list-item").removeClass("location-list-item-selected");
        $(".location-list-item").each(function (index) {
            if ($(this).text() == thisMarker.title) {
                $(this).addClass("location-list-item-selected");
            }
        });
    }

    this.deactivateAllMarkers = function () {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
        }
        largeInfowindow.setMarker = null;
    };

    this.activeMarker = function (clickedLocation, event) {
        self.toggleMarkerClick(clickedLocation);
        $(".location-list-item").removeClass("location-list-item-selected");
        event.target.classList.add("location-list-item-selected");
    };

    /* source from: https://developers.google.com/maps/documentation/javascript/examples/marker-animations */
    /* =================================================================================================== */
    this.toggleMarkerClick = function (currentMarker) {
        if (currentMarker.getAnimation() === null) {
            self.deactivateAllMarkers();
            populateInfoWindow(currentMarker, largeInfowindow);
            currentMarker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };
    /* =================================================================================================== */


    // Filter's change event
    // to filter the locations and markers

    // This will hold the selected value from drop down menu
    this.selectedFilter = ko.observable();

    this.filteringMarkers = ko.computed(() => {
        // first deactivate all markers
        self.deactivateAllMarkers();
        // empty the filteredMarkers observableArray
        // source from: 
        // https://stackoverflow.com/questions/17545939/removeall-vs-empty-an-array-with-in-knockoutjs
        self.filteredMarkers.removeAll();

        for (var i = 0; i < markers.length; i++) {
            if (!self.selectedFilter() || self.selectedFilter().toLowerCase() == markers[i].placeType) {
                markers[i].setMap(map);
                self.filteredMarkers.push(markers[i]);

            } else { // if (selectedFilter != markers[i].placeType) 
                console.log("else")
                markers[i].setMap(null);
            }
        }
    });
}; /* end of ViewModel */

