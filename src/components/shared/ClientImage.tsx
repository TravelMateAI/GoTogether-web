"use client";

import Image from "next/image";
import { useState } from "react";

interface ClientImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: "cover" | "contain" | "fill";
  sizes?: string;
}

export default function ClientImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  objectFit = "cover",
  sizes,
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${imgSrc}`);
      setImgSrc("/assets/images/default-placeholder.png");
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      onError={handleError}
      className={className}
      style={{ objectFit }}
      sizes={sizes}
    />
  );
}
