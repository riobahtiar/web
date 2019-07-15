import Layout from '../components/Layout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Index = props => (
    <Layout>
        <h1>Sholawat</h1>
        <ul>
            {props.posts.map(posts => (
                <li key={posts.ID}>
                    <Link href="/p/[id]" as={`/p/${posts.ID}`}>
                        <a>{posts.title}</a>
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
    const res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/riobahtiar.wordpress.com/posts');
    const data = await res.json();

    console.log(`Post data fetched. Count: ${data.posts.length}`);

    return {
        posts: data.posts
    };
}

export default Index;