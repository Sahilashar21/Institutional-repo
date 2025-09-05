// src/components/HeroCarousel.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/assets/image1.jpg",
  "/assets/image-6.jpg",
  "/asstes/image3.jpg",
  // Add more image paths if needed
];

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // Auto-slide ON
    autoplaySpeed: 3000,     // 3 seconds between slides
    arrows: true,            // Manual navigation
    pauseOnHover: true,      // Pause when hovered
  };

  return (
    <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx}>
            <img
            src={src}
            alt={`Slide ${idx + 1}`}
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;


// // src/components/HeroCarousel.js
// import "slick-carousel/slick/slick.css";  
// import "slick-carousel/slick/slick-theme.css";

// import React from "react";
// import Slider from "react-slick";
// import { Box } from "@mui/material";


// const images = [
//   "/assets/jhcclg1.jpeg",
//   "/assets/jhcclg2.jpeg",
//   "/assets/jhcclg3.jpeg",
//   // Add more as needed
// ];

// const HeroCarousel = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//      arrows: true,                // Manual control (next/prev)
//     pauseOnHover: true, 
//   };

//   return (
//     <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
//       <Slider {...settings}>
//         {images.map((img, index) => (
//           <Box key={index} component="img" src={img} alt={`slide-${index}`} sx={{ width: "100%", height: "400px", objectFit: "cover" }} />
//         ))}
//       </Slider>
//     </Box>
//   );
// };

// export default HeroCarousel;
