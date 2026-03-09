import React, { useState, useEffect } from "react";


import axios from "axios";
const services = [
  {
    title: "Bridal Makeup",
    images: [
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
        url: "https://anshimakeupartist.com/wp-content/uploads/2023/11/makeupbyanshiagarwal_1699379679_3230953386023012734_6436165993.jpg",
        rating: 4.7,
        desc: "Matte Finish Bridal Look",
      },
      {
        url: "https://d146hunxuupfmg.cloudfront.net/blogbodyimage/2024/12/27/indian-bridal-makeup-photos.webp",
        rating: 4.6,
        desc: "Smokey Eye Bridal Makeup",
      },
      {
        url: "https://i.ytimg.com/vi/ycMC2K-DG6c/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAuIBRotWXYH9l0O69DasV0_0Sd5w",
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
    ],
  },
  {
    title: "Hair Styling",
    images: [
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
    ],
  },
  {
    title: "Mehendi",
    images: [
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
    ],
  },
  {
    title: "Jewellery & Accessories",
    images: [
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
    ],
  },
  {
    title: "Wedding Dresses",
    images: [
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
    ],
  },
  {
    title: "Photography",
    images: [
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
    ],
  },
  {
    title: "Wedding Decorations",
    images: [
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
    ],
  },
];
const Services = () => {
const [servicesData, setServicesData] = useState([]);

useEffect(() => {
  axios.get("http://localhost:5000/api/services")
    .then(res => setServicesData(res.data))
    .catch(err => {
      console.error(err);
      setServicesData(services); // fallback to hardcoded array
    });
}, []);

  return (
    <div className="services-page">
      {services.map((service, idx) => (
        <div className="service-section" key={idx}>
          <h2 className="service-title">{service.title}</h2>
          <div className="service-grid">
            {service.images.map((item, i) => (
              <div className="service-card" key={i}>
                <img src={item.url} alt={item.desc} className="service-img" />
                <div className="service-info">
                  <div className="service-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{item.rating}</span>
                  </div>
                  <p className="service-desc">{item.desc}</p>
                  {item.price && <p className="service-price">{item.price}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};




export default Services;
