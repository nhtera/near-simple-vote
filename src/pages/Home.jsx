import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Post from "../components/Post";

export default function Home() {
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        window.contract.get_posts()
        .then(posts => {
            console.log(posts);
            setPosts(posts);
        })
    }, [posts]);

  return (
    <div className="container divide-y-2 divide-gray-100">
        {posts.map((post, index) =>(
            <Post key={post.post_id} id={post.post_id} title={post.title} body={post.body} up_votes={post.up_votes} down_votes={post.down_votes} author={post.author}></Post>
        ))}
    </div>
  )
}
