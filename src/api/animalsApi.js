import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const animalsApi = createApi({
  reducerPath: "animalsApi",
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    getDogs: builder.query({
      query: () => "https://dog.ceo/api/breeds/image/random/12",
      transformResponse: (response) =>
        response.message.map((img, index) => {
          const parts = img.split("/");
          const breed = parts[4]?.replaceAll("-", " ") || `Dog ${index + 1}`;

          return {
            id: `dog-${index + 1}`,
            type: "dog",
            name: breed,
            image: img,
          };
        }),
    }),

    getCats: builder.query({
      query: () =>
        "https://api.thecatapi.com/v1/images/search?limit=20&has_breeds=true",
      transformResponse: (response) =>
        response.map((item, index) => ({
          id: item.id || `cat-${index + 1}`,
          type: "cat",
          name:
            item.breeds && item.breeds.length > 0
              ? item.breeds[0].name
              : `Unknown Cat ${index + 1}`,
          image: item.url,
        })),
    }),
  }),
});

export const { useGetDogsQuery, useGetCatsQuery } = animalsApi;