import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { useGeographic } from "ol/proj";
import { Style, Fill, Stroke, Circle } from 'ol/style';
import "ol/ol.css";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const shelterLayer = new VectorLayer({
    source: new VectorSource({
        url: "./KwsFinal/api/skoler",
        format: new GeoJSON(),
    }),
    style: new Style({
        image: new Circle({
            radius: 6,
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.7)'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2
            })
        })
    })
});

const defaultStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
    }),
    stroke: new Stroke({
        color: 'blue',
        width: 5
    })
});

const highlightStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 0, 0.3)'
    }),
    stroke: new Stroke({
        color: 'yellow',
        width: 5
    })
});

const sivilforsvarsdistrikterLayer = new VectorLayer({
    source: new VectorSource({
        url: "/geojson/Sivilforsvarsdistrikter.geojson",
        format: new GeoJSON(),
    }),
    style: defaultStyle
});

const map = new Map({
    view: new View({ center: [10.8, 59.9], zoom: 10 }),
    layers: [
        new TileLayer({ source: new OSM() }),
        osmLayer, shelterLayer, sivilforsvarsdistrikterLayer
    ],
});

export function Application() {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        map.setTarget(mapRef.current!);

        let hoveredFeature: any = null;

        map.on('pointermove', function(e) {
            if (hoveredFeature) {
                hoveredFeature.setStyle(defaultStyle);
                hoveredFeature = null;
            }

            map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                if (layer === sivilforsvarsdistrikterLayer) {
                    hoveredFeature = feature;
                    feature.setStyle(highlightStyle);
                    return true;
                }
            });

            map.getTargetElement().style.cursor = hoveredFeature ? 'pointer' : '';
        });

    }, []);

    return <div ref={mapRef}></div>;
}
