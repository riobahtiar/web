import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Index = props => (
    <Layout>
        <h1>List</h1>
        <ul>
            {props.posts.map(posts => (
                <li key={posts.slug}>
                    <Link href="/[slug]" as={`/${posts.slug}`}>
                        <a>{posts.title.rendered}</a>
                    </Link>
                </li>
            ))}
        </ul>
        <style jsx>{`
        h1,
        a {
          font-family: 'Arial';
        }

        ul {
          padding: 0;
        }

        li {
          list-style: none;
          margin: 5px 0;
        }

        a {
          text-decoration: none;
          color: blue;
        }

        a:hover {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
);

Index.getInitialProps = async function() {
    const res = await fetch('http://blog.test/wp-json/wp/v2/posts?per_page=33');
    const data = await res.json();

    console.log(`Post data fetched. Count: ${data.length}`);

    return {
        posts: data
    };
}

export default Index;