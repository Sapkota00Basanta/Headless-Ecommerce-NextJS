import { IShopifyExtension, IShopifyProduct } from "@/types";
import { gql } from "@/utils/gql";
import React from "react";
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";

interface IGraphQLResponseTypes {
  data: {
    product: IShopifyProduct;
  };
  extension: IShopifyExtension;
}

type ISingleProductPageProps = {
  params: {
    id: string;
  };
};

const getSingleProduct = async (id: string): Promise<IGraphQLResponseTypes> => {
  const response = await fetch(process.env.GRAPHQL_API_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN || "",
    },
    body: JSON.stringify({
      query: gql`
        query SingelProductQuery($id: ID!) {
          product(id: $id) {
            description
            featuredImage {
              altText
              height
              id
              url
              width
            }
            id
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            title
          }
        }
      `,
      variables: {
        id: `gid://shopify/Product/${id}`,
      },
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();

    throw new Error(`
        Failed to fetch single product
        StatusCode: ${response.status}
        Response: ${responseText}
    `);
  }

  return response.json();
};

const SingleProductPage: React.FC<ISingleProductPageProps> = async ({
  params,
}) => {
  const singleProductResponse = await getSingleProduct(params.id);
  const { product } = singleProductResponse.data;
  return (
    <div className="flex flex-row gap-5 items-center justify-center">
      <div className="w-[300px]">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          height={product.featuredImage.height}
          width={product.featuredImage.width}
          placeholder="blur"
          blurDataURL={product.featuredImage.url}
        />
      </div>
      <div className="flex flex-col">
        {product.tags &&
          product.tags.map((tag, index) => (
            <span key={`key-${tag}-${index}`}>{tag}</span>
          ))}

        <h3 className="text-bold text-2xl"> {product.title}</h3>

        <h4>
          {formatPrice(product.priceRangeV2.minVariantPrice.amount)}
          {product.priceRangeV2.minVariantPrice.currencyCode}
        </h4>

        <p> {product.description}</p>

        <button className="w-[300px] bg-orange-400 text-white hover:bg-white hover:text-black hover:cursor-pointer rounded-lg border p-2">
          Add to Cart
        </button>

        <span>Note: Add to cart functionality is still on hold</span>
      </div>
    </div>
  );
};

export default SingleProductPage;
