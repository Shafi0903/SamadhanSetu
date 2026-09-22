"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { CivicMap } from "@/components/common/CivicMap";
import { apiRequest } from "@/lib/api";
import {
  MapPinIcon,
  PhotoIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const CATEGORY_OPTIONS = [
  { value: "WATER", label: "Water Supply & Leakages" },
  { value: "ROADS_INFRASTRUCTURE", label: "Roads, Potholes & Bridges" },
  { value: "WASTE_MANAGEMENT", label: "Garbage & Waste Disposal" },
  { value: "ELECTRICITY_ENERGY", label: "Electricity & Streetlights" },
  { value: "HEALTH_SANITATION", label: "Health & Public Sanitation" },
  { value: "ENVIRONMENT", label: "Environment & Pollution" },
  { value: "EDUCATION", label: "Public School Infrastructure" },
  { value: "OTHER", label: "Other Civic Issues" },
];

export default function NewProblemPage() {
  const router = useRouter();

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("ROADS_INFRASTRUCTURE");
  const [description, setDescription] = React.useState("");

  // Geolocation
  const [latitude, setLatitude] = React.useState<number>(18.5204); // Default to Pune coordinates
  const [longitude, setLongitude] = React.useState<number>(73.8567);
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("Pune");
  const [state, setState] = React.useState("Maharashtra");
  const [pincode, setPincode] = React.useState("411005");
  const [detectingLoc, setDetectingLoc] = React.useState(false);

  // Media
  const [mediaUrlInput, setMediaUrlInput] = React.useState("");
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(5)));
        setLongitude(Number(pos.coords.longitude.toFixed(5)));
        setDetectingLoc(false);
      },
      (err) => {
        console.error(err);
        setDetectingLoc(false);
        alert("Unable to fetch exact GPS. You can manually enter your address.");
      }
    );
  };

  const addMediaUrl = () => {
    if (mediaUrlInput.trim()) {
      setMediaUrls([...mediaUrls, mediaUrlInput.trim()]);
      setMediaUrlInput("");
    }
  };

  const removeMedia = (idx: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiRequest("/api/problems", {
        method: "POST",
        body: JSON.stringify({
          title,
          category,
          description,
          latitude,
          longitude,
          address,
          city,
          state,
          pincode,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop"],
        }),
      });

      router.push("/dashboard/citizen");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to report issue");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="Report Civic Issue" roleLabel="Citizen" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Citizen Dashboard
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report a Grassroots Civic Challenge</CardTitle>
                <CardDescription>
                  Your report will be verified by local municipal officers and surfaced to university solvers.
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Step {step} of 3
              </span>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-2 pt-3">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-gray-200"}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? "bg-indigo-600" : "bg-gray-200"}`} />
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Issue Category & Description */}
              {step === 1 && (
                <div className="space-y-4">
                  <Select
                    label="Challenge Domain / Category"
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />

                  <Input
                    label="Issue Title"
                    required
                    placeholder="e.g. Severe waterlogging at Senapati Bapat Road junction"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Textarea
                    label="Detailed Description"
                    required
                    rows={4}
                    placeholder="Describe the issue, how long it has persisted, and how it impacts local residents..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="button"
                      disabled={title.length < 5 || description.length < 15}
                      onClick={() => setStep(2)}
                    >
                      Next: Add Location
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Location & GPS Tagging */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4 text-indigo-600" />
                        Interactive Pin & GPS Coordinate Tagging
                      </h4>
                      <p className="text-xs text-indigo-700 mt-0.5">
                        Pinned Coordinates: Lat {latitude}, Lng {longitude}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={detectLocation}
                      isLoading={detectingLoc}
                    >
                      Detect My GPS
                    </Button>
                  </div>

                  {/* Interactive Map Pinning */}
                  <CivicMap
                    height="280px"
                    center={[latitude, longitude]}
                    isPicker={true}
                    pickedLocation={{ lat: latitude, lng: longitude }}
                    onLocationPicked={(loc) => {
                      setLatitude(loc.lat);
                      setLongitude(loc.lng);
                    }}
                  />

                  <Input
                    label="Street Address / Landmark"
                    required
                    placeholder="e.g. Near Symbiosis College Gate 2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="City"
                      required
                      placeholder="Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      label="State"
                      required
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                    <Input
                      label="Pincode"
                      required
                      placeholder="411004"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>

                  <div className="pt-2 flex justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={!address || !city}
                      onClick={() => setStep(3)}
                    >
                      Next: Add Media Evidence
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Photos / Media Evidence & Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Photos or Evidence Links (Optional)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste image or photo URL (e.g. https://...)"
                        value={mediaUrlInput}
                        onChange={(e) => setMediaUrlInput(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addMediaUrl}
                        disabled={!mediaUrlInput}
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      A default civic illustration will be used if no photo URL is provided.
                    </p>
                  </div>

                  {mediaUrls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Attached Media:</p>
                      <div className="flex flex-wrap gap-2">
                        {mediaUrls.map((url, i) => (
                          <div
                            key={i}
                            className="text-xs bg-gray-100 text-gray-800 rounded-md px-2.5 py-1 flex items-center gap-1.5"
                          >
                            <PhotoIcon className="w-4 h-4 text-gray-500" />
                            <span className="max-w-[200px] truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeMedia(i)}
                              className="text-gray-400 hover:text-red-500 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary preview box */}
                  <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-2 text-sm">
                    <h5 className="font-semibold text-gray-900">Summary Verification:</h5>
                    <p className="text-gray-700">
                      <strong>Title:</strong> {title}
                    </p>
                    <p className="text-gray-700">
                      <strong>Category:</strong> {category}
                    </p>
                    <p className="text-gray-700">
                      <strong>Location:</strong> {address}, {city}, {state} - {pincode}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      isLoading={submitting}
                      className="flex items-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Submit Civic Grievance
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
