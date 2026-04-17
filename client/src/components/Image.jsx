import { IKImage } from "imagekitio-react";

const Image = ({
  src,
  className,
  w,
  h,
  alt,
  priority = false,
  sizes,
  quality = 75,
}) => {
  const isAbsoluteUrl = typeof src === "string" && /^https?:\/\//i.test(src);
  const loadingMode = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  if (isAbsoluteUrl) {
    return (
      <img
        src={src}
        className={className}
        loading={loadingMode}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={sizes}
        alt={alt}
        width={w}
        height={h}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={src}
      className={className}
      loading={loadingMode}
      fetchPriority={fetchPriority}
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
          quality,
          format: "webp",
        },
      ]}
    />
  );
};

export default Image;
