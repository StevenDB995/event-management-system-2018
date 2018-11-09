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

        var dateElem = req.body.Event.date.split('/');

        await Event.create({
            name: req.body.Event.name,
            shortInfo: req.body.Event.shortInfo,
            fullInfo: req.body.Event.fullInfo,
            imageSrc: req.body.Event.imageSrc,
            organizer: req.body.Event.organizer,
            date: new Date(dateElem[2], dateElem[1] - 1, dateElem[0]),
            startTime: req.body.Event.startTime,
            endTime: req.body.Event.endTime,
            venue: req.body.Event.venue,
            quota: req.body.Event.quota,
            box: req.body.Event.box
        }).fetch();

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

            var dateElem = req.body.Event.date.split('/');

            var models = await Event.update(req.params.id).set({
                name: req.body.Event.name,
                shortInfo: req.body.Event.shortInfo,
                fullInfo: req.body.Event.fullInfo,
                imageSrc: req.body.Event.imageSrc,
                organizer: req.body.Event.organizer,
                date: new Date(dateElem[2], dateElem[1] - 1, dateElem[0]),
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

    // action - showRegistration
    showRegistration: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id).populate("admits");

        if (!model) return res.notFound();

        return res.json(model);
    },

    // action - home
    home: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 4;

        var highlightedEvents = await Event.find({
            where: { box: 'highlighted' }
        });

        var numOfPage = Math.ceil(highlightedEvents.length / numOfItemsPerPage);

        var events = await Event.find({
            where: { box: 'highlighted' },
            sort: 'date',
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        return res.view('pages/homepage', { 'events': events, 'count': numOfPage });
    },

    // action - view
    view: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id);
        if (!model) return res.notFound();

        if (req.session.role == 'student') {
            var user = await User.findOne({ username: req.session.username }).populate("registers");

            var registered = false;
            for (var i = 0; i < user.registers.length; i++) {
                if (user.registers[i].id == model.id) {
                    registered = true;
                    break;
                }
            }

            return res.view('event/view', { 'event': model, 'registered': registered });
        }

        return res.view('event/view', { 'event': model });
    },

    // action - search
    search: async function (req, res) {

        const qName = req.query.name || "";
        const qOrganizer = req.query.organizer || "";
        const qStartDate = req.query.startDate || "01/01/1970";
        const qEndDate = req.query.endDate || "31/12/2099";
        const qVenue = req.query.venue || "";

        const sDateElem = qStartDate.split('/');
        const eDateElem = qEndDate.split('/');

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 2;

        var results = await Event.find({
            where: { name: { 'contains': qName }, organizer: { 'contains': qOrganizer }, date: { '>=': new Date(sDateElem[2], sDateElem[1] - 1, sDateElem[0]), '<=': new Date(eDateElem[2], eDateElem[1] - 1, eDateElem[0]) }, venue: { 'contains': qVenue } },
            sort: 'name'
        });

        var numOfPage = Math.ceil(results.length / numOfItemsPerPage);

        var events = await Event.find({
            where: { name: { 'contains': qName }, organizer: { 'contains': qOrganizer }, date: { '>=': new Date(sDateElem[2], sDateElem[1] - 1, sDateElem[0]), '<=': new Date(eDateElem[2], eDateElem[1] - 1, eDateElem[0]) }, venue: { 'contains': qVenue } },
            sort: 'name',

            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        return res.view('event/search', { 'events': events, 'count': numOfPage, 'qName': qName, 'qOrganizer': qOrganizer, 'qStartDate': qStartDate, 'qEndDate': qEndDate, 'qVenue': qVenue });
    }
};

