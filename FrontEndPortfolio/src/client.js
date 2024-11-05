import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: 'l04crhjd',
  dataset: 'production',
  apiVersion: '2022-03-05',
  useCdn: true,
  token: 'skVCydEdFWRi1SXoIlMvebhviurpbPiUYjDNN8i4uldiqAHXNjW9SW12vaPCk8pPjxAUTrEhS1UuI6SwL0M0UEO8wnzXATmdzJiVKTAQZG5kQNjhPmDvYJkAdGUCpGfJMr3uxPThNIy8xs0WqnDtXxM93o2fvmi5UOjYAtoqHWEaNWeM1Y3V',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);