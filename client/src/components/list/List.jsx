import './list.scss';
import Card from "../card/Card";

function List({ posts = [] }) {
  console.log(posts);
  return (
    <div className="list">
      {posts.length ? posts.map(post => <Card key={post?.id} post={post} />) : <p>No posts available</p>}
    </div>
  );
}
export default List;