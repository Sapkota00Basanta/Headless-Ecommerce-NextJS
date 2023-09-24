export type IShopifyExtension = {
  cost: {
    requestedQueryCost: number;
    actualQueryCost: number;
    throttleStatus: {
      maximumAvailable: number;
      currentAvailable: number;
      restoreRate: number;
    };
  };
};

export type IShopifyProduct = {
  description: string;
  featuredImage: {
    altText: string;
    height: number;
    id: string;
    url: string;
    width: number;
  };
  handle: string;
  id: string;
  priceRangeV2: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  tags: Array<string>;
  title: string;
};
