import React, { useState, useEffect } from "react";
import IProduct from "../../interface/IProduct";
import { getProductService } from "../../service/productService";
import Link from 'next/link';  
import { FaShoppingCart } from 'react-icons/fa'; 
import Image from 'next/image'; 

interface GetProductsProps {
  onCartUpdate?: (count: number) => void;
}

const GetProducts: React.FC<GetProductsProps> = ({ onCartUpdate }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cart, setCart] = useState<IProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopupVisible, setPopupVisible] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${process.env.API_URL}/products`;
        console.log("Fetching - products from:", url);
        
        // Hacer la petición y obtener la respuesta
        const response = await fetch(url);
        
        // Comprobar que la respuesta es válida y JSON
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }

        const data = await response.json(); // Intentar parsear el JSON
        console.log("Productos recibidos:", data);
        
        setProducts(data); // Guardar los productos en el estado
      } catch (error: any) {
        console.error("Error al obtener productos:", error.message);
        setError("Error al obtener productos. Verifica la respuesta de la API.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(existingCart);
    setCartCount(existingCart.length);

    if (onCartUpdate && typeof onCartUpdate === "function") {
      onCartUpdate(existingCart.length);
    } else {
      console.warn("onCartUpdate no está definido o no es una función");
    }
  }, [onCartUpdate]);

  const addToCart = (product: IProduct) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Por favor, inicia sesión para agregar productos al carrito.");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = existingCart.find((item: IProduct) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      existingCart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);
    setCartCount(existingCart.length);

    if (onCartUpdate) {
      onCartUpdate(existingCart.length);
    }

    // Mostrar el popup y luego recargar la página después de 2 segundos
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      window.location.reload(); // Recargar la página después de 2 segundos
    }, 2000);
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 m-2 hover:shadow-xl hover:scale-105 transform transition-transform transition-shadow duration-300">
            <h1 className="text-xl font-bold mb-2">{product.name}</h1>
            <Link href={`/product/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={500} 
                height={500}
                className="w-full h-auto rounded-lg mb-2"
              />
              <h3 className="text-lg font-semibold mt-2">Precio: ${product.price}</h3>
              <p className="text-sm mt-2"><strong>Stock:</strong> {product.stock}</p>
            </Link>
            <button onClick={() => addToCart(product)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetProducts;
