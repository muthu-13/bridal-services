import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);


  // 🔁 Fetch wishlist only when logged in
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/api/wishlist/${user.id}`)
        .then((res) => setWishlist(res.data || []))
        .catch((err) =>
          console.error("❌ Wishlist fetch failed:", err.response?.data || err.message)
        );
    } else {
      setWishlist([]); // logout → clear wishlist
    }
  }, [user]);

  // ➕ Add to wishlist
  const addToWishlist = async (item) => {
    if (!user?.id) {
      alert("Please login to add items to your wishlist.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/wishlist", {
        user_id: user.id,
        url: item.url,
        desc: item.desc,
        rating: item.rating,
        price: item.price,
      });

      setWishlist([...wishlist, { id: res.data.id, user_id: user.id, ...item }]);
    } catch (err) {
      console.error("❌ Add to wishlist failed:", err.response?.data || err.message);
    }
  };

  // ❌ Remove from wishlist
  const removeFromWishlist = async (id) => {
    if (!user?.id) {
        const navigate = useNavigate();
      alert("Please login to remove items from your wishlist.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`);
      setWishlist(wishlist.filter((i) => i.id !== id));
    } catch (err) {
      console.error("❌ Remove from wishlist failed:", err.response?.data || err.message);
    }
  };

  // ❤️ Toggle wishlist
  const toggleWishlist = (item) => {
    if (!user?.id) {
      alert("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    const existing = wishlist.find((i) => i.url === item.url);
    if (existing) {
      removeFromWishlist(existing.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
