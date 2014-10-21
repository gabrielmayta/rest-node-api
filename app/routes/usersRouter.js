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

            var fullname = req.body.firstname + ' ' + req.body.lastname;

            var query = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            });

            query.save(function (error) {
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

        .put(function (req, res) {

            var query = User.findByIdAndUpdate(req.params._id, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            });

            query.exec(function (error, success) {
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

            var query = User.remove({_id: req.params._id});

            query.exec(function (error, success) {
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

            var query = User.find({
                email: req.body.email,
                password: req.body.password
            }).select('email firstname lastname');

            query.exec(function (error, user) {
                if (error)
                    res.status(500);
                else if (user.length > 0)
                    res
                        .status(200)
                        .json({user: user});
                else
                    res
                        .status(404)
                        .json({ message: 'Email e/o password errati!' });
            });
        });

    app.use('/api/v1', router);

};
