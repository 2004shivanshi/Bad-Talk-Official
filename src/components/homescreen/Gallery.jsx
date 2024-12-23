import React, { useState, useEffect } from "react";
import {
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa"; 

const images = [
  { id: 1, src: "/1.jpg" },
  { id: 2, src: "/2.jpg" },
  { id: 3, src: "/3.jpg" },
  { id: 4, src: "/4.JPG" },
  { id: 5, src: "/10.jpg" },
  { id: 6, src: "/6.JPG" },
  { id: 7, src: "/7.JPG" },
  { id: 8, src: "/8.JPG" },
  { id: 9, src: "/9.jpg" },
  // { id: 10, src: "/5.jpg" },
  // { id: 11, src: "/11.jpg" },
  // { id: 12, src: "/12.jpg" },
  // { id: 13, src: "/13.jpg" },
  // { id: 14, src: "/14.jpg" },
  // { id: 15, src: "/15.jpg" },
  // { id: 16, src: "/16.jpg" },
  // { id: 17, src: "/17.jpg" },
  // { id: 18, src: "/18.jpg" },
];

const Gallery = () => {
  const [visibleRows, setVisibleRows] = useState(2);
  const [showMore, setShowMore] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rows = [];
  let row = [];
  let isOddRow = true;

  const getImagesPerRow = () =>
    isDesktop ? (isOddRow ? 5 : 4) : isOddRow ? 3 : 2;

  images.forEach((image) => {
    row.push(image);

    const imagesPerRow = getImagesPerRow();

    if (row.length === imagesPerRow) {
      rows.push(row);
      row = [];
      isOddRow = !isOddRow;
    }
  });

  const loadMore = () => {
    setVisibleRows((prevRows) => prevRows + 2);
  };

  const showLess = () => {
    setVisibleRows(2);
  };

  const hasMoreRows = visibleRows < rows.length;

  const openFullScreen = (image, event) => {
    const imageElement = event.target;
    const rect = imageElement.getBoundingClientRect();
    setImagePosition({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    setCurrentImage(image);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setCurrentImage(null);
  };

  const goToNextImage = () => {
    const currentIndex = images.findIndex((img) => img.id === currentImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentImage(images[nextIndex]);
  };

  const goToPreviousImage = () => {
    const currentIndex = images.findIndex((img) => img.id === currentImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentImage(images[prevIndex]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-white text-4xl text-center mb-20">GALLERY</h1>
      <div className="flex flex-col items-center">
        {rows.slice(0, visibleRows).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-[6px] mb-[6px] flex-wrap"
            style={{
              marginTop: isDesktop
                ? rowIndex % 2 === 0
                  ? "-45px"
                  : "-45px"
                : "-20px",
            }}
          >
            {row.map((image) => (
              <div
                key={image.id}
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 transition-all duration-500 ease-out transform hover:scale-105 hover:opacity-90 hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 bg-red-500 rounded-lg overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  <img
                    src={image.src}
                    alt={`Gallery item ${image.id}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div
                  className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  <button
                    onClick={(e) => openFullScreen(image, e)}
                    className="text-white bg-black bg-opacity-50 rounded-full p-2 shadow-md hover:bg-opacity-75 transition-all duration-200"
                  >
                    <FaExpand size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="mt-6 flex gap-4 justify-center">
          {hasMoreRows && !showMore && (
            <button
              onClick={loadMore}
              className="text-white bg-red-600 py-2 px-4 rounded-lg hover:bg-red-800 transition duration-300 ease-out"
            >
              Load More
            </button>
          )}

          {showMore ? (
            <button
              onClick={() => {
                loadMore();
                setShowMore(false);
              }}
              className="text-white bg-red-600 py-2 px-4 rounded-lg hover:bg-red-800 transition duration-300 ease-out"
            >
              Load More
            </button>
          ) : (
            <button
              onClick={() => {
                showLess();
                setShowMore(true);
              }}
              className="text-white bg-red-600 py-2 px-4 rounded-lg hover:bg-red-800 transition duration-300 ease-out"
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      {currentImage && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-700 ease-out ${
            isFullScreen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeFullScreen}
        >
          <div
            className="relative w-full h-full flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
            style={{
              left: isFullScreen ? 0 : imagePosition.left + "px",
              top: isFullScreen ? 0 : imagePosition.top + "px",
              width: isFullScreen ? "100%" : imagePosition.width + "px",
              height: isFullScreen ? "100%" : imagePosition.height + "px",
              transition: "all 0.7s ease-out",
            }}
          >
            <img
              src={currentImage.src}
              alt="Full screen"
              className="max-w-full max-h-full object-contain transition-all duration-700 ease-out transform"
              style={{
                transform: isFullScreen ? "scale(1)" : "scale(0)",
                opacity: isFullScreen ? 1 : 0,
              }}
            />

            <button
              onClick={goToPreviousImage}
              className="absolute left-10 top-1/2 transform -translate-y-1/2 p-4 bg-black text-white rounded-full hover:bg-gray-700 focus:outline-none transition duration-300 ease-in-out shadow-lg hover:scale-110"
              style={{
                fontSize: "3rem",
              }}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 p-4 bg-black text-white rounded-full hover:bg-gray-700 focus:outline-none transition duration-300 ease-in-out shadow-lg hover:scale-110"
              style={{
                fontSize: "3rem",
              }}
            >
              <FaChevronRight />
            </button>

            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 hover:scale-110 transition-all duration-200 ease-in-out shadow-lg"
              style={{
                fontSize: "2rem",
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
