"use client";

import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import type { GeoJSON as LeafletGeoJSON, Layer, PathOptions } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import statesGeo from "@/data/us-states.json";
import { CONTRACTORS, rollupByState, STATE_NAME_TO_CODE } from "@/lib/data";
import { tierForContractor, TIER_STYLE } from "@/lib/status";
import type { StateRollup, StatusTier } from "@/lib/types";

const geo = statesGeo as unknown as FeatureCollection<Geometry, { name: string }>;

/** Color a state by its worst contractor status; states with no contractors stay neutral. */
function stateFill(rollup?: StateRollup): string {
  if (!rollup || rollup.contractor_count === 0) return "#cdd6e4";
  if (rollup.expired_count > 0) return TIER_STYLE.expired.fill;
  if (rollup.critical_count > 0) return TIER_STYLE.critical.fill;
  if (rollup.warning_count > 0) return TIER_STYLE.warning.fill;
  return TIER_STYLE.ok.fill;
}

interface Props {
  /** Optional: filter visible markers by state code (USPS two-letter). */
  selectedState?: string | null;
  /** Make the map taller for a focused /map view. */
  tall?: boolean;
  /** If true the map will navigate to /contractors?state=XX on state click. */
  clickToFilter?: boolean;
}

export default function USMap({ selectedState = null, tall = false, clickToFilter = true }: Props) {
  const router = useRouter();
  const layersRef = useRef<LeafletGeoJSON | null>(null);
  const [hovered, setHovered] = useState<{ name: string; code: string; rollup?: StateRollup } | null>(null);

  const rollups = useMemo(() => rollupByState(), []);

  const visibleContractors = useMemo(
    () => (selectedState ? CONTRACTORS.filter((c) => c.address.state === selectedState) : CONTRACTORS),
    [selectedState],
  );

  const styleFn = (feature?: Feature<Geometry, { name: string }>): PathOptions => {
    const name = feature?.properties?.name ?? "";
    const code = STATE_NAME_TO_CODE[name];
    const rollup = code ? rollups[code] : undefined;
    const isSelected = selectedState && code === selectedState;
    const isHover = hovered?.name === name;
    return {
      weight: isSelected ? 2.5 : isHover ? 1.5 : 0.7,
      color: isSelected ? "#0b1530" : "#ffffff",
      fillColor: stateFill(rollup),
      fillOpacity: rollup?.contractor_count ? 0.75 : 0.35,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, { name: string }>, layer: Layer) => {
    const name = feature.properties?.name ?? "";
    const code = STATE_NAME_TO_CODE[name];
    const rollup = code ? rollups[code] : undefined;
    layer.on({
      mouseover: () => setHovered({ name, code, rollup }),
      mouseout: () => setHovered((h) => (h?.name === name ? null : h)),
      click: () => {
        if (!clickToFilter || !code) return;
        router.push(`/contractors?state=${code}`);
      },
    });
  };

  return (
    <div className="relative">
      <div className={tall ? "h-[640px]" : "h-[460px]"}>
        <MapContainer
          center={[37.8, -96]}
          zoom={4}
          minZoom={3}
          maxZoom={9}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          worldCopyJump={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &middot; tiles &copy; <a href="https://www.carto.com/">Carto</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={geo}
            style={styleFn}
            onEachFeature={onEachFeature}
            ref={layersRef}
          />
          {visibleContractors.map((c) => {
            const tier: StatusTier = tierForContractor(c);
            const fill = TIER_STYLE[tier].fill;
            return (
              <CircleMarker
                key={c.id}
                center={[c.address.lat, c.address.lng]}
                radius={tier === "expired" || tier === "critical" ? 7 : 5}
                pathOptions={{
                  color: "#ffffff",
                  weight: 1.5,
                  fillColor: fill,
                  fillOpacity: 0.95,
                }}
                eventHandlers={{
                  click: () => router.push(`/contractors/${c.id}`),
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                  <div className="text-[12px]">
                    <div className="font-semibold">{c.company}</div>
                    <div className="text-slate-600">
                      {c.address.city}, {c.address.state} &middot; {TIER_STYLE[tier].label}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating legend */}
      <div className="absolute left-3 bottom-3 z-10 bg-white/95 backdrop-blur rounded-lg shadow-md px-3 py-2 text-xs">
        <div className="font-semibold text-slate-700 mb-1">State risk</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {(["expired","critical","warning","ok"] as StatusTier[]).map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm" style={{ background: TIER_STYLE[t].fill }} />
              <span className="text-slate-600">{TIER_STYLE[t].label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm" style={{ background: "#cdd6e4" }} />
            <span className="text-slate-600">No coverage</span>
          </div>
        </div>
      </div>

      {/* Hover panel */}
      <div className="absolute right-3 top-3 z-10 min-w-56 bg-white/95 backdrop-blur rounded-lg shadow-md px-3 py-2 text-sm">
        {hovered ? (
          <>
            <div className="font-semibold text-slate-800">{hovered.name}</div>
            {hovered.rollup ? (
              <div className="mt-1 text-xs text-slate-600 leading-5">
                {hovered.rollup.contractor_count} contractor{hovered.rollup.contractor_count === 1 ? "" : "s"}
                {hovered.rollup.expired_count > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                    {hovered.rollup.expired_count} expired
                  </span>
                )}
                {hovered.rollup.critical_count > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-red-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {hovered.rollup.critical_count} &lt; 30d
                  </span>
                )}
                {hovered.rollup.warning_count > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {hovered.rollup.warning_count} &lt; 90d
                  </span>
                )}
                <div className="mt-1 text-[11px] text-slate-500">Click to view contractors</div>
              </div>
            ) : (
              <div className="mt-1 text-xs text-slate-500">No contractors currently on file.</div>
            )}
          </>
        ) : (
          <div className="text-xs text-slate-500">Hover a state to see contractor coverage.</div>
        )}
      </div>
    </div>
  );
}
