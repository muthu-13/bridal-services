import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default Jewellery services
const defaultServices = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1x16k8lGwUj0CD0rGZL3izskCILObPeE4qzax4q5Ri9-A4HCWrEilKxuFsHma8qSjl_Y&usqp=CAU",
    rating: 4.8,
    desc: "Traditional Coin Necklace Set",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTagJonsg3okffWkoZ2IaItujDfucHwgrQtDg&s",
    rating: 4.7,
    desc: "Temple Jewellery Set",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStjlmfsd3Ucbe91XckSOxZ6eBLIOGO7ACThw&s",
    rating: 4.6,
    desc: "Choker set with Earrings",
  },
  {
    url: "https://www.fnpvenues.com/wp-content/uploads/2023/04/Wedding-Jewllery.jpg",
    rating: 4.9,
    desc: "Complete Bridal Jewellery Set",
  },
  {
    url: "https://navrathansons.com/wp-content/uploads/2024/06/resize.jpg",
    rating: 4.8,
    desc: "Royal Diamond Necklace",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYI231nrCErMYxLYRdpgFtPdLLdKjEeYww8w&s",
    rating: 4.7,
    desc: "Pearl Bridal Set",
  },
  {
    url: "https://pbs.twimg.com/media/Df82iXsX0AAvSwj?format=jpg&name=large",
    rating: 4.5,
    desc: "Traditional Hair Accessories",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6qGHoD8_fDmIErHcHVAwKSIb68S8jn17UQ&s",
    rating: 4.6,
    desc: "Stylish Bridal Earrings",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvntO1DBNC7tuvOXHbaIVoaBJkJE-Wwxl3cg&s",
    rating: 4.8,
    desc: "Luxury Necklace Set",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ9TAozf2955cCY2wPJvmUPwLpg3C1W1bA_g&s",
    rating: 4.9,
    desc: "Gold & Diamond Combo",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNNJCb5MRlYl5ZAIcCcvqaaL1Z5MU8h49wqQ&s",
    rating: 4.7,
    desc: "Antique Bridal Jewellery",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyogUzjf-Vr2RGdxDc3FjPv1od7xkJ12m_3g&s",
    rating: 4.6,
    desc: "Bridal Hand Accessories",
  },
];

const Jewellery = () => {
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
    incrementServiceView("/services/jewellery");
    axios
      .get("http://localhost:5000/api/services/Jewellery")
      .then((res) => setDbServices(res.data))
      .catch((err) => console.error("Error fetching Jewellery services:", err));
  }, []);

  // Merge default + DB services
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
        <h2 className="service-title">Jewellery / Accessories</h2>
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
                    onClick={() => handleImageClick(item.url, item.desc, `/services/jewellery_${item.id || i}`)}
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
            title: "Bridal Makeup",
            img: "https://i.pinimg.com/736x/59/a3/34/59a334624ce6f7715e2d11840e80c868.jpg",
            link: "/services/bridalmakeup",
          },
          {
            title: "Bridal Hair Styling",
            img: "https://weddingsecrets.in/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-04-at-13.15.20.jpeg",
            link: "/services/BridalHairStyling",
          },
          {
            title: "Wedding Dresses",
            img: "https://velacebridal.com/wp-content/uploads/2023/05/miami-bridal-store.0.0.jpg",
            link: "/services/dresses",
          },
        ]}
      />
    </div>
  );
};

export default Jewellery;