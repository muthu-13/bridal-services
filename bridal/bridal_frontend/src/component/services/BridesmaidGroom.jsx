import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default images for Bridesmaid & Groom Services
const defaultServices = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAjBC0a-mdJ_rugCf8gvl3W49wBwf3X1nIlg&s",
    rating: 4.7,
    desc: "Bridesmaid Outfit Styling",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlCBo3IG3MrQcNWm3UlvOk2wwrWpdiT9gE3A&s",
    rating: 4.8,
    desc: "Groom Outfit Styling",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLuRSPZ25epsR1llc-yPgU1KoUI64CMaUX0A&s",
    rating: 4.6,
    desc: "Bridesmaid Makeup & Hair",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcKl0gW7jpLcf7njQYWqkjE6IyOIchJTnUUQ&s",
    rating: 4.9,
    desc: "Groom Wedding Styling",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb_6QZgQL35gNGqilYGsmex7tezEdt4pIPDQ&s",
    rating: 4.7,
    desc: "Bridesmaid Saree Draping",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtTXOD2hB99F3GuKdA5UAPvRFfk5CT_BSotQ&s",
    rating: 4.6,
    desc: "Groom Hair & Grooming",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrhVh3hEY-XSx8wg39ZUUBYKvTb6ja0R6Jw&s",
    rating: 4.5,
    desc: "Bridesmaid Jewellery Styling",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Iipz6JMGGp3h6itr9gl9MS1urvKNcH1eyg&s",
    rating: 4.8,
    desc: "Groom Sherwani Look",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShE5VTaBlWuhV8HCh4O3wIjLRdQNIhE5-wfA&s",
    rating: 4.7,
    desc: "Bridesmaid Coordinated Look",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUkkSiO8VscxYWdccavBImlDL1p1EJToppKQ&s",
    rating: 4.9,
    desc: "Groom Tuxedo Styling",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSdwRDgCFn6PwckKCXhrht5h2EGN2k58j3Vw&s",
    rating: 4.6,
    desc: "Bridesmaid Party Dresses",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn3Ihk5qP4LLVd4ps-COgWtY7fivwem-GjZQ&s",
    rating: 4.8,
    desc: "Groom Accessories Styling",
  },
];

const BridesmaidGroomServices = () => {
  const [dbServices, setDbServices] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
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
    incrementServiceView("/services/bridesmaid-groom");
    axios
      .get("http://localhost:5000/api/services/Bridesmaid & Groom Services")
      .then((res) => setDbServices(res.data))
      .catch((err) =>
        console.error("Error fetching Bridesmaid & Groom Services:", err)
      );
  }, []);

  // Merge default images and DB services
  const allServices = [
    ...defaultServices,
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
        <h2 className="service-title">Bridesmaid & Groom Services</h2>
        <div className="service-grid">
          {allServices.map((item, i) => {
            const isWishlisted = wishlist.find((w) => w.url === item.url);

            return (
              <div className="service-card" key={item.id || i}>
                <div className="image-container">
                  <img
                    src={item.url}
                    alt={item.desc}
                    className="service-img"
                    onClick={() => handleImageClick(item.url, item.desc, `/services/bridesmaid-groom_${item.id || i}`)}
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
                <div className="service-info">
                  <div className="service-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{item.rating}</span>
                  </div>
                  <p className="service-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RecommendedServices
        recommendations={[
          {
            title: "Wedding Dresses",
            img: "https://velacebridal.com/wp-content/uploads/2023/05/miami-bridal-store.0.0.jpg",
            link: "/services/dresses",
          },
          {
            title: "Bridal Hair Styling",
            img: "https://weddingsecrets.in/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-04-at-13.15.20.jpeg",
            link: "/services/BridalHairStyling",
          },
          {
            title: "Photography",
            img: "https://sahuphotographystudio.wordpress.com/wp-content/uploads/2017/11/new-couple-sees-photos-from-camera-love-scene.jpg?w=1400&h=875&crop=1",
            link: "/services/photography",
          },
        ]}
      />
    </div>
  );
};

export default BridesmaidGroomServices;