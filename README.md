# World News — Front-page v3

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Ardian9712/news-image-20261118-frontpage-v3/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Ardian9712/news-image-20261118-frontpage-v3/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

An entry for [make.fun news-image-20261118](https://make.fun/bounty/news-image-20261118).
The program copies an approved front-page newspaper image summing up
18 November 2026 world news: 34 stories across six continents, led by the
Kerch Bridge collapse, US–Iran fire, and Trump in Manila before flying to Shenzhen.

## Run

Use Node.js 22+ with native TypeScript stripping enabled (enabled by default
in Node.js 22.18+). No dependencies or build step are needed.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

For the default destination, `/output/entry.png`:

```sh
node main.ts
```

The output directory is created as needed. The source is resolved relative to
`main.ts`, so the program also works from another working directory. Each run
produces deterministic output, byte-identical to the source image. It uses only
local file operations and prints the output path and byte count.

`entry.png` contains the approved JPEG bytes despite its required filename:
1024×1024 pixels, 304,104 bytes.

Licensed under the [MIT License](LICENSE).

---

[Discover make.fun](https://make.fun/r/p8atzycs)
