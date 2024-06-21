// Handles Cursor Events
L.CursorHandler = L.Handler.extend( {
    addHooks: function () {
        this._map.on('dblclick', this._addMarker, this);   // Create listener for double click at startup
    },

    removeHooks: function () {
        this._map.off('dblclick', this._addMarker, this);  // Removes Listener for double click at close
    },

    _addMarker: function(e) {
        createPin(e.latlng, "Marker")
    }
});

L.Map.addInitHook('addHandler', 'cursor', L.CursorHandler);

// map initialization
var map = L.map('map', {
    center: [0,0],
    zoom: 0,
    cursor: true,
    doubleClickZoom: false,   // disable double click zoom
    layers: [   // Jawg layer testing (ACCESS TOKEN INSIDE)
        new L.tileLayer('https://tile.jawg.io/jawg-lagoon/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
            attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 22,
            accessToken: 'Mk2XMa0mf65s97gaaKZ1Kta6vaoMsp3njJVG5uooQZT9SwflELWRhK5NLpKlA1AN'  // Be careful of this
        })
    ]
}).setView([39.520845889671264, -104.9200172232749], 13);    // Defines the point where map opens to on startup

// define location pin
var location_icon = L.icon({
    // Define pin icon and attributes
    iconUrl: '../static/assets/loc_icon.png',   // path from html file to icon.
    iconSize:     [38, 40], // size of the icon
    iconAnchor:   [25, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [-5, -30] // point from which the popup should open relative to the iconAnchor
});

function markerAnimation(marker) {
    // Marker Bobbing Animations
    var marker_displacement = 5;   // Specifies how much the marker is displaced

    marker.on("click", function() {
        var pos = map.latLngToLayerPoint(marker.getLatLng());
        pos.y -= marker_displacement;
        var fx = new L.PosAnimation();
  
        fx.once('end',function() {
            pos.y += marker_displacement;
            fx.run(marker._icon, pos, 0.8);
            });
        fx.run(marker._icon, pos, 0.3);
    });
    return null;
}

function createPin(xy_pos=[0,0], message="") {
    // Create Pin + Add Animation
    var temp = new L.marker(xy_pos, {icon:location_icon, opacity:1.0, alt:message}).addTo(map).bindPopup(message);
    markerAnimation(temp);
    return null;
}

// Markers + Text
createPin([39.520845889671264, -104.920017223274], "Rock Canyon High School");
createPin([39.56336885892135, -104.87694732273937], "Park Meadows Mall");
createPin([39.74099425098315, -104.9835222294324], "This is the Capital!");

// Add map scale
L.control.scale({maxWidth:100}).addTo(map);
