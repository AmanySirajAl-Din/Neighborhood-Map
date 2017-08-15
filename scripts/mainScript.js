// Finally the Last Part to load the Map -->
// Some JS -->

var map;

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
}
