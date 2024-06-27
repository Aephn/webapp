
L.CursorHandler = L.Handler.extend( {   // Handles Cursor Events + Add Handler to Map
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


var map = L.map('map', {   // map initialization
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
}).setView([33.68127006972219, -117.8194090597511], 13);    // Defines where map opens to on startup


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
        var popupMaxHeight = 700;
        var popupMaxWidth = 500;

        try {
            var popupContent = '<iframe width="500" height="400" src="../templates/marker.html"></iframe>';
            

            // https://www.youtube.com/embed/Vk5-c_v4gMU
            var popup = L.popup({
                offset: L.point(0, -10),
                maxWidth:popupMaxHeight, 
                maxHeight:popupMaxWidth,
                autoClose:false,
                closeOnClick:false
                });
            popup.setLatLng(xy_pos,)
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

    changePopupContent(newContent) {
        this.marker.setPopupContent(newContent);
        return;
    }   // method to change popup content with new html code

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
new Pin([33.64279217005621, -117.84161034087451], "UCI", true);
new Pin([33.6911993634157, -117.8889016003852], "South Coast Plaza Mall", false);
new Pin([33.650521067513935, -117.74291965209282], "Irvine Spectrum", false);


// Add map scale in bottom left.
L.control.scale({maxWidth:100}).addTo(map);
