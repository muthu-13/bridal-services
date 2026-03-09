import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// ✅ Default Wedding Decorations
const defaultServices = [
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-JbyZGLUbXB_ROTdmF4K-8lDJRpoJIoqb0Q&s",
    rating: 4.8,
    desc: "Elegant Stage Decoration",
  },
  {
    url: "https://www.eventmaaster.com/uploads/manage_service/photo/main/1747294013pexels-asadphoto-169211.jpg",
    rating: 4.7,
    desc: "Outdoor Wedding Setup",
  },
  {
    url: "https://content3.jdmagicbox.com/comp/jabalpur/q4/9999px761.x761.170704160119.a7q4/catalogue/s-s-event-and-wedding-planner-madan-mahal-jabalpur-event-organisers-djsdvablv0.jpg",
    rating: 4.6,
    desc: "Luxury Hall Decorations",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwCpMzJW2ywYtGQak6487xLrTPA-vVOxG7xw&s",
    rating: 4.9,
    desc: "Traditional Mandap Design",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHNGCP4-grhAmGaq-TBA04NAkNiez2Sb8sQ&s",
    rating: 4.7,
    desc: "Floral Wedding Backdrop",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC8G3iIQrFBhufyGpVSLamfA82EtZVLpSInw&s",
    rating: 4.5,
    desc: "Theme Based Decor",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuAOXbsDBRWCiB8vxSMvbIlxpHYa0OfKf4dg&s",
    rating: 4.6,
    desc: "Grand Entrance Decoration",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgz53pq6hUpUAblm0m6zDNWkpB7yU_317xsA&s",
    rating: 4.8,
    desc: "Stage with LED Lighting",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUiBEmZa4FGVCzik9-aIMwAfNGruNlPvroFA&s",
    rating: 4.9,
    desc: "Royal Wedding Setup",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUABYAlnI0W_2fbY8CdWfAuL5Zp-klRAufPA&s",
    rating: 4.7,
    desc: "Elegant Reception Stage",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSrevP6oKuj9P6MZAeXJFP47gxrjnbxjz-MQ&s",
    rating: 4.5,
    desc: "Garden Wedding Decor",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Yq1c4wDp3UjeIIRIgzjKw6oQA08Y9X_U3g&s",
    rating: 4.6,
    desc: "Indoor Luxury Decor",
  },
];

const WeddingDecoration = () => {
  const [dbServices, setDbServices] = useState([]);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(UserContext);

  const handleImageClick = (imageUrl, description, uniqueKey) => {
    const email = user?.email || user?.username || user?.id;
    if (!email) return;

    const key = `recentlyViewed_${email}`;
    const viewed = JSON.parse(localStorage.getItem(key)) || [];
    const newItem = { key: uniqueKey, image: imageUrl, desc: description };
    const updated = [
      newItem,
      ...viewed.filter((v) => v.image !== imageUrl),
    ].slice(0, 12);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // ✅ Fetch backend services
  useEffect(() => {
    incrementServiceView("/services/decoration");
    axios
      .get("http://localhost:5000/api/services/Wedding Decorations")
      .then((res) => setDbServices(res.data))
      .catch((err) =>
        console.error("Error fetching Wedding Decorations:", err)
      );
  }, []);

  // ✅ Merge default + db
  const allServices = [
    ...defaultServices,
    ...dbServices.map((item) => ({
      url: item.image_url,
      rating: item.rating,
      desc: item.description,
    })),
  ];

  return (
    <div className="services-page">
      <div className="service-section">
        <h2 className="service-title">Wedding Decorations</h2>
        <div className="service-grid">
          {allServices.map((item, i) => {
            const isInWishlist = wishlist.find((w) => w.url === item.url);

            return (
              <div className="service-card" key={i}>
                <div className="image-container">
                  <img
                    src={item.url}
                    alt={item.desc}
                    className="service-img"
                    onClick={() =>
                      handleImageClick(
                        item.url,
                        item.desc,
                        `/services/decoration_${item.id || i}`
                      )
                    }
                  />
                  <button
                    className={`wishlist-btn${isInWishlist ? " liked" : ""}`}
                    onClick={() => toggleWishlist(item)}
                  >
                    {isInWishlist ? "❤" : "🤍"}
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
            title: "Photography",
            img: "https://sahuphotographystudio.wordpress.com/wp-content/uploads/2017/11/new-couple-sees-photos-from-camera-love-scene.jpg?w=1400&h=875&crop=1",
            link: "/services/photography",
          },
          {
            title: "Wedding Dresses",
            img: "https://velacebridal.com/wp-content/uploads/2023/05/miami-bridal-store.0.0.jpg",
            link: "/services/dresses",
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

export default WeddingDecoration;