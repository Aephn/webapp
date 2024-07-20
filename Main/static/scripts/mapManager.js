
const all_markers = L.markerClusterGroup();

// For Click events: https://stackoverflow.com/questions/16927793/marker-in-leaflet-click-event
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
    constructor(xy_pos=[0,0], message="Unnamed Marker", auto_open_popup=false) {
        /* Create and define parameters for the pin + attached popup */
        try {

            // PARAMETERS
            var popupMaxHeight = 450;
            var popupMaxWidth = 450;
            var popupContent = '<iframe width="400" height="400" src="/marker"></iframe>';
            // PARAMETERS


            // load icon & define how image is positioned
            var location_icon = L.icon({
                iconUrl: '../static/assets/loc_icon.png',
                iconSize: [40, 40],
                iconAnchor: [20, 37]
            });

            // Create Pin + Define bound popup behavior.
            this.marker = new L.marker(xy_pos, {
                icon: location_icon, 
                opacity: 1.0, 
                alt: message
            })
            .addTo(map)
            .bindPopup(popupContent, {
                offset: L.point(0, -10),
                maxWidth:popupMaxHeight, 
                maxHeight:popupMaxWidth,
                autoClose:false,
                closeOnClick:false
                });
            
            // Bind methods to ensure correct `this` context
            this.bobbingAnimation = this.bobbingAnimation.bind(this);
            this.bobbingAnimation(this.marker);

            // open popup on creation if parameter is true.
            if(auto_open_popup) {
                this.marker.openPopup()
            }

        } catch (error) {
            console.error("Error in Pin creation.", error);
        }
    }
    
    changePinMessage(message="<p>ERROR -> Blank Message.</p>") {
        /* Not exactly sure what to do with this yet. */
        return;
    }

    changePopupContent(newContent="<p>ERROR -> Blank Content.</p>") {
        /* Method to change popup content with new html code */
        this.marker.setPopupContent(newContent);
        return;
    } 

    bobbingAnimation(marker) {
        /* Method which defines and adds the bobbing animation for a marker. */
        try {
            // PARAMETERS
            var marker_displacement = 5;   // Specifies how much the marker moves
            // PARAMETERS

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
    }
}

// Default Test Pins
new Pin([33.64279217005621, -117.84161034087451], "UCI", true);
new Pin([33.6911993634157, -117.8889016003852], "South Coast Plaza Mall", false);
new Pin([33.650521067513935, -117.74291965209282], "Irvine Spectrum", false);
new Pin([33.68326860680547, -117.7207477031901], "This is James's House", false);


// Add map scale in bottom left.
L.control.scale({maxWidth:100}).addTo(map);
