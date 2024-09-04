import React from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {BellIcon} from "lucide-react";
import SearchInput from "@/components/common/SearchInput";
import ProfileMenu from "@/components/base/ProfileMenu";
import MobileSidebar from "@/components/base/MobileSidebar";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";

export default function Navbar({ user }: { user: CustomUser }) {
    return(
      <nav className="flex justify-between items-center p-2 border-b">
          <MobileSidebar/>
          <Image src={'/logo.svg'} alt={'logo'} width={120} height={120} />
          <SearchInput/>
          <div className='flex space-x-3 items-center'>
              <Button size="icon" variant='secondary'>
                  <BellIcon className="w-5 h-5" />
              </Button>
              <ProfileMenu user={user} />
          </div>
      </nav>
    );
}