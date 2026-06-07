"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Set user bio with enhanced options
   * @param {string} bio - Bio text
   * @param {object} options - Optional settings
   * @param {function} callback - Callback function
   */
  return function setBio(bio, options, callback) {
    var resolveFunc = function () {};
    var rejectFunc = function () {};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      if (
        utils.getType(options) == "Function" ||
        utils.getType(options) == "AsyncFunction"
      ) {
        callback = options;
        options = {};
      } else {
        callback = function (err) {
          if (err) {
            return rejectFunc(err);
          }
          resolveFunc();
        };
      }
    }

    options = options || {};

    if (utils.getType(bio) != "String") {
      return callback({ error: "Bio must be a string" });
    }

    var form = {
      av: ctx.userID,
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "ProfileCometSetBioMutation",
      doc_id: "2725043627607610",
      variables: JSON.stringify({
        input: {
          bio: bio,
          change_type: options.changeType || "ADD",
          should_update_bio_in_basic_info: true,
          source: "profile_comet",
        },
      }),
    };

    defaultFuncs
      .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.errors) {
          throw resData;
        }

        var bioData = null;
        if (
          resData.data &&
          resData.data.profile_intro_card_set &&
          resData.data.profile_intro_card_set.profile_intro_card
        ) {
          bioData = resData.data.profile_intro_card_set.profile_intro_card;
        }

        log.info("setBio", "Bio updated successfully");
        return callback(null, bioData);
      })
      .catch(function (err) {
        log.error("setBio", err);
        return callback(err);
      });

    return returnPromise;
  };
};
