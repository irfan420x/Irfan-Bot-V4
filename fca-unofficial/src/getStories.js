"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Get stories from friends
   * @param {number} limit - Number of stories to fetch
   * @param {function} callback - Callback function
   */
  return function getStories(limit, callback) {
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
      fb_api_req_friendly_name: "StoriesQuery",
      doc_id: "8768858626531631",
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

        var stories = [];
        if (
          resData.data &&
          resData.data.viewer &&
          resData.data.viewer.stories &&
          resData.data.viewer.stories.edges
        ) {
          stories = resData.data.viewer.stories.edges.map(function (edge) {
            return {
              id: edge.node.id,
              owner: edge.node.owner
                ? {
                    id: edge.node.owner.id,
                    name: edge.node.owner.name,
                  }
                : null,
              timestamp: edge.node.created_time,
              url: edge.node.url,
            };
          });
        }

        log.info("getStories", "Fetched " + stories.length + " stories");
        return callback(null, stories);
      })
      .catch(function (err) {
        log.error("getStories", err);
        return callback(err);
      });

    return returnPromise;
  };
};
