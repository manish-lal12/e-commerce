import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import pagination from "./utils/pagination";

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  //Login State
  const [user, setUser] = useState(null);
  const [hasUserFetched, setHasUserFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  //Home Page States
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    searchTerm: "",
    searchId: "",
    sort: "asc",
    category: "",
  });
  // Product State
  const [cart, setCart] = useState({ items: [] });
  const [order, setOrder] = useState({
    subTotal: null,
    tax: null,
    total: null,
  });

  const fetchProducts = async (url) => {
    setIsProductsLoading(true);
    const response = await fetch(`${baseUrl}/product`);
    const products = await response.json();
    if (response.status !== 404) {
      setProducts(pagination(products.products));
      setIsProductsLoading(false);
    } else {
      setIsProductsLoading(false);
    }
  };

  const fetchLoginUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${baseUrl}/user/showCurrentUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            console.log("here"); // check for momoize or callback to prevent fetching again and again
            // setFetchedUser(data.user);
            // If there is an error, set User to empty
            setLoading(false);
          } else {
            setUser();
            // setFetchedUser();
            console.log("yep");

            setLoading(false);
          }
          setHasUserFetched(true);
        });
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl]);

  const handlePrev = () => {
    setPage((oldPage) => {
      let newPage = oldPage - 1;
      if (newPage < 0) {
        newPage = products.length - 1;
      }
      return newPage;
    });
  };

  const handleNext = () => {
    setPage((oldPage) => {
      let newPage = oldPage + 1;
      if (newPage > products.length - 1) {
        newPage = 0;
      }
      return newPage;
    });
  };

  useEffect(() => {
    let url = `${baseUrl}/product `;
    fetchProducts(url);
    if (!hasUserFetched) {
      fetchLoginUserDetails();
    }
  }, [fetchLoginUserDetails, hasUserFetched]);

  return (
    <ThemeContext.Provider
      value={{
        baseUrl,
        products,
        page,
        loading,
        searchQuery,
        user,
        isProductsLoading,
        cart,
        order,
        setProducts,
        setPage,
        setLoading,
        setSearchQuery,
        handlePrev,
        handleNext,
        setUser,
        setIsProductsLoading,
        setCart,
        setOrder,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(ThemeContext);
};

export { ThemeContext, ThemeProvider };
