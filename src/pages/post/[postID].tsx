import { useRouter } from 'next/router';

const Post = () => {
  const router = useRouter();

  // クエリパラメータを取得
  const { postID } = router.query;

  return (
    <div>
      <h1>Post ID: {postID}</h1>
    </div>
  );
};

export default Post;