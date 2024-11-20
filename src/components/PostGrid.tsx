"use client";
import Masonry from "react-masonry-css";

const images = [
  "https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_960_720.jpg",
  "https://cdn.pixabay.com/photo/2016/01/20/13/28/woman-1151562_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/12/04/23/39/bread-1882841_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/12/23/18/30/snail-1927722_640.jpg",
  "https://cdn.pixabay.com/photo/2016/12/23/18/30/snail-1927722_640.jpg",
  "https://cdn.pixabay.com/photo/2016/12/04/23/39/bread-1882841_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/01/20/13/28/woman-1151562_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_960_720.jpg",
  "https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_960_720.jpg",
  "https://cdn.pixabay.com/photo/2016/01/20/13/28/woman-1151562_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/12/04/23/39/bread-1882841_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/12/23/18/30/snail-1927722_640.jpg",
  "https://cdn.pixabay.com/photo/2016/12/23/18/30/snail-1927722_640.jpg",
  "https://cdn.pixabay.com/photo/2016/12/04/23/39/bread-1882841_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/01/20/13/28/woman-1151562_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/07/12/09/11/woman-7316856_960_720.jpg",
];

export default function PostsGrid() {
  return (
    <div className="max-w-4xl mx-auto">
      <Masonry breakpointCols={{ default: 4, 1100: 3, 500: 2 }} className="flex -ml-4" columnClassName="pl-4">
        {images.map((src, index) => (
          <div className="mb-4" key={index}>
            <img src={src} alt="" />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
