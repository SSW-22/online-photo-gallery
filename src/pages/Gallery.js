/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { IoFootstepsSharp } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { navActions } from "../store/nav-slice";
import ArcText from "../components/ArcText";
import GalleryThumbnail from "../components/galleryPage/GalleryThumbnail";
import UserGallery from "../components/galleryPage/UserGallery";
import GalleryLoading from "../components/galleryPage/GalleryLoading";

const options = {
  threshold: 0.015,
};

function Gallery({ previewData, setClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    title,
    subtitle,
    thumbnailBgColor,
    thumbnailTextColor,
    images,
    email,
    lightMode,
  } = location.state || previewData;

  const galleryRef = useRef();
  const divRef = useRef();
  const [galleryVisible, setGalleryVisible] = useState();
  const [zoomed, setZoomed] = useState(false);
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  const textColor = lightMode === "light" ? "black" : "white";

  // Scroll event to change all icon's color when user move tha section from tumbnail to gallery
  useEffect(() => {
    if (imgsLoaded) {
      /** Trigger observer when scrolling to the gallery section */
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        // whenever the user get into gallery section, it will return true. Otherwise, it will return false
        setGalleryVisible(entry.isIntersecting);
      }, options);
      observer.observe(galleryRef.current);
    }
  }, [imgsLoaded]);

  const wheelHandler = (e) => {
    e.preventDefault();
    e.currentTarget.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    const ref = divRef.current;
    ref.addEventListener("wheel", wheelHandler);

    return () => {
      ref.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    <main
      ref={divRef}
      className={`${
        lightMode === "dark" && "bg-gradient-radial from-[#646464] to-[#484848]"
      } flex overflow-x-scroll w-full h-[100vh] overflow-y-hidden font-['average'] hideScrollBar`}
      style={{ color: galleryVisible ? textColor : thumbnailTextColor }}
      onScroll={(e) => {
        const x = e.currentTarget.scrollLeft;
        setScrollX(x);
      }}
    >
      {!imgsLoaded && (
        <GalleryLoading
          images={images}
          lightMode={lightMode}
          setImgsLoaded={setImgsLoaded}
        />
      )}
      {imgsLoaded && (
        <>
          {previewData && !zoomed && (
            <h1 className="absolute z-10 left-12 top-12 text-2xl">
              This is a preview of your event
            </h1>
          )}
          <GalleryThumbnail
            title={title}
            subtitle={subtitle}
            thumbnailBgColor={thumbnailBgColor}
            thumbnailTextColor={thumbnailTextColor}
            email={email}
          />
          <UserGallery
            images={images || ""}
            galleryRef={galleryRef}
            setZoomed={setZoomed}
            zoomed={zoomed}
            lightMode={lightMode}
            scrX={scrollX}
          />
          {previewData && !zoomed && (
            <button
              type="button"
              className="absolute right-[3rem] top-[3rem] w-[6rem] h-[6rem] text-[2.2rem] flex flex-col items-center gap-[0.7rem] font-[200] z-[90]"
              onClick={() => {
                setClose((prev) => !prev);
                dispatch(navActions.toggleNav(true));
              }}
            >
              <p className="text-[0.8rem]">Click to leave</p>
              <BsFillDoorOpenFill />
            </button>
          )}
          {!previewData && !zoomed && (
            <NavLink
              to="/events"
              className="
                    absolute right-[3rem] top-[3rem] w-[5rem] h-[5rem] text-[2.2rem] flex flex-col items-center gap-[0.7rem] font-[200] z-[90]
                    "
              onClick={() => dispatch(navActions.toggleNav(true))}
            >
              <p className="text-[0.8rem]">Click to leave</p>
              <BsFillDoorOpenFill />
            </NavLink>
          )}

          {!zoomed && (
            <div
              style={{
                borderColor: galleryVisible ? textColor : thumbnailTextColor,
              }}
              className="fixed bottom-[3rem] right-[3rem] w-[5rem] h-[5rem] flex items-center justify-center border rounded-full z-[90]"
            >
              <ArcText text="Scroll to  Walk" arc={95} radius={70} />
              <div
                className="absolute text-[3rem]"
                style={{ transform: `rotate(${scrollX / 15}deg)` }}
              >
                <IoFootstepsSharp />
              </div>
            </div>
          )}
          {zoomed && (
            <button
              type="button"
              className="fixed bottom-[3rem] right-[3rem] w-[6rem] h-[6rem] flex flex-col items-center justify-center z-[90]"
              onClick={() => {
                setZoomed(false);
              }}
            >
              <p className="text-[0.8rem] font-[100]">Back</p>
              <div className="text-[4rem] hover:opacity-50 duration-[300ms]">
                <MdOutlineClose />
              </div>
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default Gallery;
