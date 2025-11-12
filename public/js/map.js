  
  
  let apiKey = apiKeyy;
        // console.log(apiKey);


        const map = L.map('my-map').setView([lat,lng], 10);
        const isRetina = L.Browser.retina;
        const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`;
        const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${apiKey}`;
        L.tileLayer(isRetina ? retinaUrl : baseUrl, {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
        // apiKey: "apiKeyy", 
        maxZoom: 20, 
        id: 'osm-bright'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map)
       .bindPopup(`<b> ${listingTitle} </b><br><b>${listingLocation}</b>`).openPopup();
