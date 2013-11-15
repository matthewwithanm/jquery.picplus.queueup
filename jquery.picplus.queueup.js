/*jslint browser: true, nomen: true, todo: true */
(function ($, queueup) {
    'use strict';

    var getMasterQueue,
        PROMISE_DATA = 'picplus-queueup-promise',
        masterQueue = null;  // a default master load queue.

    getMasterQueue = function () {
        if (!masterQueue) {
            masterQueue = queueup({autostart: true});
        }
        return masterQueue;
    };

    $.picplus.addPlugin({
        create: function (picplus) {
            picplus.loadSource = function (opts, done, fail) {
                var ppOpts = picplus.options,
                    $source = opts.$el,
                    loadqueue = (ppOpts && ppOpts.queueup && ppOpts.queueup.queue) || getMasterQueue();
                $source.data(
                    PROMISE_DATA,
                    loadqueue.load(opts).then(done, fail)
                );
            };
            picplus._loadSource = function ($source, done, fail) {
                var promise;
                if (!this.isLoaded($source)) {
                    promise = $source.data(PROMISE_DATA);
                    if (promise) {
                        promise.promote();
                    }
                }
                $.picplus.PicPlus.prototype._loadSource.call(this, $source, done, fail);
            };
            return {};
        }
    });

}(this.jQuery, this.queueup));
