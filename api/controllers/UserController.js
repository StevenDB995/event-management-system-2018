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

            sails.log("Session: " + JSON.stringify(req.session));

            if (req.wantsJSON){
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

};

