import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default Photography services (fallback)
const defaultServices = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2lq6eeRBB4oKA-31C3nfyK9qDHtPRjTLC9w&s",
    rating: 4.8,
    desc: "Creative Wedding Photography",
  },
  {
    url: "https://media.greatbigphotographyworld.com/wp-content/uploads/2022/04/canon-cameras-for-wedding-photography.jpg",
    rating: 4.7,
    desc: "Candid Wedding Moments",
  },
  {
    url: "https://media.greatbigphotographyworld.com/wp-content/uploads/2022/04/top-cameras-for-marriage.jpg",
    rating: 4.9,
    desc: "Premium Camera Shots",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV7IIevpmTynazon0TJn_tdCd_TyIj9R3Uyg&s",
    rating: 4.6,
    desc: "Artistic Couple Portraits",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgQMd-i9u1v_ve22Ts01R4TtA_I7uTrvEouA&s",
    rating: 4.5,
    desc: "Traditional Wedding Photography",
  },
  {
    url: "https://4.imimg.com/data4/PM/DL/MY-985365/wedding-videography-500x500.jpeg",
    rating: 4.8,
    desc: "Wedding Videography",
  },
  {
    url: "https://i.pinimg.com/736x/69/0a/42/690a42c7a850d651409d3d61b88ca0e6.jpg",
    rating: 4.7,
    desc: "Event Highlight Photography",
  },
  {
    url: "https://5.imimg.com/data5/SELLER/Default/2023/12/371822985/TI/BB/NQ/65205324/wedding-photography.jpg",
    rating: 4.9,
    desc: "Bridal & Groom Photography",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThGv5NA3jv0kdYfszpsZ_vSCHhZfTybbs7taFaT4Odd32UjW1597FlmIAnLuglql7NN3g&usqp=CAU",
    rating: 4.6,
    desc: "Outdoor Couple Shoots",
  },
  {
    url: "https://www.the-photography-blogger.com/wp-content/uploads/2018/03/wedding-photography-camera-settings-tips-4.jpg",
    rating: 4.4,
    desc: "Behind the Scenes Photography",
  },
  {
    url: "https://pearlmansioncharlotte.com/wp-content/uploads/2025/05/Wedding-Photography-Tips-683x1024.png",
    rating: 4.8,
    desc: "Venue & Decor Photography",
  },
  {
    url: "https://media.istockphoto.com/id/1254633705/photo/filming-wedding-online-social-distancing-new-normal-concept.jpg?s=612x612&w=0&k=20&c=n-V0Wz-Is8X8M8TIUuj4ZdphhlhSqI2ssvLqFkI4Bhc=",
    rating: 4.7,
    desc: "Live Wedding Streaming",
  },
];

const Photography = () => {
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
    incrementServiceView("/services/photography");
    axios
      .get("http://localhost:5000/api/services/Photography")
      .then((res) => setDbServices(res.data))
      .catch((err) =>
        console.error("Error fetching Photography services:", err)
      );
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
        <h2 className="service-title">Photography</h2>
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
                    onClick={() => handleImageClick(item.url, item.desc, `/services/photography_${item.id || i}`)}
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
            title: "Wedding Decoration",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKAuzpkvh-mTw7ULBuaty8WKjoKvUxQD9IPg&s",
            link: "/services/decoration",
          },
          {
            title: "Wedding Dresses",
            img: "https://velacebridal.com/wp-content/uploads/2023/05/miami-bridal-store.0.0.jpg",
            link: "/services/dresses",
          },
          {
            title: "Bridesmaid & Groom Services",
            img: "https://i.pinimg.com/736x/3d/24/d7/3d24d71cbddd85615efe4b7617b003b1.jpg",
            link: "/services/bridesmaid-groom",
          },
        ]}
      />
    </div>
  );
};

export default Photography;