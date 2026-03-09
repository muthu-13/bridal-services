import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default Mehandi services (fallback)
const defaultServices = [
      {
        url: "http://pankhudihenna.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-04-08-at-14.29.09_6582c10f.jpg",
        rating: 4.8,
        desc: "Bridal Mehandi Design",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzXtgL93GbC7nbxmhAd5k938B7rjTxJCUbgg&s",
        rating: 4.7,
        desc: "Traditional Mehandi",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTfbLdiWgVtECQj1UT19WfLYD8pN2hIbc-ow&s",
        rating: 4.6,
        desc: "Stylish Full Hand Design",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqYHDB27C2o3IHXJgIEtHsjiot4QaeAPIqYXh03G9oZvRDyqQVuNwEzJAiHm7pS2AXPdY&usqp=CAU",
        rating: 4.9,
        desc: "Arabic Mehandi Design",
      },
      {
        url: "https://www.shaadibaraati.com/vendors-profile/1b26bb70d0bdbf9a47c42f7c64bbd35f.jpg",
        rating: 4.8,
        desc: "Intricate Bridal Mehandi",
      },
      {
        url: "https://img.jagrantv.com/webstories/ws336/1636384321-6.jpg",
        rating: 4.7,
        desc: "Festival Special Design",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDzuNs2P7rkp1w14LMIa-JsGpTtDuTljngNA&s",
        rating: 4.5,
        desc: "Unique Mehandi Style",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTamf02EM8CTYscNp5IB2f6Z0nzcXpEXY5EUA&s",
        rating: 4.6,
        desc: "Modern Bridal Design",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsMb1_Uyn44ZyN-n1xtElGPgbNK5AVoFr2wA&s",
        rating: 4.8,
        desc: "Hand & Arm Mehandi",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeh5hviVtS-KRtXhv2AtdoVw_CiWhOUI7jeg&s",
        rating: 4.9,
        desc: "Royal Mehandi Pattern",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmYTchRf5Ejaf4cjd9izYh5WjLCmcGa2R8Ag&s",
        rating: 4.7,
        desc: "Minimalist Mehandi Design",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJD9EpRSc3VCkV_V2q3UlAjaSsmptgAJ00Q&s",
        rating: 4.6,
        desc: "Bridal Feet Mehandi",
      },
];

const Mehandi = () => {
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
    incrementServiceView("/services/mehendi");
    axios
      .get("http://localhost:5000/api/services/Mehandi")
      .then((res) => setDbServices(res.data))
      .catch((err) => console.error("Error fetching Mehandi services:", err));
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
        <h2 className="service-title">Mehandi Services</h2>
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
                    onClick={() => handleImageClick(item.url, item.desc, `/services/mehendi_${item.id || i}`)}
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
            title: "Jewellery / Accessories",
            img: "https://www.littlefingersindia.com/wp-content/uploads/2022/07/LFbridalset299.jpg",
            link: "/services/jewellery",
          },
        ]}
      />
    </div>
  );
};

export default Mehandi;