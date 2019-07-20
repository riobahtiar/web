import Layout from '../components/Layout.js';
import fetch from 'isomorphic-unfetch';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const Slug = props => (
  <Layout>
    <h1>{ ReactHtmlParser(props.posts.title.rendered) }</h1>
    <div>{ ReactHtmlParser(props.posts.content.rendered) }</div>
  </Layout>
);



Slug.getInitialProps = async function(context) {
  const { slug } = context.query;
  const res = await fetch(`http://blog.test/wp-json/wp/v2/posts?slug=${slug}`);
  const ps = await res.json();
  const posts = ps[0];
  console.log(posts.slug)


  return { posts };
};

export default Slug;