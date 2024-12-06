import React, { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import { GeoJsonObject, Feature, Geometry } from "geojson";
import axios from "axios";
import statesData from "./state";
import { VStack, Center } from "@chakra-ui/react";
import "../style/legend.css";
import "leaflet/dist/leaflet.css";

interface MapData {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties?: any;
}

interface USMapProps {
  onStateSelect: (state: string) => void;
  selectedState: string | null;
  selectedData: string | null;
  setDistrictData: (state: string) => void;
  geoLevel: 'district' | 'precinct';
  showHeatmap: boolean;
}

const USMap: React.FC<USMapProps> = ({
  onStateSelect,
  selectedState,
  selectedData,
  setDistrictData,
  geoLevel,
  showHeatmap
}) => {
  const [arkansasData, setArkansasData] = useState<{
    district?: MapData[];
    precinct?: MapData[];
  }>({});
  const [newYorkData, setNewYorkData] = useState<{
    district?: MapData[];
    precinct?: MapData[];
  }>({});
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);

  const highlightFeatures = useCallback((e: L.LeafletMouseEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
  }, []);

  const resetHighlight = useCallback(
    (e: L.LeafletMouseEvent, geojson: L.GeoJSON) => {
      geojson.resetStyle(e.target);
    },
    []
  );

  const zoomToFeature = useCallback((e: L.LeafletMouseEvent, map: L.Map) => {
    map.fitBounds(e.target.getBounds());
  }, []);

  const onClick = useCallback(
    (e: L.LeafletMouseEvent, map: L.Map, feature: Feature) => {
      const stateName = feature.properties?.name || null;
      if (stateName === "New York" || stateName === "Arkansas") {
        onStateSelect(stateName);
        zoomToFeature(e, map);
      }
    },
    [onStateSelect, zoomToFeature]
  );

  const districtOnClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      setDistrictData(e.target.feature.properties.number);
    },
    [setDistrictData]
  );

  const fetchMapData = useCallback(async (state: string, type: 'DISTRICT' | 'PRECINCT') => {
    try {
      // change this to be not 
      const stateCode = state.toLowerCase().replace(" ", "");
      const response = await axios.get(
        `http://localhost:8080/api/map?state=${stateCode}&geoType=${type}`
      );

      console.log(`Fetched ${type.toLowerCase()} data for ${state}:`, response.data);

      if (response.data) {
        if (state === 'Arkansas') {
          setArkansasData(prev => ({
            ...prev,
            [type.toLowerCase()]: response.data
          }));
        } else if (state === 'New York') {
          setNewYorkData(prev => ({
            ...prev,
            [type.toLowerCase()]: response.data
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type.toLowerCase()} data for ${state}:`, error);
    }
  }, []);

  // Initialize the base map
  useEffect(() => {
    if (mapRef.current && !map) {
      const initialMap = L.map(mapRef.current, {
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([37.8, -96], 4);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 3,
        maxZoom: 24,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(initialMap);

      const onEachFeature = (feature: Feature, layer: L.Layer) => {
        layer.on({
          mouseover: highlightFeatures,
          mouseout: (e) => resetHighlight(e, geojson),
          click: (e) => onClick(e, initialMap, feature),
        });
      };

      const geojson = L.geoJSON(statesData as GeoJsonObject, {
        style: (feature) => ({
          fillColor:
            feature?.properties?.name === "New York"
              ? "#0000FF"
              : feature?.properties?.name === "Arkansas"
              ? "#FF5733"
              : "#FFFFFF",
          color: "#000",
          weight: 0.7,
          fillOpacity: 0.7,
        }),
        onEachFeature: onEachFeature,
      }).addTo(initialMap);

      const legend = new L.Control({ position: "bottomleft" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML = `
          <i style="background:#0000FF"></i>
          <span>New York (Democratic)</span>
          <br/>
          <i style="background:#FF5733"></i>
          <span>Arkansas (Republican)</span>
        `;
        return div;
      };
      legend.addTo(initialMap);

      setMap(initialMap);
    }
  }, [map, highlightFeatures, onClick, resetHighlight]);

  // Effect to fetch data when state or geoLevel changes
  useEffect(() => {
    if (selectedState === 'Arkansas' || selectedState === 'New York') {
      const stateData = selectedState === 'Arkansas' ? arkansasData : newYorkData;
      
      // Only fetch if we don't already have the data for this level
      if (!stateData[geoLevel]) {
        fetchMapData(selectedState, geoLevel.toUpperCase() as 'DISTRICT' | 'PRECINCT');
      }
    }
  }, [selectedState, geoLevel, fetchMapData, arkansasData, newYorkData]);

  // Handle state selection and map updates
  useEffect(() => {
    if (!map) return;

    const fitToBound = (selectedState: string | null) => {
      map.invalidateSize();
      
      if (selectedState === "Arkansas") {
        map.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(36.501861, -89.730812),
            new L.LatLng(33.002096, -94.616242)
          ),
          {
            duration: 1.5,
            easeLinearity: 0.25
          }
        );
      } else if (selectedState === "New York") {
        map.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(45.018503, -72.100541),
            new L.LatLng(40.543843, -79.76278)
          ),
          {
            duration: 1.5,
            easeLinearity: 0.25
          }
        );
      } else {
        map.flyTo([37.8, -96], 4, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    };

    fitToBound(selectedState);

    // Clear existing layer
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current);
      geoLayerRef.current = null;
    }

    if (selectedState !== 'State') {
      const stateData = selectedState === 'Arkansas' ? arkansasData : newYorkData;
      const currentGeoData = stateData[geoLevel];

      if (currentGeoData) {
        const style = (feature: any): L.PathOptions => {
          let defaultStyle: L.PathOptions = {
            weight: 0.5,
            fillOpacity: 0.8,
          };

          if (showHeatmap && geoLevel === 'precinct') {
            const value = feature.properties?.['election data']?.['bidenVotes'] /
                         (feature.properties?.['election data']?.['bidenVotes'] + 
                          feature.properties?.['election data']?.['trumpVotes']);
            return {
              ...defaultStyle,
              fillColor: `hsl(${value * 240}, 70%, 50%)`,
              fillOpacity: 0.6
            };
          } else {
            const isDemo = feature.properties?.['election data']?.['bidenVotes'] > 
                          feature.properties?.['election data']?.['trumpVotes'];
            return {
              ...defaultStyle,
              fillColor: isDemo ? '#0000FF' : '#FF5733',
            };
          }
        };

        geoLayerRef.current = L.geoJSON(
          { type: 'FeatureCollection', features: currentGeoData } as GeoJsonObject,
          {
            style,
            onEachFeature: (feature, layer) => {
              layer.on({
                mouseover: highlightFeatures,
                mouseout: (e) => resetHighlight(e, geoLayerRef.current!),
                click: districtOnClick,
              });
            },
          }
        ).addTo(map);
      }
    }
  }, [
    map, 
    selectedState, 
    geoLevel, 
    arkansasData, 
    newYorkData, 
    showHeatmap, 
    highlightFeatures, 
    resetHighlight, 
    districtOnClick
  ]);

  return (
    <VStack spacing={4} align="stretch" height="100%" width="100%">
      <Center id="map" ref={mapRef} height="600px" width="100%" zIndex="1" />
    </VStack>
  );
};

export default USMap;