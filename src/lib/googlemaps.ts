import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ["places"],
});

export const loadGoogleMaps = async () => {
  await loader.importLibrary("maps");
  await loader.importLibrary("places");
};
