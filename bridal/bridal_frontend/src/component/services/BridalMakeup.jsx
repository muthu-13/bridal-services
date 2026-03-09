import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default images for Bridal Makeup
const defaultServices = [
  {
    url: "https://i.pinimg.com/originals/44/e6/b4/44e6b47db17afe2a4378a09d75d22054.jpg",
    rating: 4.8,
    desc: "Traditional South Indian Bridal Look",
  },
  {
    url: "https://content.jdmagicbox.com/v2/comp/chennai/j5/044pxx44.xx44.240111232616.s5j5/catalogue/sam-s-bridal-makeup-valasaravakkam-chennai-makeup-artists-opr5n45r4t.jpg",
    rating: 4.9,
    desc: "HD Airbrush Makeup",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-xyc6dg15IIhKjOStG8msK1VxP8RRZlkaHQ&s",
    rating: 4.7,
    desc: "Matte Finish Bridal Look",
  },
  {
    url: "https://d146hunxuupfmg.cloudfront.net/blogbodyimage/2024/12/27/indian-bridal-makeup-photos.webp",
    rating: 4.6,
    desc: "Smokey Eye Bridal Makeup",
  },
  {
    url: "https://i.ytimg.com/vi/ycMC2K-DG6c/hq720.jpg",
    rating: 4.5,
    desc: "Natural Glam Look",
  },
  {
    url: "https://www.zorainsstudio.com/wp-content/uploads/2021/01/Level-1-Bridal-Makeup-Hair-Course-in-Bangalore.jpg",
    rating: 4.8,
    desc: "Royal Bridal Makeup",
  },
  {
    url: "https://mjgorgeous.com/wp-content/uploads/2020/12/MACost2.jpg",
    rating: 4.4,
    desc: "Dewy Finish Makeup",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7RRkI6nZdbbjL642aKmSmfxhMEGKD_rOdg&s",
    rating: 4.7,
    desc: "Bold Eye Makeup",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDCmaMAJVaX_uLg_WHbIyqBIsOKKI0r7CfSg&s",
    rating: 4.6,
    desc: "Elegant Bridal Style",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXqIlgOVJiCAQqGubLoett3TKdLbvtvQP43w&s",
    rating: 4.3,
    desc: "Vintage Bridal Look",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuQiIipGQVw6vyOUPoY14i0QTJLJ0-wiA58A&s",
    rating: 4.5,
    desc: "Modern Bridal Makeup",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTosiLVtd8JvpuF0OVmd3fGIpljeg346S_5d7DVEJzBpPRLrDtZkHHZKnaskvoEZwkQIGQ&usqp=CAU",
    rating: 4.9,
    desc: "Heavy Bridal Makeup",
  },
];

const BridalMakeup = () => {
  const [dbServices, setDbServices] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const { user } = useContext(UserContext);

  const handleImageClick = (imageUrl, description, uniqueKey) => {
    const email = user?.email || user?.username || user?.id;
    if (!email) return; // only track for logged-in users
    const key = `recentlyViewed_${email}`;
    const viewed = JSON.parse(localStorage.getItem(key)) || [];
    const newItem = { key: uniqueKey, image: imageUrl, desc: description };
    const updated = [newItem, ...viewed.filter((v) => v.image !== imageUrl)].slice(0, 12);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  useEffect(() => {
    incrementServiceView("/services/bridalmakeup");
    axios
      .get("http://localhost:5000/api/services/Bridal Makeup")
      .then((res) => setDbServices(res.data))
      .catch((err) =>
        console.error("Error fetching Bridal Makeup services:", err)
      );
  }, []);

  // combine default + db
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
        <h2 className="service-title">Bridal Makeup</h2>
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
                    onClick={() => handleImageClick(item.url, item.desc, `/services/bridalmakeup_${item.id || i}`)}
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
            title: "Bridal Hair Styling",
            img: "https://weddingsecrets.in/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-04-at-13.15.20.jpeg",
            link: "/services/BridalHairStyling",
          },
          {
            title: "Jewellery / Accessories",
            img: "https://www.littlefingersindia.com/wp-content/uploads/2022/07/LFbridalset299.jpg",
            link: "/services/jewellery",
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

export default BridalMakeup;