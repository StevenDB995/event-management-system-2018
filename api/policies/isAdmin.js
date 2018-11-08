// isAdmin.js
module.exports = async function (req, res, proceed) {

    const usrname = req.session.username || null;
    var user = await User.findOne({ username: usrname });

    if (user && user.role == "admin") {
        return proceed();   //proceed to the next policy,
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();

};