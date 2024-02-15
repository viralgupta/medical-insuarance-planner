require('dotenv').config()
const express = require('express')
var cors = require('cors')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const app = express()
app.use(cors())
app.use(express.json())


let client;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to mongo")

    client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('remote_session_saved', () => {
        console.log("remote session saved")
    })

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('disconnected', () => {
        console.log('Client is disconnected!');
    });

    client.on('authenticated', () => {
        console.log('Client is authenticated!');
    });

    client.on('auth_failure', () => {
        console.log('Client is auth_failure!');
    });

    client.initialize();
});



app.use(upload.single('file')).post('/api/sendpdf', async (req, res) => {
    const {to, filename} = req.body;
    try {
        const media = new MessageMedia('application/pdf', req.file.buffer.toString('base64'), `${filename}`);
        await client.sendMessage(`91${to}@c.us`, media)
    } catch (error) {
        console.log(error)
    }
    finally{
        res.json({success: true})
    }
});

app.listen(8000, () => { console.log("Backend Started at port", 8000) })
