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

//socket
const io = new Server(server,{
	cors: {
		origin: "*",
	}
});

let likes = 0;


setInterval(()=>{
	likes++;
	eventEmitter.emit("newdata");
}, 2000);
let user_socketId = []

io.on("connection",async (socket) => {
    user_socketId.push(socket.id)
    //about vue
	socket.emit('likeupdate', likes);

	socket.on('liked', () => {
		likes++;
		socket.emit('likeupdate', likes);
		socket.broadcast.emit('likeupdate', likes) 
	})

    eventEmitter.on('newdata', async ()=>{
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
    
    

    

    //socket vue page
    socket.on("user-connected", (user_id,room) =>{
        if(user_id != ''){
            socket.emit('getMessage', room)
        }
    })
    
    socket.emit('current_user', user_socketId)

    let noti =await Notification.findAll()
    socket.emit('notification', noti)

    eventEmitter.on('new_notification', async ()=>{
        let noti =await Notification.findAll()
        socket.emit('notification', noti)
    })

    
    
});

server.listen(8000, () => {
    console.log(`getWay is running on port 8000`)
})