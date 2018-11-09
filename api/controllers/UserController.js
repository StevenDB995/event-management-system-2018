/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (typeof req.body.username === "undefined") return res.badRequest();
        if (typeof req.body.password === "undefined") return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.status(401);
            return res.send("User not found");
        }

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) {
            res.status(401);
            return res.send("Wrong Password");
        }

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = user.username;
            req.session.role = user.role;
            req.session.uid = user.id;

            sails.log("Session: " + JSON.stringify(req.session));

            if (req.wantsJSON) {
                return res.redirect('/');
            } else {
                return res.ok("Login successfully");
            }

        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/');

        });
    },

    add: async function (req, res) {

        if (req.params.association !== "registers") return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (!await User.findOne(req.params.id)) return res.notFound();

        var event = await Event.findOne(req.params.fk);
        if (!event) return res.notFound();

        if (event.quota == Number.MAX_SAFE_INTEGER) {
            await User.addToCollection(req.params.id, req.params.association).members(req.params.fk);
            return res.ok('Operation completed.');
        }

        if (event.quota > 0) {

            await User.addToCollection(req.params.id, req.params.association).members(req.params.fk);

            await Event.update(req.params.fk).set({
                quota: event.quota - 1
            }).fetch();

            return res.ok('Operation completed.');
        }

        return res.badRequest("The quota is full.");

    },

    remove: async function (req, res) {

        if (req.params.association !== "registers") return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (!await User.findOne(req.params.id)) return res.notFound();

        var event = await Event.findOne(req.params.fk);
        if (!event) return res.notFound();

        await User.removeFromCollection(req.params.id, req.params.association).members(req.params.fk);

        if (event.quota < Number.MAX_SAFE_INTEGER) {

            await Event.update(req.params.fk).set({
                quota: event.quota + 1
            }).fetch();
        }

        return res.ok('Operation completed.');

    },

    registeredEvent: async function (req, res) {

        const message = sails.getInvalidIdMsg(req.params);
        if (message) return res.badRequest(message);

        var user = await User.findOne(req.params.id).populate("registers");
        
        if (!user) return res.notFound();

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        const numOfItemsPerPage = 3;

        var numOfPage = Math.ceil(user.registers.length / numOfItemsPerPage);

        user = await User.findOne(req.params.id).populate("registers", {
            sort: 'date',
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        return res.view('user/registeredEvent', { 'events': user.registers, 'count': numOfPage });
    }

};

