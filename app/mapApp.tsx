import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { useGeographic } from "ol/proj";
import { Style, Fill, Stroke, Circle } from 'ol/style';
import "ol/ol.css";
import Overlay from 'ol/Overlay';

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const shelterLayer = new VectorLayer({
    source: new VectorSource({
        url: "/geojson/shelter.geojson",
        format: new GeoJSON(),
    }),
    style: function(feature) {
        const capacity = feature.get('plasser');
        let color;
        let radius;

        if (capacity <= 100) {
            color = 'rgba(255, 0, 0, 0.7)';
            radius = 4;
        } else if (capacity <= 500) {
            color = 'rgba(255, 165, 0, 0.7)';
            radius = 6;
        } else {
            color = 'rgba(0, 255, 0, 0.7)';
            radius = 8;
        }

        return new Style({
            image: new Circle({
                radius: radius,
                fill: new Fill({
                    color: color
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        });
    }
});


const defaultStyle = new Style({
    fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
    }),
    stroke: new Stroke({
        color: 'rgba(225,89,54,0.3)',
        width: 5
    })
});

const highlightStyle = new Style({
    fill: new Fill({
        color: 'rgba(161,142,137,0.3)'
    }),
    stroke: new Stroke({
        color: 'rgba(225,89,54,0.3)',
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
    const [overlayInfo, setOverlayInfo] = useState<string | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const overlay = new Overlay({
            element: overlayRef.current!,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        map.addOverlay(overlay);

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
            }, {
                hitTolerance: 5,
                layerFilter: function(layer) {
                    return layer === sivilforsvarsdistrikterLayer;
                }
            });

            map.getTargetElement().style.cursor = hoveredFeature ? 'pointer' : '';
        });

        map.on('click', function(e) {
            const feature = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                if (layer === shelterLayer) {
                    return feature;
                }
            });

            if (feature) {
                const properties = feature.getProperties();
                const info = `
                    <h3>Shelter Nr: ${properties.romnr || ''}</h3>
                    <p>Capacity: ${properties.plasser || ''}</p>
                    <p>Area/Address: ${properties.adresse || ''}</p>
                `;
                setOverlayInfo(info);
                overlay.setPosition(e.coordinate);
            } else {
                setOverlayInfo(null);
                overlay.setPosition(undefined);
            }
        });

        return () => {
            map.setTarget(null);
        };
    }, []);

    return (
        <div>
            <div ref={mapRef}></div>
            <div ref={overlayRef} className="overlay" style={{
                position: 'absolute',
                background: 'white',
                padding: '15px',
                borderRadius: '5px',
                border: '1px solid #cccccc',
                minWidth: '200px',
                display: overlayInfo ? 'block' : 'none'
            }}>
                {overlayInfo && <div dangerouslySetInnerHTML={{__html: overlayInfo}} />}
            </div>
        </div>
    );
}
