import React from 'react';

const BestSellingProducts = () => {
  // Sample data
  const products = [
    { name: 'Product A', sales: 200 },
    { name: 'Product B', sales: 150 },
    { name: 'Product C', sales: 100 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold">Best Selling Products</h3>
      <ul className="mt-2">
        {products.map((product, index) => (
          <li key={index} className="flex justify-between">
            <span>{product.name}</span>
            <span>{product.sales} Sales</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestSellingProducts;
