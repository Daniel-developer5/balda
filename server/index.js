const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const { resolve } = require('path')

app.use(express.json())
app.use(require('cors')())
require('dotenv').config()

const mongoose = require('mongoose')
const UserModel = require('./models/UserModel')

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

app.post('/login-form', async (req, res) => {
    const { email, password, signUp, } = req.body

    if (signUp) {
        await UserModel.findOne({ email, }, (err, result) => {
            if (err) {
                res.send({ error: true, })
                return
            }

            if (result) {
                res.send({ error: true, notAvailableEmail: true, definedError: true, })
            } else {
                bcrypt.hash(password, SALT_ROUNDS).then(async password => {
                    const user = new UserModel({ email, password, })

                    try {
                        await user.save()
                        res.send({ token: user._id, })
                    } catch (err) {
                        res.send({ error: true, })
                    }
                }).catch(err => res.send({ error: true, }))
            }
        })

        return
    }

    await UserModel.findOne({ email, }, (err, result) => {
        if (err) {
            res.send({ error: true, })
            return
        }

        if (!result) {
            res.send({ error: true, notRegisteredEmail: true, definedError: true, })
        } else {
            bcrypt.compare(password, result.password).then(same => {
                if (!same) {
                    res.send({ error: true, incorrectPassword: true, definedError: true, })
                    return
                }

                res.send({ token: result._id, })
            }).catch(err => res.send({ err: true }))
        }
    })
})

app.get('/get-user/:id', async (req, res) => {
    const { id, } = req.params
    
    await UserModel.findById(id, (err, result) => {
        if (err) {
            res.send({ error: true, })
            return
        }

        const { email, _id: token, } = result

        res.send({ email, token, })
    })
})

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
})
const { v4: uuidv4 } = require('uuid')

const onlineUsers = {}

io.on('connection', socket => {
    socket.emit('in-online', Object.keys(onlineUsers))

    socket.on('go-online', email => {
        if (onlineUsers[email]) {
            return
        }

        onlineUsers[email] = socket.id
        socket.broadcast.emit('in-online', email)
    })

    socket.on('disconnect', () => {
        const leavedUser = Object.keys(onlineUsers)[
            Object.entries(onlineUsers).findIndex(user => user[1] === socket.id)
        ]

        socket.broadcast.emit('out-online', leavedUser)
        delete onlineUsers[leavedUser]
    })

    socket.on('leave-user', email => {
        socket.broadcast.emit('out-online', email)
        delete onlineUsers[email]
    })

    socket.on('invite', ({ email, receiver, }) => {
        io.to(onlineUsers[email]).emit('invite', receiver)
    })

    socket.on('decline-invite', email => {
        socket.broadcast.emit('invite-declined', email)
    })

    socket.on('stop-invite', email => {
        io.to(onlineUsers[email]).emit('stop-invite')
    })

    socket.on('accepted-invite', email => {
        const id = uuidv4()

        socket.join(id)
        io.to(onlineUsers[email]).emit('accepted-invite', id)
    })

    const getRoom = room => io.sockets.adapter.rooms.get(room)
    const getPlayerEmail = id => Object.entries(onlineUsers).filter(user => user[1] === id)[0][0]

    socket.on('join-room', room => {
        if (getRoom(room).size === 1) {
            socket.join(room)

            const [player1, player2] = getRoom(room)

            io.in(room).emit('start-game', { 
                player1: getPlayerEmail(player1), 
                player2: getPlayerEmail(player2),
            })
            socket.to(room).emit('set-turn')
        }
    })

    socket.on('made-step', ({ word, lastStep, letter, }) => {
        const { rooms } = io.sockets.adapter

        const room = [...rooms].filter(room => room[1].size === 2 && room[1].has(socket.id))[0][0]

        socket.to(room).emit('made-step', ({ word, lastStep, letter, }))
    })
})

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(resolve(__dirname, 'build')))

    app.get('*', (req, res) => {
        res.sendFile(resolve(__dirname, 'build', 'index.html'))
    })
}

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))