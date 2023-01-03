# Introduction
This is the code for my personal Website, and can serve as a template for a NextJS application or Blog.
I am building this site with IPFS and other Web3.0 services, and I want it to be an example of how to build a decentralized application.
I eventually want it to get to the point where I can write a blog post from my terminal, and have it automatically published to IPFS, and then indexed on my website.
The first cool thing I'm doing with Web3.0 for this prototype is pinning my blog posts on IPFS using a service called Estuary.
This is cool because it means my underlying content is accessible from any peer running IPFS connected to Estuary, and addressable on the growing decentralized web!

I hope to decentralize more of this as I keep on building. Right now this site is hosted on centralized server, posts are indexed statically, and the upload process is pretty cumbersome. I'm working on solutions to these problems by possibly:
- hosting the site on IPFS, using a service like Fleek
- hosting metadata feeds (think lists of blog posts) on a decentralized database like Ceramic
- writing an accompanying local client that:
    - Writes blog post metadata to a Ceramic database
    - Uploads the blog post to IPFS using an rclone integration between dropbox and Estuary


Feel free to fork this repository and use it for your own projects, as well as suggest updates or improvements.

# Running locally

## Prerequisites
- NodeJS
- Yarn

## Install dependencies and run
```bash
git clone git@github.com:amiller68/krondor-org.git
cd me-www
yarn dev
```
## Run the linting and formatting checks
```bash
yarn lint
```

## Run Storybook
```bash
yarn storybook
```

# Future plans

I hope to have more updates soon! Expect:
- Storybook for every component
- documentation for finding and using the components
- Test suite using selenium
- Accompanying content client for syncing blog posts to IPFS and Ceramic
- More content!
- and more!