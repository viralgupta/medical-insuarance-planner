const express = require('express')
const { registerUser, loginUser, registerFace, compareinsurance, getPDF, confirmAadharFront, confirmAadharBack } = require('./userController')
const { protect } = require('../middlewear/authMiddleware')
const multer = require('multer')
// const Insurance = require('../models/Insurance')
// const User = require('../models/User')
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const userRoutes = express.Router()

userRoutes.route('/signup').post(registerUser)
userRoutes.route('/login').post(loginUser)
userRoutes.route('/registerface').post(protect, upload.single('fileContent'), registerFace)
userRoutes.route('/confirmaadharfront').post(upload.single('fileContent'), confirmAadharFront)
userRoutes.route('/confirmaadharback').post(upload.single('fileContent'), confirmAadharBack)
userRoutes.route('/compareinsurance').post(upload.single('fileContent'), compareinsurance)
userRoutes.route('/getpdf').post(protect, getPDF)

userRoutes.route('/random').post(upload.single('fileContent'), async (req, res) => {
    const formData = new FormData();
    formData.append(
        "file",
        req.file.buffer.toString('base64')
    );

    const options = {
        headers: {
            "x-api-key": process.env.PDF_API,
            ...formData.getHeaders(),
        },
    };
    axios
        .post("https://api.chatpdf.com/v1/sources/add-file", formData, options)
        .then((response) => {
            console.log("Source ID:", response.data.sourceId);
        })
        .catch((error) => {
            console.log("Error:", error.message);
            console.log("Response:", error.response.data);
        });

    res.json({ success: true })
})

module.exports = userRoutes