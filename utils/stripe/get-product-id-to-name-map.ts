import { Stripe, stripe } from './init';

const getProductIdToNameMap = async (productIds: string[]): Promise<Record<string, string>> => {
  const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
    limit: 50,
    ids: productIds,
  });

  const productIdToNameMap: Record<string, string> = {};
  products?.data?.forEach((product: Stripe.Product) => {
    productIdToNameMap[product.id] = product.name;
  });

  return productIdToNameMap;
};
export default getProductIdToNameMap;
