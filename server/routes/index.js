const Router = require('@koa/router')
const GetProductsRouter = require('./GetProductsRouter')
const GetProductImagesRouter = require('./GetProductImagesRouter')

const registerRouter = new Router();
const nestedRoutes = [GetProductsRouter, GetProductImagesRouter]
for (var router of nestedRoutes) {
  registerRouter.use(router.routes(), router.allowedMethods())
}

module.exports = registerRouter
