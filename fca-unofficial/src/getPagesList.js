"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Get list of pages user manages
   * @param {number} limit - Number of pages to fetch
   * @param {function} callback - Callback function
   */
  return function getPagesList(limit, callback) {
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
      fb_api_req_friendly_name: "PagesListQuery",
      doc_id: "25909428212080747",
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

        var pages = [];
        if (
          resData.data &&
          resData.data.viewer &&
          resData.data.viewer.managed_pages &&
          resData.data.viewer.managed_pages.edges
        ) {
          pages = resData.data.viewer.managed_pages.edges.map(function (edge) {
            return {
              id: edge.node.id,
              name: edge.node.name,
              url: edge.node.url,
              fanCount: edge.node.fan_count,
            };
          });
        }

        log.info("getPagesList", "Fetched " + pages.length + " pages");
        return callback(null, pages);
      })
      .catch(function (err) {
        log.error("getPagesList", err);
        return callback(err);
      });

    return returnPromise;
  };
};
