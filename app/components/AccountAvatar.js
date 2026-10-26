"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountAvatar({ picture, fallback, className }) {
  // # A missing or failed Google photo keeps the account's existing identity mark.
  // # Track the failed URL so a refreshed provider photo can load independently.
  const [failedPicture, setFailedPicture] = useState(null);
  return (
    <span className={className}>
      {picture && picture !== failedPicture ? (
        <Image src={picture} alt="" width={88} height={88} unoptimized
          referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover"
          onError={() => setFailedPicture(picture)} />
      ) : fallback}
    </span>
  );
}
