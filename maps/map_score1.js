var map_score1 = L.map('map_score1id', {zoomSnap: .1}).setView([37.8, -96], 3.5);
var geojson1;
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: 'mapbox/dark-v10',
accessToken: 'pk.eyJ1IjoidGFyYWdhbGxhZ2hlciIsImEiOiJjazk4eGYxbG4xYWtzM21sY2EzazR1d2N2In0.KHOsDxKbJU6-Tk7PeRCJUQ'
}).addTo(map_score1);


// Set zoom depending on screen size
width = document.documentElement.clientWidth;
if (width < 768) {
    // set the zoom level to 10
    map_score1.setZoom(3);
}  else {
    map_score1.setZoom(3.5);
}
// Listen for screen resize events
window.addEventListener('resize', function(event){
    var width = document.documentElement.clientWidth;
    // Phones are <768 pixels wide
    if (width < 768) {
        // set the zoom level to 10
        map_score1.setZoom(3);
    }  else {
        map_score1.setZoom(3.5);
    }
});

L.geoJson(statesData,{weight: 1}).addTo(map_score1);
map_score1.scrollWheelZoom.disable();

function getColor1(d) {
    return d == "Non-essential" ? '#bd0026' :
        d == "Provider decides"  ? '#fd8d3c' :
        d == "No specific language"  ? '#e6e6e6' :
        d == "Essential"   ? '#ffeda0' :
                    '#ffeda0';
}

function style(feature) {
    return {
        fillColor: getColor1(feature.properties.score1),
        weight: 1,
        opacity: 1,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 1
    };
}
geojson1 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map_score1);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        // color: '#666',
        color: 'white',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    
    infoMap1.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson1.resetStyle(e.target);
    infoMap1.update();
}

// Define click listener that scrolls to specific state
function scrollToFeature(e) {
    var clickLayer = e.target;
    //map.fitBounds(e.target.getBounds());
    //var divID = layer.feature.properties.name;
    var divID = clickLayer.feature.properties.name;
    document.getElementById(divID.toString()).scrollIntoView({behavior: "smooth", block: "center"});
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: scrollToFeature
    });

}

var infoMap1 = L.control({
    position : 'bottomleft'
});

infoMap1.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'subinfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
infoMap1.update = function (props) {
    this._div.innerHTML = (props ?
        ' <h4>' + props.name + ':</h4> ' + props.score1 
        : 'Hover or click.');
};

infoMap1.addTo(map_score1);
