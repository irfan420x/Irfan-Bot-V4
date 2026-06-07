"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Get user notifications
   * @param {number} limit - Number of notifications to fetch
   * @param {function} callback - Callback function
   */
  return function getNotifications(limit, callback) {
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
      fb_api_req_friendly_name: "NotificationsQuery",
      doc_id: "24804310205905615",
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

        var notifications = [];
        if (
          resData.data &&
          resData.data.viewer &&
          resData.data.viewer.notifications &&
          resData.data.viewer.notifications.edges
        ) {
          notifications = resData.data.viewer.notifications.edges.map(
            function (edge) {
              return {
                id: edge.node.id,
                text: edge.node.body ? edge.node.body.text : "",
                timestamp: edge.node.timestamp,
                isRead: edge.node.is_read,
                icon: edge.node.icon ? edge.node.icon.uri : null,
              };
            }
          );
        }

        log.info("getNotifications", "Fetched " + notifications.length + " notifications");
        return callback(null, notifications);
      })
      .catch(function (err) {
        log.error("getNotifications", err);
        return callback(err);
      });

    return returnPromise;
  };
};
