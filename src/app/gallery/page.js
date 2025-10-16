'use client';

import { useEffect } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const photos = [
  {
    src: "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584988/1_v9wn9z.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/2_u3jeit.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/5_ywiy35.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/4_vfbuhn.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894911/Website/GalleryPhotos/5_d1yzj6.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894907/Website/GalleryPhotos/6_tdeu3f.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894910/Website/GalleryPhotos/7_rksjdx.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894909/Website/GalleryPhotos/8_zcrqg5.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/4_vbgeoc.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/10_ynwzre.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/11_j0p2me.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894907/Website/GalleryPhotos/12_thlfff.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894908/Website/GalleryPhotos/13_gaujtx.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894910/Website/GalleryPhotos/14_d0l5b1.jpg",
    width: 800,
    height: 600,
  },
  {
    src: "https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/3_memvg9.jpg",
    width: 800,
    height: 600,
  },
];

function CustomPhoto({ photo, width, height, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        aspectRatio: `${width} / ${height}`,
        borderRadius: "14px",
        overflow: "hidden",
        margin: "15px",
        backgroundColor: "#f0f0f0",
        cursor: "pointer",
      }}
    >
      <img
        src={photo.src}
        srcSet={`
    ${photo.src.replace("w_800,h_600", "w_400,h_300")} 400w,
    ${photo.src.replace("w_800,h_600", "w_600,h_450")} 600w,
    ${photo.src} 800w
  `}
        sizes="(max-width: 600px) 400px, (max-width: 900px) 600px, 800px"
        alt="Gallery Image"
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      />
    </div>
  );
}

export default function Gallery() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#020108] to-[#0a051a] py-20">
      <div className="mx-4 sm:mx-9 md:mx-28 p-3 mb-24 relative my-28">
        <h1 className="text-4xl sm:text-4xl md:text-6xl text-center mb-6 font-bold md:mb-9 text-white">
          Gallery
        </h1>

        <RowsPhotoAlbum
          photos={photos}
          render={{
            photo: ({ onClick }, { photo, width, height }) => (
              <CustomPhoto
                photo={photo}
                width={width}
                height={height}
                onClick={onClick}
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
