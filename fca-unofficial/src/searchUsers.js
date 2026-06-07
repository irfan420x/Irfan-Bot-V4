"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Search for users by name
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @param {function} callback - Callback function
   */
  return function searchUsers(query, limit, callback) {
    var resolveFunc = function () {};
    var rejectFunc = function () {};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      if (utils.getType(limit) == "Function") {
        callback = limit;
        limit = 10;
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
      limit = 10;
    }

    if (utils.getType(query) != "String") {
      return callback({ error: "Query must be a string" });
    }

    var form = {
      av: ctx.userID,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "SearchTypeaheadQuery",
      doc_id: "24585299697835063",
      variables: JSON.stringify({
        query: query,
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

        var users = [];
        if (
          resData.data &&
          resData.data.users &&
          resData.data.users.edges
        ) {
          users = resData.data.users.edges.map(function (edge) {
            return {
              id: edge.node.id,
              name: edge.node.name,
              profileUrl: edge.node.profile_url,
              thumbSrc: edge.node.thumb_src,
              isFriend: edge.node.is_friend,
            };
          });
        }

        log.info("searchUsers", "Found " + users.length + " users");
        return callback(null, users);
      })
      .catch(function (err) {
        log.error("searchUsers", err);
        return callback(err);
      });

    return returnPromise;
  };
};
