import React from "react";
import { Link } from "react-router-dom";
import { getGlobalViews } from "./utils/analytics";
import "./mostlyViewedTicker.css";

// Map of services with their image & route
const ALL_SERVICES = [
  {
    key: "/services/bridalmakeup",
    title: "Bridal Makeup",
    img: "https://i.pinimg.com/originals/44/e6/b4/44e6b47db17afe2a4378a09d75d22054.jpg",
    link: "/services/bridalmakeup",
  },
  {
    key: "/services/photography",
    title: "Photography",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2lq6eeRBB4oKA-31C3nfyK9qDHtPRjTLC9w&s",
    link: "/services/photography",
  },
  {
    key: "/services/BridalHairStyling",
    title: "Bridal Hair Styling",
    img: "https://cdn.shopify.com/s/files/1/0591/6422/9806/files/classic_south_indian_braid.jpg?v=1750251206",
    link: "/services/BridalHairStyling",
  },
  {
    key: "/services/jewellery",
    title: "Jewellery / Accessories",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1x16k8lGwUj0CD0rGZL3izskCILObPeE4qzax4q5Ri9-A4HCWrEilKxuFsHma8qSjl_Y&usqp=CAU",
    link: "/services/jewellery",
  },
  {
    key: "/services/mehendi",
    title: "Mehandi",
    img: "http://pankhudihenna.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-04-08-at-14.29.09_6582c10f.jpg",
    link: "/services/mehendi",
  },
  {
    key: "/services/decoration",
    title: "Wedding Decoration",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-JbyZGLUbXB_ROTdmF4K-8lDJRpoJIoqb0Q&s",
    link: "/services/decoration",
  },
  {
    key: "/services/dresses",
    title: "Wedding Dresses",
    img: "https://static3.azafashions.com/tr:w-450/uploads/product_gallery/1730201398208_1.jpg",
    link: "/services/dresses",
  },
  {
    key: "/services/bridesmaid-groom",
    title: "Bridesmaid & Groom Services",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAjBC0a-mdJ_rugCf8gvl3W49wBwf3X1nIlg&s",
    link: "/services/bridesmaid-groom",
  },
];

export default function MostlyViewedTicker({ topN = 5, showTitles = true }) {
  const views = getGlobalViews();

  const sorted = [...ALL_SERVICES]
    .map((s) => ({ ...s, count: views[s.key] || 0 }))
    .sort((a, b) => b.count - a.count);

  const items = sorted.slice(0, topN);
  if (items.length === 0) return null;

  const tickerItems = [...items, ...items]; // duplicate for seamless scroll

  return (
    <section className="mv-wrapper">
      <div className="mv-title">Mostly Viewed</div>
      <div className="mv-ticker">
        <div className="mv-track">
          {tickerItems.map((s, idx) => (
            <div className="mv-item" key={`${s.key}-${idx}`}>
              <Link to={s.link} className="mv-link">
                <div className="mv-card">
                  <img src={s.img} alt={s.title} className="mv-img" />
                  {showTitles && <div className="mv-desc">{s.title}</div>}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}