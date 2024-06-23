// Handles Cursor Events + Add Handler to Map
L.CursorHandler = L.Handler.extend( {
    addHooks: function () {
        this._map.on('dblclick', this._addMarker, this);   // Create listener for double click at startup
    },

    removeHooks: function () {
        this._map.off('dblclick', this._addMarker, this);  // Removes Listener for double click at close
    },

    _addMarker: function(e) {
        createPin(e.latlng, "Marker", true);
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
            attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> ' + // Jawg attrib.
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +   // OSM attrib.
            '&copy <a href="https://www.flaticon.com/free-icons/maps-and-location">Flaticon</a> - Amazona Adorada',  // Flaticon attrib.
            minZoom: 0,
            maxZoom: 22,
            accessToken: 'Mk2XMa0mf65s97gaaKZ1Kta6vaoMsp3njJVG5uooQZT9SwflELWRhK5NLpKlA1AN'  // Be careful of this
        })
    ],
}).setView([39.520845889671264, -104.9200172232749], 13);    // Defines where map opens to on startup


// Marker Variables + Functions shit
var location_icon = L.icon({
    // Define pin icon and attributes
    iconUrl: '../static/assets/loc_icon.png',   // path from html file to icon.
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 37] // point of the icon which will correspond to marker's location
    // popupAnchor:  [-50, -30] // point from which the popup should open relative to the iconAnchor
});

function bobbingAnimation(marker) {
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

function createPin(xy_pos=[0,0], message="", open_popup=false) {
    // Create Pin + Add Animation
    var temp = new L.marker(xy_pos, {
        icon:location_icon, 
        opacity:1.0, 
        alt:message})
        .addTo(map)
        .bindPopup(message);   // Need to remove this in favor of creating popup menu
    
    // Add animation
    bobbingAnimation(temp);
    
    // Create popup on the marker if open_popup = true
    if (open_popup) {
        createPopupMenu(xy_pos);
    }

    return null;
}

function createPopupMenu(xy_pos=[0,0]) {
    // defines html code for the popup (do I need to initalize this every time?)
    // There has to be a better way to represent this.
    var popupContent = '<h2>Upload an Image</h2>' +
    '<form action="/upload" method="post" enctype="multipart/form-data">'+
    '<input type="file" name="file" accept="image/*">' +
    '<input type="submit" value="Upload">' +
    '</form>';
    
    var popup = L.popup({offset: L.point(0, -10)});
    popup.setLatLng(xy_pos)
        .addTo(map)
        .setContent(popupContent);
}


// Default Test Markers
createPin([39.520845889671264, -104.920017223274], "Rock Canyon High School");
createPin([39.56336885892135, -104.87694732273937], "Park Meadows Mall");
createPin([39.74099425098315, -104.9835222294324], "This is the Capital!");


// Add map scale in bottom left.
L.control.scale({maxWidth:100}).addTo(map);
