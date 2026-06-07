"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Get marketplace listings
   * @param {number} limit - Number of listings to fetch
   * @param {function} callback - Callback function
   */
  return function getMarketplace(limit, callback) {
    var resolveFunc = function () {};
    var rejectFunc = function () {};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      if (utils.getType(limit) == "Function") {
        callback = limit;
        limit = 20;
      } else {
        callback = function (err, data) {
          if (err) {
            return rejectFunc(err);
          }
          resolveFunc(data);
        };
      }
    }

    if (utils.getType(limit) != "Number") {
      limit = 20;
    }

    var form = {
      av: ctx.userID,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "MarketplaceQuery",
      doc_id: "25393437286970779",
      variables: JSON.stringify({
        first: limit,
      }),
    };

    defaultFuncs
      .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.errors) {
          throw resData;
        }

        var listings = [];
        if (
          resData.data &&
          resData.data.marketplace &&
          resData.data.marketplace.listings
        ) {
          listings = resData.data.marketplace.listings.map(function (item) {
            return {
              id: item.id,
              title: item.title,
              price: item.price,
              location: item.location,
              url: item.url,
              imageUrl: item.image ? item.image.uri : null,
            };
          });
        }

        log.info("getMarketplace", "Fetched " + listings.length + " listings");
        return callback(null, listings);
      })
      .catch(function (err) {
        log.error("getMarketplace", err);
        return callback(err);
      });

    return returnPromise;
  };
};
