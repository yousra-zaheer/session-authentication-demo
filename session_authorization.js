import express from 'express';
import cookieParser  from 'cookie-parser';
import session from 'express-session';

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser()); //cookie-parser middleware

//session middleware
app.use(session({
  secret:'sample-secret',
  resave:false,
  saveUninitialized:true
}))

const users=[]

app.get('/',(req,res)=>{
  res.send('Hello Express')
})

app.post('/Register',async(req,res)=>{
  const {username,password}=req.body;
  users.push({
    username,
    password
  })
  res.send('user registered')
})
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);
    const user = users.find(u => u.username === username)
    if (!user) {
      console.log('User not found');
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
      });
      return res.send('Not authorised')
    }
    console.log(`User found: ${user.username}`);
    if (user.password !== password) {
      console.log('Password mismatch');
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
      });
      return res.send('Not authorised')
    }
    req.session.user = user;
    console.log('Login successful, session set');
    res.send('user logged in')
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error')
  }
})


app.get('/dashboard', (req, res) => {
  console.log('Accessing dashboard');
  console.log(req.session);
  if (!req.session.user) {
    console.log('No user in session');
    return res.send('Unauthorised')
  }
  console.log('User in session:', req.session.user);
  res.send(`Welcome ${req.session.user.username}`)
})


  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });