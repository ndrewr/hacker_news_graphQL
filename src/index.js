const { GraphQLServer } = require('graphql-yoga')

let links = [{
	id: 'link-0',
	url: 'www.howtographql.com',
	description: 'Fullstack tutorial for GraphQL',
}]

let idCount = links.length

const resolvers = {
	Query: {
		info: () => null,
		feed: () => links,	
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link)
			return link
		},
		updateLink: (root, args) => {
			const targetIndex = links.findIndex((element) => element.id === args.id)
			console.log('updating...', targetIndex, ~targetIndex)
			if (~targetIndex) {
				links[targetIndex] = {
					id: args.id,
					url: args.url || links[targetIndex].url,
					description: args.description || links[targetIndex].description,
				}
			}
			return ~targetIndex ? links[targetIndex] : undefined
		},
		deleteLink: (root, args) => {
			const targetIndex = links.findIndex((elem) => elem.id === args.id)
			if (~targetIndex) {
				return	links.splice(targetIndex, 1)[0]
			}
			return undefined
		}
	},
/* below resolvers are so trivial they can be omitted
	Link: {
		id: (root) => root.id,
		description: (root) => root.description,
		url: (root) => root.url,
	}
*/
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))

