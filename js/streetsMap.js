
var map;
function initmap(){
	// Google uses EPSG:900913 but out data are in EPSG:4326
	var options = {
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326")
	};

	map = new OpenLayers.Map('map', options);

	var gmap = 	new OpenLayers.Layer.Google(
					"Google Streets", // the default
					{type: google.maps.MapTypeId.ROADMAP, numZoomLevels: 20}
				);
	var gsat = 	new OpenLayers.Layer.Google(
					"Google Satellite",
					{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20}
				);
	var ghyb =	new OpenLayers.Layer.Google(
					"Google Hybrid",
					{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
				);
	var gphy = 	new OpenLayers.Layer.Google(
					"Google Physical",
					{type: google.maps.MapTypeId.TERRAIN, numZoomLevels: 20}
				);
	map.addLayers([gmap, gphy, ghyb, gsat]);
	map.setBaseLayer(gsat);




	// Make a fresh vector layer, pulling features from our script URL
	drawStyles = new OpenLayers.StyleMap({
		"default": new OpenLayers.Style({
			strokeColor: "orange",
			strokeOpacity: 1,
			strokeWidth: 4,
			fillColor: "orange",
			fillOpacity: 0.1,
			pointRadius: 6,
		}),
		"select": new OpenLayers.Style({
			strokeColor: "blue",
			strokeOpacity: 1,
			strokeWidth: 4,
			fillColor: "blue",
			fillOpacity: 0.3,
			pointRadius: 6,
		})
	});

	
				
	villages = new OpenLayers.Layer.Vector("Villages", {
		projection: map.displayProjection,
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: "functions/getVillages.php",
			format: new OpenLayers.Format.GeoJSON()
		}),
		styleMap: drawStyles			
	}); 


	map.addLayers([villages ]);
	
	select = new OpenLayers.Control.SelectFeature([villages]);            

	villages.events.on({
		"featureselected": onVillageSelect,
		"featureunselected": onVillageUnselect
	});

	map.addControl(select);
	select.activate();   

	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.MousePosition());

	map.zoomToExtent(
		new OpenLayers.Bounds(
			//100.0600, 19.0775, 100.0700, 19.0875
			100.74816, 18.56422 , 100.92694 , 18.60276
		).transform(map.displayProjection, map.projection)
	); 
}

//details to be shown in map-info <div>


function onVillageSelect(event) {
	var feature = event.feature;
	
	// feature.attributes are fields selected in getVillages.php
	$('#info').append('<p><b>หมู่ที่ </b> ' + feature.attributes.id + '</p>');
	$('#info').append('<p><b>ชื่อหมู่บ้าน</b> ' + feature.attributes.name + '</p>');
	$('#info').append('<p><b>รายละเอียด</b> ' + feature.attributes.description + '</p>');
	$('#info').append('<p><b>รูปภาพ</b> <br><img src="images/' + feature.attributes.image + '" width="300" height="300" class="rounded" "></p>');

}


function onVillageUnselect(event) {
	var feature = event.feature;

	$('#info').html('');
}



