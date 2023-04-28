import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://bsky.social' })

export const config = {
  runtime: 'edge',
}
let loggedIn = false;
export default async function handler(req) {
  if (!loggedIn) {
    await agent.login({ identifier: process.env.USERNAME, password: process.env.PASSWORD });
    loggedIn = true;
  }


  const response = await agent.getTimeline();
  const skeets = response.data.feed.splice(0, 10);
  return new Response(
    JSON.stringify({
      skeets,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=20, stale-while-revalidate=10',
      },
    }
  )
}