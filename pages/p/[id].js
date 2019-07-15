import Layout from '../../components/Layout.js';
import fetch from 'isomorphic-unfetch';


const Post = props => (
  <Layout>
    <h1>{props.posts.title}</h1>
    <p>{props.posts.content.replace(/<[/]?p>/g, '')}</p>
    <img src={props.posts.featured_image} />
  </Layout>
);

Post.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/riobahtiar.wordpress.com/posts/${id}`);
  const posts = await res.json();

  console.log(`Fetched posts: ${posts.title}`);

  return { posts };
};

export default Post;