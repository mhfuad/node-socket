const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const events = require('events')
const cors = require('cors')
const { DataTypes,Sequelize } = require('sequelize');

const app = express();
const server = http.createServer(app);

app.use(express.json({limit: '10mb'}));
app.use(cors());
let eventEmitter = new events.EventEmitter();

//database
const sequelize = new Sequelize('socket', 'fuad', 'esscsmfu2', {
    host: 'localhost',
    dialect: 'mysql',
});

const Notification = sequelize.define('Notification', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    view: {
        type: DataTypes.BOOLEAN
    },
    notification: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
});

app.post('/', async (req, res) => {
    console.log(req.body)
    const { userId, notification } = req.body;
    try {
        const newUser = await Notification.create({ userId, notification });
        res.status(201).json(newUser);
        
        eventEmitter.emit("new_notification")
    } catch (error) {
      res.status(400).json({ message: 'Failed to create user.', error: error.message });
    }
});

app.get('/notification/:user_id', async (req, res) => {
    const not = await Notification.findAll({where:{userId: req.params.user_id}})
    res.status(201).json(not);
})

app.put('/notification/:id', async (req, res) => {
    const not = await Notification.update({view:true},{where:{id: req.params.id}})
    res.status(201).json(not);
})


//socket
const io = new Server(server,{
	cors: {
		origin: "*",
	}
});

let likes = 0;
let users = new Map();
let user_socketId = []

io.on("connection",async (socket) => {
    console.log({Conected :socket.id})
    
    //about vue
	socket.emit('likeupdate', likes);

	socket.on('liked', () => {
		likes++;
		socket.emit('likeupdate', likes);
		socket.broadcast.emit('likeupdate', likes) 
	})

    socket.on('custom-event', (number, string, obj)=>{
        console.log(number, string, obj)
    })

    socket.on('send-message', message =>{
        /* including sender send message to all
        *   io.emit('receive-message', message);
        */
        //except sender send message to all
        socket.broadcast.emit('receive-message', message);
    })

    socket.on('send_to', (message, room) => {
        if(room != ""){
            socket.to(room).emit('user_message', message)
        }
    })
    //************************ */
    //socket vue page
    socket.on("user-connected", async (user_id) =>{
        const data = await Notification.count({where:{userId: user_id}})
        socket.emit('getNotificationCount', data)
        users.set(socket.id, user_id)
        //cb(data)
        socket.emit('current_user', Array.from(users) )
        socket.broadcast.emit('current_user', Array.from(users) )
    })
    
    socket.emit('current_user', Array.from(users) )

    eventEmitter.on('new_notification', async ()=>{
        let noti =await Notification.findAll()
        socket.emit('notification', noti)
    })

    socket.on('disconnect',()=>{
        console.log({Discconected : socket.id})
        
        users.delete(socket.id)
        socket.emit('current_user', Array.from(users) )
        socket.broadcast.emit('current_user', Array.from(users) )
    })

    socket.on('user_remove', user_id =>{
        console.log(user_id)
        user_socketId.pop(user_id)
    })
});

server.listen(8001, () => {
    console.log(`=============> Server running on port 8001`)
})