/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('event/create');

        if (typeof req.body.Event === "undefined")
            return res.badRequest("Form-data not received.");

        await Event.create(req.body.Event);

        return res.ok("Successfully created!");
    },

    // action - admin
    admin: async function (req, res) {

        var events = await Event.find();
        return res.view('event/admin', { 'events': events });
    },

    // action - update
    update: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (req.method == "GET") {

            var model = await Event.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('event/update', { 'event': model });

        } else {

            if (typeof req.body.Event === "undefined")
                return res.badRequest("Form-data not received.");

            var models = await Event.update(req.params.id).set({
                name: req.body.Event.name,
                shortInfo: req.body.Event.shortInfo,
                fullInfo: req.body.Event.fullInfo,
                imageSrc: req.body.Event.imageSrc,
                organizer: req.body.Event.organizer,
                date: req.body.Event.date,
                startTime: req.body.Event.startTime,
                endTime: req.body.Event.endTime,
                venue: req.body.Event.venue,
                quota: req.body.Event.quota,
                box: req.body.Event.box
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");
        }
    },

    // action - delete
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Event.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.ok("Record Deleted.");
    },

    // action - home
    home: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 4;

        var events = await Event.find({
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var numOfPage = Math.ceil(await Event.count() / numOfItemsPerPage);

        return res.view('pages/homepage', { 'events': events, 'count': numOfPage });
    },

    // action - view
    view: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('event/view', { 'event': model });
    },
};

