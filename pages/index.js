import Layout from "../components/Layout";
import Link from 'next/link'

const PostLink = props => (
    <li>
        <Link href={`/post?title=${props.title}`}>
            <a>{props.title}</a>
        </Link>
    </li>
);

export default function Blog() {
    return(
        <Layout>
            <h1>Blog Rio</h1>
            <ul>
                <PostLink title="Hello Next.Jr "/>
                <PostLink title="Hello Next Jr 1"/>
                <PostLink title="Hello Next Jr 2"/>
            </ul>
        </Layout>
    );
}
