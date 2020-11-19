const Router = require('@koa/router');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const Shopify = require('shopify-api-node');

const GetProductsRouter = new Router()
GetProductsRouter.get('/get-products', verifyRequest(), async (ctx) => {
	const { shop, accessToken } = ctx.session;
	const param = ctx.request.query;
	const shopify = new Shopify({
		shopName: shop,
  	accessToken: accessToken
	});

	let subQuery1 = ``,
		subQuery2 = `first:	$numProducts`;

	if ( param.beforeAfter != null && param.beforeAfter != "" && param.cursor != null && param.cursor != "" ) {
		subQuery1 = `, $cursor: String`;
		if ( param.beforeAfter == 'after' ) {
			subQuery2 = `first: $numProducts, ` + param.beforeAfter +`: $cursor,`;
		} else {
			subQuery2 = `last: $numProducts, ` + param.beforeAfter +`: $cursor,`;
		}
	}

	const query =`query	getProducts($numProducts: Int!,	$query: String` + subQuery1 + `) {
		products(`+ subQuery2 +` query: $query)	{
			pageInfo	{
				hasNextPage
				hasPreviousPage
			}
			edges	{
				cursor
				node	{
					id
					title
					featuredImage {
						id
						originalSrc
					}
				}
			}
		}
	}`;

	let variables = {
		"numProducts": 3,
		"query": "title:" + param.searchProductText + "*"
	}

	if ( param.cursor != null && param.cursor != "" ) {
		variables.cursor = param.cursor;
	}

	const data = await shopify.graphql(query, variables);

	let result = {};
	result.pageInfo = data.products.pageInfo;
	result.products = [];
	data.products.edges.forEach( item => {
		let product_info = {};

		try {
			product_info.cursor = item.cursor;
		} catch (e) {
			product_info.cursor = "";
		}

		try {
			product_info.id = item.node.id;
		} catch (e) {
			product_info.id = "";
		}

		try {
			product_info.title = item.node.title;
		} catch (e) {
			product_info.title = "";
		}

		try {
			product_info.imgSrc = item.node.featuredImage.originalSrc;
		} catch (e) {
			product_info.imgSrc = "";
		}

		result.products.push( product_info );
	});

	if ( result.products.length != 0 ) {
		result.pageInfo.beforeCursor = result.products[0].cursor;
		result.pageInfo.afterCursor = result.products[result.products.length - 1].cursor;
	}

	ctx.body = result;
	ctx.res.statusCode = 200;
});

module.exports = GetProductsRouter;
