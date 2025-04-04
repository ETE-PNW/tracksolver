# Tracksolver

Solves tracks to a given length, with a configurable tolerance - Works with Fleischmann, Märklin-C, K, Z, and M track, and Märklin Gauge 1.

Track definitions are kept in `trackTypes.js`. Lengths are all expressed in mm:

```js
...
 "Märklin-1": [
        { model: "59051", length: 59.1 },
        { model: "59052", length: 79   },
        { model: "59053", length: 100  },
        { model: "59054", length: 116  },
        { model: "59055", length: 150  },
        { model: "59056", length: 152.2},
        { model: "59057", length: 200  },
        { model: "59058", length: 300  },
        { model: "59059", length: 600  },
        { model: "59061", length: 900  }
    ],
...
```

Live application is available [here](https://www.tracksolver.com/tracksolver).

Originally developed by @eugeniop and @magnuschr

## Running locally

1. Clone repo
2. Run `npm i`
3. Run `nodemon` or `node index`
4. Open a browser on http://localhost:3000
