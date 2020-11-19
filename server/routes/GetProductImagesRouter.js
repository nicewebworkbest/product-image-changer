const Router = require('@koa/router');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const Shopify = require('shopify-api-node');
const atob = require('atob');

const GetProductImagesRouter = new Router()
const getShopifyIdFromBase64 = (( gid ) => {
  const shopifyId = gid.split("/").pop();
  return parseInt(shopifyId);
});

GetProductImagesRouter.get('/get-product-images', verifyRequest(), async (ctx) => {
	const { shop, accessToken } = ctx.session;
	const param = ctx.request.query;
	const shopify = new Shopify({
		shopName: shop,
  	accessToken: accessToken
	});

	if ( param.productId == null || param.productId == "" ) {
		ctx.body = '';
		ctx.res.statusCode = 400;
		return;
	}

	const productId = getShopifyIdFromBase64( param.productId );
	const images = await shopify.productImage.list( productId );
	ctx.body = images;
	ctx.res.statusCode = 200;
});

module.exports = GetProductImagesRouter;
