import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
export default function UserAvatar({ image }: { image?: string }) {
    return (
        <div className='cursor-pointer'>
            {image ? (
                <Image src={getImageUrl(image)} width={30} height={30} alt="user" className="rounded-full cursor-pointer" />
            ) : (
                <Image src="/avatar.png" width={40} height={40} alt="logo" className="rounded-full cursor-pointer"/>
            )}
        </div>
    );
}