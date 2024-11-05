import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Access environment variables correctly
export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID, // Use process.env to access
  dataset: 'production',
  apiVersion: '2022-03-05',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN, // Use process.env to access
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
