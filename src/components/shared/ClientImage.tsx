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
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    console.error(`Failed to load image at ${src}`);
    setImgSrc("/assets/images/default-placeholder.png");
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
    />
  );
}
