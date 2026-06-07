"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Get list of groups user belongs to
   * @param {number} limit - Number of groups to fetch
   * @param {function} callback - Callback function
   */
  return function getGroupsList(limit, callback) {
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
      fb_api_req_friendly_name: "GroupsListQuery",
      doc_id: "7214102258676893",
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

        var groups = [];
        if (
          resData.data &&
          resData.data.viewer &&
          resData.data.viewer.groups &&
          resData.data.viewer.groups.edges
        ) {
          groups = resData.data.viewer.groups.edges.map(function (edge) {
            return {
              id: edge.node.id,
              name: edge.node.name,
              memberCount: edge.node.member_count,
              url: edge.node.url,
            };
          });
        }

        log.info("getGroupsList", "Fetched " + groups.length + " groups");
        return callback(null, groups);
      })
      .catch(function (err) {
        log.error("getGroupsList", err);
        return callback(err);
      });

    return returnPromise;
  };
};
