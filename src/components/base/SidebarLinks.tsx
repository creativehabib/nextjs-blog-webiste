"use client"
import Link from "next/link";
import React from "react";
import { Search, Flame, ArrowBigUp, Link as LinkIcon } from "lucide-react";
import {useSession} from "next-auth/react";
import {CustomUser} from "@/app/api/auth/[...nextauth]/authOptions";
import UserAvatar from "@/components/common/UserAvatar";
import AddPost from "@/components/post/AddPost";

export default function SidebarLinks() {
    const {data} = useSession()
    const user = data?.user as CustomUser
    return (
        <div>
            <Link href="/" className="flex space-x-4 items-center py-4">
                <UserAvatar image={user?.profile_image ?? undefined}/>
                <p> My feed</p>
            </Link>

            <p className="my-2 font-bold text-muted-foreground">Discover</p>
            <ul>
                <li>
                    <Link href="/" className="flex space-x-3 items-center mb-4">
                        <Flame className="w-5 h-5" />
                        <p>Popular</p>
                    </Link>
                </li>

                <li>
                    <Link href="/search" className="mb-4 flex space-x-3 items-center">
                        <Search className="w-5 h-5" />
                        <p>Search</p>
                    </Link>
                </li>
                <li>
                    <Link href="/upvoted" className="mb-4 flex space-x-3 items-center">
                        <ArrowBigUp className="w-5 h-5" />
                        <p>Most Voted</p>
                    </Link>
                </li>
            </ul>

            <p className="my-2 font-bold text-muted-foreground">Contribute</p>
            <ul>
                <li>
                    <AddPost/>
                </li>
            </ul>
        </div>
    );
}