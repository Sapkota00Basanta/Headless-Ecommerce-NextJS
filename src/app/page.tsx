import { IShopifyExtension, IShopifyProduct } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { gql } from "@/utils/gql";
import Image from "next/image";
import Link from "next/link";

export interface IGraphQLResponse {
  data: {
    products: {
      nodes: Array<IShopifyProduct>;
    };
  };
  extensions: IShopifyExtension;
}

const getProducts = async (): Promise<IGraphQLResponse> => {
  const response = await fetch(process.env.GRAPHQL_API_URL! || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN || "",
    },
    body: JSON.stringify({
      query: gql`
        query ProductsQuery {
          products(first: 6) {
            nodes {
              description
              featuredImage {
                altText
                height
                id
                url
                width
              }
              handle
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
        }
      `,
    }),
  });

  // Check if there is any error
  if (!response.ok) {
    const text = await response.text();

    throw new Error(`
      Failed to fetch data
      Status: ${response.status}
      Response: ${text}
    `);
  }

  return response.json();
};

const HomePage = async () => {
  const json = await getProducts();

  return (
    <div className="main">
      <ul>
        {json &&
          json.data.products.nodes.map((item, index) => {
            const productID = item.id.split("/").pop();

            return (
              <div
                className="flex justify-center items-center"
                key={`key-${item}-${index}`}
              >
                <div className="w-[300px]">
                  <Image
                    src={item.featuredImage.url}
                    alt={item.featuredImage.altText}
                    width={item.featuredImage.width}
                    height={item.featuredImage.height}
                    className="h-96 w-full object-cover"
                    placeholder="blur"
                    blurDataURL={item.featuredImage.url}
                  />
                </div>
                <div className="flex flex-col justify-center gap-y-2 p-5">
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <span key={`span-${tag}-${index}`}>{tag}</span>
                    ))}

                  <h3>{item.title}</h3>

                  <h4>
                    {formatPrice(item.priceRangeV2.minVariantPrice.amount)}{" "}
                    {item.priceRangeV2.minVariantPrice.currencyCode}
                  </h4>

                  <p className="max-w-xs ">{item.description}</p>

                  <Link
                    href={`/product/${productID}`}
                    className="border border-blue-600 text-white bg-black text-sm p-2 max-w-fit"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default HomePage;
