import app from './app';
import Users from './models/userModel';

const port = process.env.PORT || '3000';
app.listen(port, function () {
    console.log('Bootstrapping');
    Users.find({ isAdmin: true }, (err, users) => {
        if (users.length < 1) {
            const generatedAdmin = new Users({ 'username': 'Default Admin', 'email': 'Admin@backendJWT.com', 'password': 'password', 'isAdmin': true });
            generatedAdmin.save(err => {
                if (err) console.log(err);
                console.log(generatedAdmin);
            })
        }
    })
});

console.log(`Listening on port ${port}`);