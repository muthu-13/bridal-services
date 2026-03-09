import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default images for Bridal Hair Styling
const defaultImages = [
  {
    url: "https://cdn.shopify.com/s/files/1/0591/6422/9806/files/classic_south_indian_braid.jpg?v=1750251206",
    rating: 4.8,
    desc: "Classic South Indian Braid",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5ti5Mh8ZmuEdY4VvONthAmyZQIYuIp2pHlA&s",
    rating: 4.7,
    desc: "Traditional Floral Bun",
  },
  {
    url: "https://www.yesmadam.com/blog/wp-content/uploads/2022/11/South-Indian-Braid-Bridal-Hairstyle-5.jpg",
    rating: 4.6,
    desc: "South Indian Braid with Ornaments",
  },
  {
    url: "https://webneel.com/wnet/file/images/8-17/6-indian-bridal-hairstyle-flowers.jpg",
    rating: 4.9,
    desc: "Floral Decorated Hairstyle",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_c1p5gv63ibexoIifaf2sOGcnYs1twBzGVw&s",
    rating: 4.7,
    desc: "Side Braided Bun",
  },
  {
    url: "https://media.weddingz.in/images/20200331203113/82333288_510204769630464_179100910700785749_n-1-800x1000.jpg",
    rating: 4.8,
    desc: "Elegant Bridal Bun",
  },
  {
    url: "https://vizagpellipoolajada.com/wp-content/uploads/2023/07/floral-hair-bun-cover-with-pink-colour-roses-1-re62bc279393-hair-original-imageyjnwga9fzbw.png",
    rating: 4.9,
    desc: "Floral Hair Bun with Roses",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_3sYsg4LanTfFPA8JDmA2mQAgzewk5Z3Ww&s",
    rating: 4.6,
    desc: "Twisted Floral Bun",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREYX0BKcv3spKnoixg7MrAEWpe6mBmKm1zLQ&s",
    rating: 4.7,
    desc: "Bridal Long Braid",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlkUQtK4MTsUtphnXgXCzXrdTOws-GbzQaHA&s",
    rating: 4.8,
    desc: "Bridal Loose Curls",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfp6WDplXCFLVwtxISIo8K7QRezB_PbuaPrQ&s",
    rating: 4.6,
    desc: "Decorated Hair Bun",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC_GfBpZqVB0BSXyBMSZQxL2XilBaa3PuO7A&s",
    rating: 4.9,
    desc: "Grand Bridal Hairstyle",
  },
];

const BridalHairStyling = () => {
  const [dbServices, setDbServices] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);

  const handleImageClick = (imageUrl, description, uniqueKey) => {
    const email = user?.email || user?.username || user?.id;
    if (!email) return;
    const key = `recentlyViewed_${email}`;
    const viewed = JSON.parse(localStorage.getItem(key)) || [];
    const newItem = { key: uniqueKey, image: imageUrl, desc: description };
    const updated = [newItem, ...viewed.filter((v) => v.image !== imageUrl)].slice(0, 12);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  useEffect(() => {
    incrementServiceView("/services/BridalHairStyling");
    axios
      .get("http://localhost:5000/api/services/Bridal Hair Styling")
      .then((res) => setDbServices(res.data))
      .catch((err) =>
        console.error("Error fetching Bridal Hair Styling services:", err)
      );
  }, []);

  // Merge default images and DB services (both flat arrays)
  const allServices = [
    ...defaultImages,
    ...dbServices.map((item) => ({
      id: item.id,
      url: item.image_url,
      rating: item.rating,
      desc: item.description,
    })),
  ];

  return (
    <div className="services-page">
      <div className="service-section">
        <h2 className="service-title">Bridal Hair Styling</h2>
        <div className="service-grid">
          {allServices.map((item, i) => {
            const isWishlisted = wishlist.find((w) => w.url === item.url);

            return (
              <div className="service-card" key={i}>
                <div className="image-container">
                  <img
                    src={item.url}
                    alt={item.desc}
                    className="service-img"
                    onClick={() => handleImageClick(item.url, item.desc, `/services/BridalHairStyling_${item.id || i}`)}
                  />
                  <button
                    className={`wishlist-btn${isWishlisted ? " liked" : ""}`}
                    onClick={() =>
                      isWishlisted
                        ? removeFromWishlist(isWishlisted.id)
                        : addToWishlist(item)
                    }
                  >
                    {isWishlisted ? "❤" : "🤍"}
                  </button>
                </div>
                <p className="service-rating">⭐ {item.rating}</p>
                <p className="service-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <RecommendedServices
        recommendations={[
          {
            title: "Bridal Makeup",
            img: "https://i.pinimg.com/736x/59/a3/34/59a334624ce6f7715e2d11840e80c868.jpg",
            link: "/services/bridalmakeup",
          },
          {
            title: "Jewellery / Accessories",
            img: "https://www.littlefingersindia.com/wp-content/uploads/2022/07/LFbridalset299.jpg",
            link: "/services/jewellery",
          },
          {
            title: "Mehendi",
            img: "https://i.pinimg.com/736x/db/cd/6a/dbcd6a632b10ada57c6b0e86b74a541e.jpg",
            link: "/services/mehendi",
          },
        ]}
      />
    </div>
  );
};

export default BridalHairStyling;