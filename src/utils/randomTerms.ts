export const randomSearchTerms = [
  'Avengers', 'Inception', 'The Matrix', 'Interstellar',
  'Gladiator', 'Titanic', 'The Godfather', 'Pulp Fiction',
  'The Dark Knight', 'Fight Club', 'Forrest Gump', 'Jurassic Park',
  'The Shawshank Redemption', 'The Lord of the Rings', 'Star Wars', 'Harry Potter',
  'Blade Runner', 'La La Land', 'Mad Max', 'Whiplash',
  'Dune', 'Coco', 'Parasite', 'Spirited Away',
  'The Social Network', 'Black Swan', 'Arrival', 'The Grand Budapest Hotel',
  'Her', 'Moonlight', 'The Green Mile', 'Logan',
];

export const getRandomSearchTerm = () =>
  randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
