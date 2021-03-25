import React from 'react'
import { useState } from 'react';
import { Input } from 'semantic-ui-react';

export default function SearchBox(props) {
    const [name, setName] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        props.history.push(`/search/name/${name}`);
    };
    return (
        <form className="search" onSubmit={submitHandler}>
            <Input className='inputSearch' 
            action={{ icon: 'search', color:'yellow' }} 
            size='big' 
            placeholder='Search...'
            onChange={(e)=>setName(e.target.value)} />
        </form> 
    )
}
