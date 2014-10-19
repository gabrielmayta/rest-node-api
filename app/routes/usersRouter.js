var User = require('../models/usersModel');

module.exports = function (app, router) {

    router.route('/users')

        .get(function (req, res) {
            User.find(function (error, users) {
                if (error)
                    res.status(500);
                else
                    res
                        .status(200)
                        .json({ users: users});
            });
        })

        .post(function (req, res) {
            var user = new User();
            var fullname = req.body.firstname + ' ' + req.body.lastname;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function (error) {
                if (error)
                    res.status(500);
                else {
                    var socketio = req.app.get('socketio');
                    socketio.sockets.emit('newUser', fullname + ' si è appena registrato');
                    res
                        .status(200)
                        .json({ message: 'Risorsa inserità con successo' });
                }
            });
        });

    router.route('/users/:_id')

        .get(function (req, res) {
            User.find({
                _id: req.params._id
            }, function (error, user) {
                if (error)
                    res.status(500);
                else if (user)
                    res
                        .status(200)
                        .json({ user: user});
                else
                    res
                        .status(404)
                        .json({ message: 'Risorsa non trovata' });
            });
        })

        .put(function (req, res) {
            User.update({
                _id: req.params._id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            }, function (error, success) {
                if (error)
                    res.status(500);
                else if (success)
                    res
                        .status(200)
                        .json({ message: 'Risorsa modificata con successo' });
                else
                    res
                        .status(404)
                        .json({ message: 'Risorsa non trovata' });
            });
        })

        .delete(function (req, res) {
            User.remove({
                _id: req.params._id
            }, function (error, success) {
                if (error)
                    res.status(500);
                else if (success)
                    res
                        .status(200)
                        .json({ message: 'Risorsa cancellata con successo' });
                else
                    res
                        .status(404)
                        .json({ message: 'Risorsa non trovata' });
            });
        });

    router.route('/users/auth')
        .post(function (req, res) {
            User.find({
                email: req.body.email,
                password: req.body.password
            }, function (error, user) {
                if (error)
                    res.status(500);
                else if (user)
                    res
                        .status(200)
                        .json({ user: user});
                else
                    res
                        .status(404)
                        .json({ message: 'Risorsa non trovata' });
            });
        });

    app.use('/api/v1', router);

};
