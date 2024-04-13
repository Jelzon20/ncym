import React from 'react'
import {Spinner} from 'flowbite-react';

export default function Loading() {
    return (

        <>
            <Spinner size='md' />
            <span className='pl-3'>Loading...</span>
        </>

      );
}
