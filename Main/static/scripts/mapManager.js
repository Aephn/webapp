// Handles Cursor Events + Add Handler to Map
L.CursorHandler = L.Handler.extend( {
    addHooks: function () {
        this._map.on('dblclick', this._addMarker, this);   // Create listener for double click at startup
    },

    removeHooks: function () {
        this._map.off('dblclick', this._addMarker, this);  // Removes Listener for double click at close
    },

    _addMarker: function(e) {
        new Pin(e.latlng, undefined, true);   // undefined skips the parameter.
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


class Pin {
    constructor(xy_pos=[0,0], message="Unnamed Marker", popup_on_creation=false) {
        try {
            // console.log("Creating a new Pin at position:", xy_pos);

            var location_icon = L.icon({
                iconUrl: '../static/assets/loc_icon.png',   // path from HTML file to icon.
                iconSize: [40, 40],
                iconAnchor: [20, 37]
            });

            // Create Pin + Add Animation
            this.marker = new L.marker(xy_pos, {
                icon: location_icon, 
                opacity: 1.0, 
                alt: message
            })
            .addTo(map)
            .bindPopup(message);

            console.log("Marker created:", this.marker);

            // Bind methods to ensure correct `this` context
            this.bobbingAnimation = this.bobbingAnimation.bind(this);
            this.createPopupMenu = this.createPopupMenu.bind(this);

            this.bobbingAnimation(this.marker);
        
            // Create popup on the marker if popup_on_creation = true
            if (popup_on_creation) {
                this.createPopupMenu(xy_pos);
            }
        } catch (error) {
            console.error("Error in Pin constructor:", error);
        }
    }   // create pin and animate it + popup
    
    changePinMessage(pin, message="Unnamed Marker") {
        // I need to figure out how to select specific pins that are created.
        return;
    }   // method to change the pin message (NOT DONE)
        
    createPopupMenu(xy_pos=[0,0]) {
        // CSS loading gif https://www.w3schools.com/howto/howto_css_loader.asp
        try {
            var popupContent = '<h2>Upload an Image </h2>'+
            '<p>(jpg, png, jpeg)</p>' +
            '<form action="/upload" method="post" enctype="multipart/form-data">'+
            '<input type="file" name="image_file" accept="image/*" multiple><br><br>' +
            '<input type="submit" value="Upload">' +
            '</form>';
                
            var popup = L.popup({offset: L.point(0, -10)});
            popup.setLatLng(xy_pos)
                .addTo(map)
                .setContent(popupContent);
        } catch (error) {
            console.error("Error in createPopupMenu:", error);
        }
        
        return;
    }   // method to create a new popup window for the marker.
        
    openPopupMenu(marker) {
        // Need to add an event for on a marker click.
        return;
    }   // method to re-open the popup window for the marker.

    bobbingAnimation(marker) {
        try {
            var marker_displacement = 5;   // Specifies how much the marker moves
        
            marker.on("click", () => {
                var pos = map.latLngToLayerPoint(marker.getLatLng());
                pos.y -= marker_displacement;
                var fx = new L.PosAnimation();
          
                fx.once('end', () => {
                    pos.y += marker_displacement;
                    fx.run(marker._icon, pos, 0.8);
                });
                fx.run(marker._icon, pos, 0.3);
            });
        } catch (error) {
            console.error("Error in bobbingAnimation:", error);
        }
    
        return;
    }   // method which defines the bobbing animation of the marker.
}


// Default Test Pins
new Pin([39.56336885892135, -104.87694732273937], "Park Meadows Mall", true);
new Pin([39.520845889671264, -104.920017223274], "Rock Canyon High School", false);
new Pin([39.74099425098315, -104.9835222294324], "This is the Capital!", false);


// Add map scale in bottom left.
L.control.scale({maxWidth:100}).addTo(map);
