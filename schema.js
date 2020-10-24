const { gql } = require('apollo-server-express');

const typeDefs = gql`
   type Movie {
     id: ID!
     name: String!
     producer: String!
     rating: Float!
   }
   type Query {
     getMovies: [Movie]
     getMovie(id: ID!): Movie
   }
   type Mutation {
     addMovie(name: String!, producer: String!, rating: Float!): Movie
     updateMovie(id: ID!, name: String!, producer: String!, rating: Float): Movie
     deleteMovie(id: ID!) : String
   }
`

const Movie = require('./models/movie').Movies;

const resolvers = {
    Query: {
        getMovies: (parent, args) => {
            return Movie.find({});
        },
        getMovie: (parent, args) => {
            return Movie.findById(args.id);
        }
    },
    Mutation: {
        addMovie: (parent, args) => {
            $: aMovie = new Movie({
                name: args.name,
                producer: args.producer,
                rating: args.rating,
            });
            return aMovie.save();
        },
        updateMovie: (parent, args) => {
            if (!args.id) return;
            return Movie.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        name: args.name,
                        producer: args.producer,
                        rating: args.rating,
                    }
                }, { new: true }, (err, Movie) => {
                    if (err) {
                        console.log('Something went wrong when updating the movie');
                    } else {
                    }
                }
            );
        },
        deleteMovie: (parent, args) => {
            if (!args.id) return;
            console.log('delete Movie ' + args.id);
            Movie.deleteOne(
                {
                    _id: args.id
                }, (err, Movie) => {
                    if (err) {
                        console.log('Something went wrong when updating the movie');
                        return err
                    } else {
                        return "OK"
                    }
                }
            );
        }
    }
}

module.exports = { typeDefs, resolvers };