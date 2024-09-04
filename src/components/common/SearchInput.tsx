import React from 'react';
import {Search} from "lucide-react";

export default function SearchInput() {
    return (
        <div className='relative'>
            <input
                className='w-full lg:w-[500px] h-10 pl-10 outline-none focus:outline-none bg-muted rounded-3xl'
                type='text'
                placeholder='Search here...'
            />
            <Search className='absolute left-3 top-2.5 w-5 h-5' />
        </div>
    );
}
