(function() {
    'use strict';

    var db = new PouchDB('pwa-etudiant');
    var remoteCouch = 'http://127.0.0.1:5984/pwa-etudiant';

    // Initialise a sync with the remote server
    function sync() {

        var syncHandler = db.sync(remoteCouch, {
        live: true,   // real-time replication
        retry: true,  // reconnect automatically

        // Exponential backoff with a max value
        back_off_function: function (delay) {
            console.log('backoff', delay);
            syncDom.setAttribute('data-sync-state', 'reconnecting');
            if (delay === 0) {
            return 100;
            }
            if (delay >= 3200) {
            return 3200;
            }
            return delay * 2;
        },
        });

        // This event fires when the replication is paused, either because
        // a live replication is waiting for changes, or replication has
        // temporarily failed, with `err`, and is attempting to resume.
        syncHandler.on('paused', function (err) {
        console.log('paused', err);
        syncDom.setAttribute('data-sync-state', 'paused');
        });

        // This event fires when the replication starts actively processing changes;
        // e.g. when it recovers from an error or new changes are available.
        syncHandler.on('active', function (info) {
        console.log('active', info);
        syncDom.setAttribute('data-sync-state', 'active');
        });

        // This event fires when the replication has written a new document.
        //
        // `info` will contain details about the change.
        // `info.docs` will contain the docs involved in that change.
        syncHandler.on('change', function (info) {
        console.log('change', info);
        });

        // This event fires when replication is completed or cancelled.
        // In a live replication, only cancelling the replication should
        // trigger this event.
        //
        // `info` will contain details about the replication.
        syncHandler.on('complete', function (info) {
        console.log('complete', info);
        });

        // This event fires if a document failed to replicate due to validation
        // or authorization errors.
        syncHandler.on('denied', function (err) {
        console.log('denied', err);
        });

        // This event is fired when the replication is stopped due to an
        // unrecoverable failure. If `retry` is `false`, this will also fire
        // when the user goes offline or another network error occurs
        // (so you can handle retries yourself, if you want).
        syncHandler.on('error', function (err) {
        console.log('error', err);
        syncDom.setAttribute('data-sync-state', 'error');
        });
    }

    addEventListeners();

    if (remoteCouch) {
        sync();
    }
})();