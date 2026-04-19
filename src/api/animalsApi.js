import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const formatDogBreed = (imageUrl) => {
  const parts = imageUrl.split("/");
  const breedPart = parts[4] || "";
  const breedPieces = breedPart.split("-").filter(Boolean);

  if (breedPieces.length === 0) return "Unknown Dog";

  return breedPieces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const animalsApi = createApi({
  reducerPath: "animalsApi",
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    getDogs: builder.query({
      query: () => "https://dog.ceo/api/breeds/image/random/12",
      transformResponse: (response) =>
        response.message.map((img, index) => ({
          id: `dog-${index}`,
          type: "dog",
          name: formatDogBreed(img),
          image: img,
          temperament: "Playful and loyal",
          origin: "Unknown",
          lifeSpan: "10 - 13 years",
          description: "A cute dog from the Dog CEO API.",
        })),
    }),

    getCats: builder.query({
      query: () =>
        "https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1",
      transformResponse: (response) =>
        response.map((item, index) => {
          const breed = item.breeds?.[0];

          return {
            id: item.id || `cat-${index}`,
            type: "cat",
            name: breed?.name || "Unknown Cat",
            image: item.url,
            temperament: breed?.temperament || "Unknown",
            origin: breed?.origin || "Unknown",
            lifeSpan: breed?.life_span || "Unknown",
            description: breed?.description || "A cute cat from The Cat API.",
          };
        }),
    }),
  }),
});

export const { useGetDogsQuery, useGetCatsQuery } = animalsApi;