/*jslint browser: true, nomen: true, todo: true */
(function ($, queueup) {
    'use strict';

    var getMasterQueue,
        masterQueue = null;  // a default master load queue.

    getMasterQueue = function () {
        if (!masterQueue) {
            masterQueue = queueup({autostart: true});
        }
        return masterQueue;
    };

    $.picplus.config().plugins.push({
        initialize: function (picplus) {
            picplus.loadSource = function (src, opts) {
                var promise,
                    ppOpts = picplus.options,
                    loadqueue = (ppOpts && ppOpts.queueup && ppOpts.queueup.queue) || getMasterQueue();
                promise = loadqueue.load(src, opts);
                return promise;
            };
            picplus._loadSource = function ($source) {
                var promise = $source.data('promise');
                // If this source is already pending, promote it.
                if (promise && promise.state() === 'pending') {
                    return promise.promote();
                }
                return $.picplus.PicPlus.prototype._loadSource.call(this, $source);
            };
        }
    });

}(this.jQuery, this.queueup));
