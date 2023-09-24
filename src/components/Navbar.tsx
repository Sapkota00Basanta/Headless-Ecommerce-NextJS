import Link from "next/link";
import React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav>
      <h1 className="text-center text-3xl">Shopify + Next 13</h1>

      <ul className="text-center">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};
