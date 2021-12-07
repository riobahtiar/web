const WP_API_URL: string = process.env.WORDPRESS_API_URL ?? ''

async function fetchAPI(query: any, variables?: any) {
    const headers: any = { 'Content-Type': 'application/json' }

    // if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    //     headers[
    //         'Authorization'
    //     ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
    // }

  const res = await fetch(WP_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
    })

    const json = await res.json()
    if (json.errors) {
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }
    return json.data
}

export async function getLatestPosts() {
    const data = await fetchAPI(`
    {
      posts(first: 5, where: {status: PUBLISH, orderby: {field: DATE, order: DESC}}) {
        edges {
          node {
            postId
            slug
            title(format: RENDERED)
            excerpt(format: RENDERED)
            date
            modified
            featuredImage {
              node {
                description(format: RENDERED)
                mediaDetails {
                  file
                  width
                  height
                }
              }
            }
          }
        }
      }
    }

  `)
    return data?.posts
}

