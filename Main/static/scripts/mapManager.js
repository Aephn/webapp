
const markerClusterGroup = L.markerClusterGroup();


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
        /* new L.tileLayer('https://tile.jawg.io/jawg-lagoon/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
            attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> ' + // Jawg attrib.
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +   // OSM attrib.
            '&copy <a href="https://www.flaticon.com/free-icons/maps-and-location">Flaticon</a> - Amazona Adorada',  // Flaticon attrib.
            minZoom: 0,
            maxZoom: 22,
            accessToken: 'Mk2XMa0mf65s97gaaKZ1Kta6vaoMsp3njJVG5uooQZT9SwflELWRhK5NLpKlA1AN'  // Be careful of this
        }) */

        new L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
            attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 22,
            accessToken: 'Mk2XMa0mf65s97gaaKZ1Kta6vaoMsp3njJVG5uooQZT9SwflELWRhK5NLpKlA1AN'
        })
    ],
}).setView([33.68127006972219, -117.8194090597511], 13);    // Defines where map opens to on startup

// Add map scale in bottom left.
L.control.scale({maxWidth:100}).addTo(map);



//Map Classes + Functions
class Pin {
    constructor(xy_pos=[0,0], message="Unnamed Marker") {
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
            var marker = L.marker(xy_pos, {
                icon: location_icon, 
                opacity: 1.0, 
                alt: message

            })
            .bindPopup(popupContent, {
                offset: L.point(0, -10),
                maxWidth:popupMaxHeight, 
                maxHeight:popupMaxWidth,
                autoClose:false,
                closeOnClick:false
                });
            
            markerClusterGroup.addLayer(marker);
            markerClusterGroup.addTo(map);
            this.bobbingAnimation(marker);

        } catch (error) {
            console.error("Error in Pin Creation.", error);
        }
    }
    
    bobbingAnimation(marker=NULL) {
        /* Method which defines and adds the bobbing animation for a marker. */
        try {
            // PARAMETERS
            var marker_displacement = 7;   // Specifies how much the marker moves
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

function test() {
    console.debug("test works.");
}

// default test pins
var pins = [
    new Pin([33.64279217005621, -117.84161034087451], "UCI"),
    new Pin([33.6911993634157, -117.8889016003852], "South Coast Plaza Mall"),
    new Pin([33.650521067513935, -117.74291965209282], "Irvine Spectrum"),
    new Pin([33.68326860680547, -117.7207477031901], "This is James's House"),
    new Pin([33.6454, -117.8426], "Pin 1"),
    new Pin([33.6460, -117.8421], "Pin 2"),
    new Pin([33.6465, -117.8417], "Pin 3"),
    new Pin([33.6471, -117.8412], "Pin 4"),
    new Pin([33.6476, -117.8408], "Pin 5"),
    new Pin([33.6482, -117.8403], "Pin 6"),
    new Pin([33.6487, -117.8399], "Pin 7"),
    new Pin([33.6493, -117.8394], "Pin 8"),
    new Pin([33.6498, -117.8390], "Pin 9"),
    new Pin([33.6504, -117.8385], "Pin 10"),
    new Pin([33.6510, -117.8381], "Pin 11"),
    new Pin([33.6515, -117.8376], "Pin 12"),
    new Pin([33.6521, -117.8372], "Pin 13"),
    new Pin([33.6526, -117.8367], "Pin 14"),
    new Pin([33.6532, -117.8363], "Pin 15"),
    new Pin([33.6537, -117.8358], "Pin 16"),
    new Pin([33.6543, -117.8354], "Pin 17"),
    new Pin([33.6548, -117.8349], "Pin 18"),
    new Pin([33.6554, -117.8345], "Pin 19"),
    new Pin([33.6560, -117.8340], "Pin 20"),
    new Pin([33.6565, -117.8336], "Pin 21"),
    new Pin([33.6571, -117.8331], "Pin 22"),
    new Pin([33.6576, -117.8327], "Pin 23"),
    new Pin([33.6582, -117.8322], "Pin 24"),
    new Pin([33.6587, -117.8318], "Pin 25"),
    new Pin([33.6593, -117.8313], "Pin 26"),
    new Pin([33.6599, -117.8309], "Pin 27"),
    new Pin([33.6604, -117.8304], "Pin 28"),
    new Pin([33.6610, -117.8300], "Pin 29"),
    new Pin([33.6615, -117.8295], "Pin 30"),
    new Pin([33.6400, -117.8426], "Pin 31"),
    new Pin([33.6395, -117.8421], "Pin 32"),
    new Pin([33.6390, -117.8417], "Pin 33"),
    new Pin([33.6385, -117.8412], "Pin 34"),
    new Pin([33.6380, -117.8408], "Pin 35"),
    new Pin([33.6375, -117.8403], "Pin 36"),
    new Pin([33.6370, -117.8399], "Pin 37"),
    new Pin([33.6365, -117.8394], "Pin 38"),
    new Pin([33.6360, -117.8390], "Pin 39"),
    new Pin([33.6355, -117.8385], "Pin 40"),
    new Pin([33.6350, -117.8381], "Pin 41"),
    new Pin([33.6345, -117.8376], "Pin 42"),
    new Pin([33.6340, -117.8372], "Pin 43"),
    new Pin([33.6335, -117.8367], "Pin 44"),
    new Pin([33.6330, -117.8363], "Pin 45"),
    new Pin([33.6325, -117.8358], "Pin 46"),
    new Pin([33.6320, -117.8354], "Pin 47"),
    new Pin([33.6315, -117.8349], "Pin 48"),
    new Pin([33.6310, -117.8345], "Pin 49"),
    new Pin([33.6305, -117.8340], "Pin 50")
  ];

  function getRandomCoordinate(base, range) {
    return base + (Math.random() - 0.5) * range;
  }
  
  for (let i = 1; i <= 250; i++) {
    let lat = getRandomCoordinate(33.6454, 0.3); // +/- 0.15 degree range
    let lon = getRandomCoordinate(-117.8426, 0.3); // +/- 0.15 degree range
    pins.push(new Pin([lat, lon], `Pin ${i}`));
  }
