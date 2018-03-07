'use strict'

/**
 * adonis-graphql
 *
 * @license MIT
 * @copyright Slynova - Romain Lanz <romain.lanz@slynova.ch>
 */

const { graphqlAdonis } = require('apollo-server-adonis')
const { makeExecutableSchema } = require('graphql-tools')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

class GraphQLServer {
  constructor (config) {
    const typeDefs = fileLoader(config.get('graphql.schema'))
    const resolvers = fileLoader(config.get('graphql.resolvers'))
    this.$schema = makeExecutableSchema({ typeDefs, resolvers })
    console.log('HERE')
  }

  $handleError (error) {
    return {
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
   }
  }

  handle (context, options = {}) {
    return graphqlAdonis({
      context,
      schema: this.$schema,
      formatError: this.$handleError,
      ...options
    })(context)
  }
}

module.exports = GraphQLServer
