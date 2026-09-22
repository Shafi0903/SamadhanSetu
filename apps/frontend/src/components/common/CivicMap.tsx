"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";

export interface MapProblemPin {
  id: string;
  title: string;
  category: string;
  status: string;
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
}

export interface CivicMapProps {
  problems?: MapProblemPin[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  isPicker?: boolean;
  pickedLocation?: { lat: number; lng: number } | null;
  onLocationPicked?: (loc: { lat: number; lng: number }) => void;
  className?: string;
}

export function CivicMap({
  problems = [],
  center = [18.5204, 73.8567], // Pune coordinates default
  zoom = 13,
  height = "420px",
  isPicker = false,
  pickedLocation,
  onLocationPicked,
  className = "",
}: CivicMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<unknown>(null);
  const markersLayerRef = React.useRef<unknown>(null);
  const pickerMarkerRef = React.useRef<unknown>(null);

  React.useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: pickedLocation ? [pickedLocation.lat, pickedLocation.lng] : center,
        zoom,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // TileLayer: OpenStreetMap standard tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Markers LayerGroup
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Helper to generate custom divIcon
      const createPinIcon = (color: string, label: string) => {
        return L.divIcon({
          className: "civic-map-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -2px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
            ">
              ${label}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });
      };

      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case "WATER":
            return "#2563EB"; // Blue
          case "ROADS_INFRASTRUCTURE":
            return "#D97706"; // Amber
          case "WASTE_MANAGEMENT":
            return "#059669"; // Emerald
          case "ELECTRICITY_ENERGY":
            return "#EAB308"; // Yellow
          case "HEALTH_SANITATION":
            return "#DC2626"; // Red
          case "ENVIRONMENT":
            return "#16A34A"; // Green
          default:
            return "#4F46E5"; // Indigo
        }
      };

      // Add pins for problems
      problems.forEach((p) => {
        if (!p.latitude || !p.longitude) return;

        const color = getCategoryColor(p.category);
        const icon = createPinIcon(color, "📍");
        const marker = L.marker([p.latitude, p.longitude], { icon });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase;">
              ${p.category.replace("_", " ")}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #111827; margin: 4px 0 2px 0;">
              ${p.title}
            </div>
            <div style="font-size: 11px; color: #6B7280; margin-bottom: 8px;">
              ${p.address || p.city || "Designated Location"}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="
                background-color: #EEF2FF;
                color: #4F46E5;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 9999px;
                font-weight: 600;
              ">
                ${p.status.replace("_", " ")}
              </span>
              <a href="/challenge/${p.id}" style="
                font-size: 11px;
                font-weight: 600;
                color: #4F46E5;
                text-decoration: none;
              ">
                Inspect Issue →
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
      });

      // Click to pick location mode (for Citizen Intake Form)
      if (isPicker && onLocationPicked) {
        const pickerIcon = createPinIcon("#4F46E5", "📍");

        if (pickedLocation) {
          const m = L.marker([pickedLocation.lat, pickedLocation.lng], { icon: pickerIcon }).addTo(map);
          pickerMarkerRef.current = m;
        }

        map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          const lat = Number(e.latlng.lat.toFixed(5));
          const lng = Number(e.latlng.lng.toFixed(5));

          if (pickerMarkerRef.current) {
            (pickerMarkerRef.current as { setLatLng: (coords: [number, number]) => void }).setLatLng([lat, lng]);
          } else {
            const m = L.marker([lat, lng], { icon: pickerIcon }).addTo(map);
            pickerMarkerRef.current = m;
          }

          onLocationPicked({ lat, lng });
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, isPicker, onLocationPicked, pickedLocation, problems]);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {isPicker && (
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          Click anywhere on the map to pin grievance location
        </div>
      )}
    </div>
  );
}
