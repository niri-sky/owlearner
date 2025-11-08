"use client";
import React from "react";
import PostPhoto from "./elements/timeline/post-photo";
import { useQuery } from "@apollo/client";
import { SINGLE_POSTS_QUERY } from "@/graphql/queries";
import { useParams } from "next/navigation";

function PostDetails() {
  const params = useParams();

  const { data } = useQuery(SINGLE_POSTS_QUERY, {
    variables: {
      id: Number(params.slug),
    },
    skip: !params?.slug,
  });

  const postData = data?.post;

  return (
    <div>
      <PostPhoto data={postData} />
    </div>
  );
}

export default PostDetails;
