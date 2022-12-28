[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="public/android-chrome-192x192.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">analyzemyrepo.com</h3>

  <p align="center">
    Discover usefull insights about your open-source repo
    <br />
    <a href="https://analyzemyrepo.com/analyze/CrowdDotDev/crowd.dev">View Demo</a>
    ·
    <a href="https://github.com/CrowdDotDev/analyzemyrepo/issues">Report Bug</a>
    ·
    <a href="https://github.com/CrowdDotDev/analyzemyrepo/issues">Request Feature</a>
  </p>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://analyzemyrepo.com)

analyzemyrepo.com enables you to look over any Github repository and get comprehensive details about its performance, contributors, community governance, geographic diversity, and organizational diversity.

Its primary goal is to point out repository improvement opportunities and give contributors advice on how to resolve these problems. 


Besides that, analyzemyrepo.com helps you to discover cool projects thanks to weekly updated ratings and collections.


### Built With
The project is built with lots of cool tecnologies. All of them are open-source.

* [create-t3-app](https://create.t3.gg/) - very cool stack for Next.js
* [Meilisearch](https://github.com/meilisearch/meilisearch) - search backend
* [Prefect](https://github.com/PrefectHQ/prefect) - data orchestration
* [PostgreSQL](https://github.com/postgres/postgres)

<!-- GETTING STARTED -->
## Getting Started
analyzemyrepo.com uses hybrid approach to get data from GitHub. Some of the data is fetched from GitHub in realtime, some of it is fetched from Postgres where data was uploaded ahead of time using Prefect.

Still, it is possible to run analyzemyrepo.com locally and get insights about **any** repository. Though, not all sections will be avaliable.

### Prerequisites

You will need three main things to get started:
- npm
- GitHub API key
- Meilisearch instance with uploaded repositories names (optional)

analyzemyrepo.com can also work without Meilisearch - one would need to submit repo's name fully and correctly.

### Installation

1. Get a GitHub API key
2. Clone the repo
   ```sh
   git clone https://github.com/CrowdDotDev/analyzemyrepo.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Set your GitHub API key in `.env`
   ```js
   GITHUB_ACCESS_TOKEN_2="YOUR API KEY"
   ```
5. Set your GitHub API key in `.env` (optional)
   ```js
   NEXT_PUBLIC_MEILI_URL="YOUR MEILI INSTANCE URL"
   NEXT_PUBLIC_MEILI_SEARCH_KEY="YOUR MEILI PUBLIC KEY"
   ```

<!-- CONTRIBUTING -->
## Contributing

Any contributions are **greatly appreciated**.

If you have a suggestion that would make analyzemyrepo.com better, please fork the repo and create a pull request. You can also simply open an issue with the tag "feature request".
Don't forget to give the project a star!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Igor Kotua - [@garrrikkotua](https://twitter.com/garrrikkotua) - igor@crowd.dev

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[contributors-url]: https://github.com/CrowdDotDev/analyzemyrepo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[forks-url]: https://github.com/CrowdDotDev/analyzemyrepo/network/members
[stars-shield]: https://img.shields.io/github/stars/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[stars-url]: https://github.com/CrowdDotDev/analyzemyrepo/stargazers
[issues-shield]: https://img.shields.io/github/issues/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[issues-url]: https://github.com/CrowdDotDev/analyzemyrepo/issues
[license-shield]: https://img.shields.io/github/license/CrowdDotDev/analyzemyrepo.svg?style=for-the-badge
[license-url]: https://github.com/CrowdDotDev/analyzemyrepo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/crowddotdev/
[product-screenshot]: media/analyzemyrepo_crowd.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/