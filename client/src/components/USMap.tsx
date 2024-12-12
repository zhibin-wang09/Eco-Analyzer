import React, { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import { GeoJsonObject, Feature, Geometry } from "geojson";
import axios from "axios";
import statesData from "../map/state";
import { Box, HStack, Text } from "@chakra-ui/react";
import "../style/legend.css";
import "leaflet/dist/leaflet.css";
import { HeatmapType } from "./controls/HeatMapControls";
import MapLegend from "./MapLegend";
import DistrictPlanControls from "./controls/DistrictPlanControls";
import { Layer, PathOptions } from "leaflet";
import ComparisonOverlay from "./ComparisonOverlay";

interface FeatureLayer extends L.Layer {
  feature?: any;
  setStyle(style: L.PathOptions): this;
}

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
  geoLevel: "district" | "precinct";
  heatmapType: HeatmapType;
  selectedDistrict: number | null;
  selectedDemographic: string;
  onDistrictSelect?: (district: string | null) => void;
}

const USMap: React.FC<USMapProps> = ({
  onStateSelect,
  selectedState,
  selectedData,
  setDistrictData,
  geoLevel,
  heatmapType,
  selectedDistrict,
  selectedDemographic,
  onDistrictSelect,
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
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [districtPlanData, setDistrictPlanData] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedPlanNumber, setSelectedPlanNumber] = useState<string>("");

  const fetchDistrictPlan = async (state: string, planNumber: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/map/districtplan?state=${state.toLowerCase()}&districtPlan=${planNumber}`
      );
      setDistrictPlanData(response.data);
    } catch (error) {
      console.error("Error fetching district plan:", error);
    }
  };

  const fetchHeatmapData = useCallback(
    async (state: string, type: HeatmapType, demographicGroup?: string) => {
      if (type === "none") return null;

      const stateCode = state.toLowerCase().replace(" ", "");
      const baseUrl = "http://localhost:8080/api/heatmap";

      let url = "";
      switch (type) {
        case "demographic":
          url = `${baseUrl}/demographic?state=${stateCode}&demographicGroup=${
            demographicGroup || "white"
          }`;
          break;
        case "poverty":
          url = `${baseUrl}/poverty?state=${stateCode}`;
          break;
        case "economic":
          url = `${baseUrl}/economic?state=${stateCode}`;
          break;
        case "politicalincome":
          url = `${baseUrl}/politicalincome?state=${stateCode}`;
          break;
        default:
          return null;
      }

      try {
        const response = await axios.get(url);
        setHeatmapData(response.data);
        return response.data;
      } catch (error) {
        console.error(`Error fetching heatmap data: ${error}`);
        return null;
      }
    },
    []
  );

  const getHeatmapStyle = useCallback(
    (feature: any): L.PathOptions => {
      const defaultStyle: L.PathOptions = {
        color: "#000",
        weight: 0.5,
        fillOpacity: 0.8,
      };

      if (!feature.properties?.data) {
        return {
          ...defaultStyle,
          fillColor: "#FFFFFF",
        };
      }

      if (heatmapType === "none") {
        const isDemo =
          feature.properties?.["election data"]?.["bidenVotes"] >
          feature.properties?.["election data"]?.["trumpVotes"];
        return {
          ...defaultStyle,
          fillColor: isDemo ? "#0000FF" : "#FF5733",
        };
      }

      let fillColor;
      switch (heatmapType) {
        case "demographic":
          fillColor =
            feature.properties.data["demographic shading"] || "#FFFFFF";
          break;
        case "poverty":
          fillColor = feature.properties.data["poverty shading"] || "#FFFFFF";
          break;
        case "economic":
          fillColor = feature.properties.data["income shading"] || "#FFFFFF";
          break;
        case "politicalincome":
          fillColor =
            feature.properties.data["income_shading_by_party"] || "#FFFFFF";
          break;
        default:
          fillColor = "#FFFFFF";
      }

      return {
        ...defaultStyle,
        fillColor,
      };
    },
    [heatmapType]
  );

  const highlightFeatures = useCallback((e: L.LeafletMouseEvent) => {
    const layer = e.target as FeatureLayer;
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

  useEffect(() => {
    if (selectedDistrict && geoLayerRef.current) {
      geoLayerRef.current.eachLayer((layer: any) => {
        if (
          layer.feature &&
          Number(layer.feature.properties.geoId) === selectedDistrict
        ) {
          // Highlight the selected district
          layer.setStyle({
            weight: 5,
            color: "#666",
            dashArray: "",
            fillOpacity: 0.7,
          });
          const bounds = layer.getBounds();
          map?.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding for better visibility
        } else if (layer.feature) {
          // Reset other layers' styles
          layer.setStyle({
            weight: 0.5,
            color: "#000",
            fillOpacity: 0.8,
          });
        }
      });
    } else if (!selectedDistrict && geoLayerRef.current) {
      // Reset styles when no district is selected
      geoLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature) {
          layer.setStyle({
            weight: 0.5,
            color: "#000",
            fillOpacity: 0.8,
          });
        }
      });

      // if no district is selected zoom back out to the state level
      if (selectedState === "Arkansas") {
        map?.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(36.501861, -89.730812),
            new L.LatLng(33.002096, -94.616242)
          ),
          { duration: 1.5, easeLinearity: 0.25 }
        );
      } else if (selectedState === "New York") {
        map?.flyToBounds(
          new L.LatLngBounds(
            new L.LatLng(45.018503, -72.100541),
            new L.LatLng(40.543843, -79.76278)
          ),
          { duration: 1.5, easeLinearity: 0.25 }
        );
      } else {
        // Default to a region-level zoom if no specific state is selected
        map?.flyTo([37.8, -96], 4, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    }
  }, [selectedDistrict, selectedState]);

  const handleCompare = useCallback(
    (planNumber: string) => {
      if (selectedState) {
        fetchDistrictPlan(selectedState, planNumber);
      }
    },
    [selectedState]
  );

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

  const fetchMapData = useCallback(
    async (state: string, type: "DISTRICT" | "PRECINCT") => {
      try {
        const stateCode = state.toLowerCase().replace(" ", "");
        const response = await axios.get(
          `http://localhost:8080/api/map?state=${stateCode}&geoType=${type}`
        );

        if (response.data) {
          if (state === "Arkansas") {
            setArkansasData((prev) => ({
              ...prev,
              [type.toLowerCase()]: response.data,
            }));
          } else if (state === "New York") {
            setNewYorkData((prev) => ({
              ...prev,
              [type.toLowerCase()]: response.data,
            }));
          }
        }
      } catch (error) {
        console.error(
          `Error fetching ${type.toLowerCase()} data for ${state}:`,
          error
        );
      }
    },
    []
  );

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

      setMap(initialMap);
    }
  }, [map, highlightFeatures, onClick, resetHighlight]);

  // Effect to fetch data when state or geoLevel changes
  useEffect(() => {
    if (selectedState === "Arkansas" || selectedState === "New York") {
      const stateData =
        selectedState === "Arkansas" ? arkansasData : newYorkData;

      if (!stateData[geoLevel]) {
        fetchMapData(
          selectedState,
          geoLevel.toUpperCase() as "DISTRICT" | "PRECINCT"
        );
      }
    }
  }, [selectedState, geoLevel, fetchMapData, arkansasData, newYorkData]);

  // Effect to handle heatmap updates
  useEffect(() => {
    if (selectedState && geoLevel === "precinct" && heatmapType !== "none") {
      fetchHeatmapData(selectedState, heatmapType, selectedDemographic);
    }
  }, [
    selectedState,
    geoLevel,
    heatmapType,
    selectedDemographic,
    fetchHeatmapData,
  ]);

  // Handle state selection and map updates
  useEffect(() => {
    if (!map) return;
    // Ensure map resizes correctly when container size changes
    if (map) {
      setTimeout(() => map.invalidateSize(), 1000) // This will make sure that the map recalculates its size after layout changes)
    }

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
            easeLinearity: 0.25,
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
            easeLinearity: 0.25,
          }
        );
      } else {
        map.flyTo([37.8, -96], 4, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      }
    };

    fitToBound(selectedState);

    // Clear existing layer
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current);
      geoLayerRef.current = null;
    }

    if (selectedState !== "State") {
      const stateData =
        selectedState === "Arkansas" ? arkansasData : newYorkData;
      const currentGeoData = stateData[geoLevel];

      if (currentGeoData) {
        const layerData =
          heatmapType !== "none" && heatmapData
            ? heatmapData
            : { type: "FeatureCollection", features: currentGeoData };

        const getLayerStyle = (feature: any) => {
          if (geoLevel === "district") {
            // Handle district plan comparison view
            if (districtPlanData) {
              const planFeature = districtPlanData.features.find(
                (f: any) => f.properties.number === feature.properties.number
              );
              return {
                fillColor: planFeature ? "#FFD700" : "#FFFFFF",
                color: "#000",
                weight: 0.5,
                fillOpacity: 0.8,
              };
            }
            // Default district style
            return {
              fillColor: "#FFFFFF",
              color: "#000",
              weight: 0.5,
              fillOpacity: 0.8,
            };
          }
          // Precinct style (heatmap)
          return getHeatmapStyle(feature);
        };

        geoLayerRef.current = L.geoJSON(layerData as GeoJsonObject, {
          style: getLayerStyle,
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: highlightFeatures,
              mouseout: (e) => resetHighlight(e, geoLayerRef.current!),
            });
          },
        }).addTo(map);
      }
    }
  }, [
    map,
    selectedState,
    geoLevel,
    arkansasData,
    newYorkData,
    heatmapType,
    heatmapData,
    districtPlanData,
    highlightFeatures,
    resetHighlight,
    getHeatmapStyle,
  ]);

  return (
    <Box
      height={selectedState !== "State" ? "calc(55vh - 20px)" : "400px"}
      position="relative"
    >
      <Box
        id="map"
        ref={mapRef}
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
      />

      {selectedState !== "State" && geoLevel === "district" && (
        <>
          <DistrictPlanControls
            selectedDistrict={null}
            onCompare={(planNumber) => {
              setSelectedPlanNumber(planNumber);
              setIsComparisonOpen(true);
            }}
            state={selectedState}
            isVisible={true}
          />
          <ComparisonOverlay
            isOpen={isComparisonOpen}
            onClose={() => setIsComparisonOpen(false)}
            currentState={selectedState ?? ""}
            currentGeoJson={geoLayerRef.current?.toGeoJSON()}
            districtPlanNumber={selectedPlanNumber}
          />
        </>
      )}

      {/* Heatmap Legend */}
      {selectedState !== "State" && geoLevel === "precinct" && (
        <MapLegend
          heatmapType={heatmapType}
          selectedDemographic={selectedDemographic}
        />
      )}

      {/* District Plan Comparison Legend */}
      {districtPlanData && geoLevel === "district" && (
        <Box
          position="absolute"
          bottom="20px"
          left="10px"
          bg="rgba(255, 255, 255, 0.9)"
          p={2}
          borderRadius="md"
          boxShadow="sm"
          zIndex={1000}
        >
          <Text fontSize="sm" fontWeight="medium">
            District Plan Comparison
          </Text>
          <HStack mt={1} spacing={3}>
            <HStack>
              <Box w="12px" h="12px" bg="#FFD700" borderRadius="sm" />
              <Text fontSize="xs">Changed Districts</Text>
            </HStack>
            <HStack>
              <Box
                w="12px"
                h="12px"
                bg="#FFFFFF"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="sm"
              />
              <Text fontSize="xs">Unchanged Districts</Text>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default USMap;
