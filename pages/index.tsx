import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Lottie from 'lottie-react'
import nyanCat from '../public/nyan-cat.json'
import { getLatestPosts } from '../lib/wp.api'
import { GetStaticProps } from 'next'

const Home: NextPage = (latestPosts) => {
    return (
        <>
            <div style={{maxWidth: '300px', marginBottom: '-60px', left: 0}}>
                <div>
                    <Lottie animationData={nyanCat}/>
                </div>
            </div>
            <div className="container mx-auto">
                <Head>
                    <title>Rio Bahtiar - Bio & Profile</title>
                    <meta name="description" content="Web Developer based in Yogyakarta, Indonesia. Specialized in React.js, NextJS, WordPress Development & all things web"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <main className="pt-10">


                    <h1 className="font-heading uppercase text-6xl font-bold mb-5">
                        Rio Bahtiar
                    </h1>

                    <p className="font-normal text-3 max-w-md mb-8">
                        Just another Web Developer based in Yogyakarta, Indonesia.<br/>
                        I currently work as a Freelance Web Developer, previously venturing at Tokopedia and
                        SoftwareSeni.
                    </p>
    
                    <pre>{JSON.stringify(latestPosts, null, 2)}</pre>


                    <div className="grid grid-cols-2 gap-4">
                        <Link href="https://tokopedia.com" passHref>
                            <div className="card mb-3">
                            <h2 className="uppercase font-heading text-2xl font-bold mb-1">About Me &rarr;</h2>
                            <p>Profile & Resume</p>
                            </div>
                        </Link>

                        <Link href="/" passHref>
                            <div className="card mb-3">
                            <h2 className="uppercase font-heading text-2xl font-bold mb-1">Portfolios &rarr;</h2>
                            <p>Discover my Portfolios Gallery (coming soon)</p>
                            </div>
                        </Link>

                        <Link href="/" passHref>
                            <div className="card mb-3">
                            <h2 className="uppercase font-heading text-2xl font-bold mb-1">Examples &rarr;</h2>
                            <p>Discover and deploy boilerplate example Next.js projects.</p>
                            </div>
                        </Link>

                        <Link href="/" passHref>
                            <div className="card mb-3">
                            <h2 className="uppercase font-heading text-2xl font-bold mb-1">Deploy &rarr;</h2>
                            <p>
                                Instantly deploy your Next.js site to a public URL with Vercel.
                            </p>
                            </div>
                        </Link>
                    </div>
                </main>

                <footer className="footer mt-10 text-sm">
                    Developed with ♥️ in 🇮🇩<br/>
                    Created using Next.js & TailwindCSS
                </footer>
            </div>
        </>
)
}



export const getStaticProps: GetStaticProps = async (context) => {
    const latestPosts = await getLatestPosts()
    return {
        props: { latestPosts },
    }
}

export default Home
