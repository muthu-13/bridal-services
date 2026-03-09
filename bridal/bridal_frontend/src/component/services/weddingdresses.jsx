import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../Services.css";
import { WishlistContext } from "../../context/WishlistContext";
import { UserContext } from "../../context/UserContext";
import { incrementServiceView } from "../utils/analytics";
import RecommendedServices from "../RecommendedServices";

// Default Wedding Dresses & Outfits
const defaultServices = [
{
        url: "https://static3.azafashions.com/tr:w-450/uploads/product_gallery/1730201398208_1.jpg",
        rating: 4.9,
        desc: "Red Bridal Lehenga with Zari Embroidery",
        price: "₹58,000",
      },
      {
        url: "https://medias.utsavfashion.com/media/catalog/product/cache/1/image/500x/040ec09b1e35df139433887a97daa66f/e/m/embroidered-net-lehenga-in-pink-v1-lcc623_3.jpg",
        rating: 4.7,
        desc: "Pink Net Embroidered Lehenga Choli",
        price: "₹49,999",
      },
      {
        url: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQERfbxIt9Wh6vgmRGdPX7HuF90MdCs5SplPbFi6vGifXgmgnHHRp2JtODWvR_XazUu1eFX25SX2hfx1Pl5S2_4KfCSwd21yfYTfVgT6ZQce99U7Sf7zJdn",
        rating: 4.8,
        desc: "Yellow Banarasi Silk Lehenga Choli",
        price: "₹55,000",
      },
      {
        url: "https://www.inddus.com/cdn/shop/files/1008C-1.jpg?v=1749553720",
        rating: 4.6,
        desc: "Green Embroidered Bridal Lehenga",
        price: "₹42,000",
      },
      {
        url: "https://media.samyakk.com/pub/media/catalog/product/m/a/maroon-sequins-embroidered-bridal-net-gown-with-v-neck-jb3226.jpg",
        rating: 4.7,
        desc: "Maroon Heavy Embroidered Bridal Lehenga",
        price: "₹59,999",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAJ23UfKm3oXYFFPR-QtYpcrC35MKQUM3LYg&s",
        rating: 4.8,
        desc: "Blue Embroidered Navratri Lehenga",
        price: "₹28,500",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsDKzGaH20cjdJtK95mmtn6YODXqEN4YHjiA&s",
        rating: 4.8,
        desc: "Royal Blue Bridal Gown",
        price: "₹1,50,000",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcfI9U6IPslivKl2qaUMFxCU3Uwzixj-aWGw&s",
        rating: 4.9,
        desc: "Golden Indian Bridal Saree",
        price: "₹1,20,000",
      },
      {
        url: "https://m.media-amazon.com/images/I/71eenZfaIJL.jpg",
        rating: 4.7,
        desc: "Orange Woven Tissue Lehenga Set",
        price: "₹35,000",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt71X0fL_03OsR6LPgm_CHQBh13Vo4wma0uA&",
        rating: 4.9,
        desc: "Elegant Chiffon Embroidered Gown",
        price: "₹1,75,000",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQfr_F8kSasgo7J0w-QUxi5NyP5-f7o0VesMp6xBXpcxoRauvsBpkrAa_wrKOI1UqiPaYBnn5F0_ZcgEv3493BoejvJRnvPbMy7VRag-OYczfqnWIpfZSu2dMI&usqp=CAc",
        rating: 4.7,
        desc: "Black Saree with Golden Embroidery",
        price: "₹80,000",
      },
      {
        url: "https://www.kollybollyethnics.com/image/catalog/data/26Jun2019/Two-Tone-Yellow-Kanchipurami-Silk-Rich-Zari-Work-Kanchipuram-Silk-Saree-63343.jpg",
        rating: 4.8,
        desc: "Peach Embroidered Georgette Lehenga",
        price: "₹35,000",
      },
 
];

const WeddingDresses = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const [dbServices, setDbServices] = useState([]);
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
    incrementServiceView("/services/dresses");
    axios
      .get("http://localhost:5000/api/services/Wedding Dresses")
      .then((res) => setDbServices(res.data))
      .catch((err) => console.error("Error fetching Wedding Dresses:", err));
  }, []);

  // Merge default + database services
  const allServices = [
    ...defaultServices,
    ...dbServices.map((item) => ({
      url: item.image_url,
      rating: item.rating,
      desc: item.description,
      price: item.price || "N/A",
    })),
  ];

  return (
    <div className="services-page">
      <div className="service-section">
        <h2 className="service-title">Bridal Wedding Dresses & Outfits</h2>
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
                    onClick={() => handleImageClick(item.url, item.desc, `/services/dresses_${item.id || i}`)}
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
                  <p className="service-price">{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RecommendedServices
        recommendations={[
          {
            title: "Jewellery / Accessories",
            img: "https://www.littlefingersindia.com/wp-content/uploads/2022/07/LFbridalset299.jpg",
            link: "/services/jewellery",
          },
          {
            title: "Bridal Makeup",
            img: "https://i.pinimg.com/736x/59/a3/34/59a334624ce6f7715e2d11840e80c868.jpg",
            link: "/services/bridalmakeup",
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

export default WeddingDresses;