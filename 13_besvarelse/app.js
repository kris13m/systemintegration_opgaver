import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

const app = express();

let bookId = 3;
let authorId = 2;

const books = [
  { id: "1", title: "The Shining", releaseYear: 1977, authorId: "1" },
  { id: "2", title: "It", releaseYear: 1986, authorId: "1" },
  { id: "3", title: "Foundation", releaseYear: 1951, authorId: "2" }
];

const authors = [
  { id: "1", name: "Stephen King" },
  { id: "2", name: "Isaac Asimov" }
];

// GraphQL Types

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "A book author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => books.filter(book => book.authorId === author.id)
    }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "A book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    releaseYear: { type: GraphQLInt },
    authorId: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find(author => author.id === book.authorId)
    }
  })
});

const SuccessMessageType = new GraphQLObjectType({
  name: "SuccessMessage",
  description: "Success response",
  fields: {
    message: { type: GraphQLString }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    books: {
      type: new GraphQLList(BookType),
      description: "Get all books",
      resolve: () => books
    },
    book: {
      type: BookType,
      description: "Get a book by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "Get all authors",
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: "Get an author by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  }
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBook: {
      type: BookType,
      description: "Create a new book",
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        releaseYear: { type: GraphQLInt }
      },
      resolve: (parent, { authorId, title, releaseYear }) => {
        const authorExists = authors.some(author => author.id === authorId);
        if (!authorExists) throw new Error("Author not found");

        const book = {
          id: (++bookId).toString(),
          title,
          releaseYear,
          authorId
        };

        books.push(book);
        return book;
      }
    },
    updateBook: {
      type: BookType,
      description: "Update a book by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        authorId: { type: GraphQLID },
        title: { type: GraphQLString },
        releaseYear: { type: GraphQLInt }
      },
      resolve: (parent, { id, authorId, title, releaseYear }) => {
        const book = books.find(b => b.id === id);
        if (!book) throw new Error("Book not found");

        if (authorId) {
          const authorExists = authors.some(a => a.id === authorId);
          if (!authorExists) throw new Error("Author not found");
          book.authorId = authorId;
        }
        if (title !== undefined) book.title = title;
        if (releaseYear !== undefined) book.releaseYear = releaseYear;

        return book;
      }
    },
    deleteBook: {
      type: SuccessMessageType,
      description: "Delete a book by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, { id }) => {
        const index = books.findIndex(b => b.id === id);
        if (index === -1) throw new Error("Book not found");
        books.splice(index, 1);
        return { message: "Book deleted successfully" };
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});