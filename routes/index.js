const express = require("express");
const elasticsearch = require("elasticsearch");

const router = express.Router();

/**
 * Helper to check if an object's property does not exist or is empty.
 *
 * @param {Object} object
 *   The object whose property will be checked.
 * @param {string} property
 *   The property within the object to check.
 * @returns {boolean}
 *   TRUE if the property does not exist or is empty.
 */
const isEmpty = function isEmpty(object, property) {
  return (
    object[property] === undefined ||
    object[property].length === 0 ||
    object[property] === "undefined"
  );
};

/**
 * Performs a query against Elasticsearch and renders the response.
 *
 * @param {Object} req
 *   The request object.
 * @param {Object} res
 *   The response object.
 */
const doSearch = function doSearch(req, res) {
  // Initialize the Elasticsearch client.
  const client = new elasticsearch.Client({
    host: "http://elastic:changeme@elasticsearch:9200",
    log: "trace",
  });

  let searchString = "";
  let searchType = "";
  let searchTypes = "";
  let searchAmount = "";
  let isSearchPressed = req.query.isSearchPressed === 'true';

  // Prepare the request body.
  const body = {
    size: 100,
  };

  if (
    !isEmpty(req.query, "search") ||
    !isEmpty(req.query, "type") ||
    !isEmpty(req.query, "types") ||
    !isEmpty(req.query, "amount")
  ) {
    const query = {
      bool: {},
    };

    if (!isEmpty(req.query, "search")) {
      query.bool.must = {
        multi_match: {
          fields: ["title", "summary"],
          query: req.query.search,
          fuzziness: "auto",
        },
      };
      searchString = req.query.search;
    }

    const filters = [];

    if (!isEmpty(req.query, "type")) {
      filters.push({
        term: {
          type: req.query.type,
        },
      });
      searchType = req.query.type;
    }

    if (!isEmpty(req.query, "types")) {
      filters.push({
        term: {
          types: req.query.types,
        },
      });
      searchTypes = req.query.types;
    }

    if (!isEmpty(req.query, "amount")) {
      const [from, to] = req.query.amount.split('-').map(Number);
      filters.push({
        range: {
          amount: {
            gte: from,
            lte: to,
          },
        },
      });
      searchAmount = req.query.amount;
    }

    if (filters.length > 0) {
      query.bool.filter = filters;
    }

    body.query = query;
  }

  // Add a type facet.
  body.aggs = {
    type: {
      terms: {
        field: "type",
      },
    },
    types: {
      terms: {
        field: "types",
      },
    },
    amount_ranges: {
      range: {
        field: "amount",
        ranges: [
          { key: "Hasta 1Mill.", from: 1, to: 1000000 },
          { key: "1Mill.-5Mill.", from: 1000001, to: 5000000 },
          { key: "De 5Mill. +", from: 5000001, to: 100000000},
        ],
      },
    },
  };

  // Perform the search request.
  client
    .search({
      index: "fondos",
      body,
    })
    .then((resp) => {
      // Sort the hits by fecha_end in descending order
      resp.hits.hits.sort((a, b) => new Date(b._source.fecha_end) - new Date(a._source.fecha_end));
      
      // Get the latest 10 hits
      const latestHits = resp.hits.hits.slice(0, 10);


      // Render results in a template.
      res.render("index", {
        hitsFechas: latestHits,
        hits: resp.hits.hits,
        total: resp.hits.total,
        aggregations: resp.aggregations.type.buckets,
        aggregations2: resp.aggregations.types.buckets,
        aggregations3: resp.aggregations.amount_ranges.buckets,
        searchString,
        searchType,
        searchTypes,
        searchAmount,
        isSearchPressed
      });
    })
    .catch((err) => {
      console.error("Error al buscar documentos:", err);
      res.status(500).send("Error interno del servidor");
    });
};

/**
 * The initial request that loads the form and all the documents in Elasticsearch.
 *
 * @param {Object} req
 *   The request object.
 * @param {Object} res
 *   The response object.
 */
router.get("/", (req, res) => {
  doSearch(req, res);
});

/**
 * Processes form submissions by modifying the query for Elasticsearch.
 *
 * @param {Object} req
 *   The request object.
 * @param {Object} res
 *   The response object.
 */
router.post("/", (req, res) => {
  doSearch(req, res);
});

module.exports = router;
