const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Insurance = require('../models/Insurance')
const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');
const path = require('path');
const generateToken = require('../config/generateToken')
const pdf = require('pdf-parse');
const hbs = require('handlebars');
const fs = require('fs');
const axios = require('axios').default;
require('dotenv').config();

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, wanumber, date } = req.body
    if (!name || !email || !password || !wanumber || !date) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(400).json({ success: false, message: "User Already Exists! Please Login" });
        return
    }
    else {
        const picture = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
        const user = await User.create({ name, fname: name.split(" ")[0], lname: name.split(" ")[1], email, password, picture, waNumber: wanumber, dob: date })
        const userResponse = {
            ...user.toJSON(),
            password: undefined,
        };
        if (user) {
            const token = await generateToken(user._id)
            res.status(200).json({ success: true, message: "User Created Successfully! Redirecting...", token, user: userResponse });
        }
        else {
            res.status(400).json({ success: false, message: "Unable to create user!" });
        }
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        res.status(400).json({ success: false, message: "Please Enter all The Fields!" });
        return;
    }
    const user = await User.findOne({ email: email });
    if (user) {
        if (user.password === password) {
            const token = await generateToken(user._id)
            const userResponse = {
                ...user.toJSON(),
                password: undefined,
            };
            res.status(200).json({ success: true, message: "Login successful", token, user: userResponse });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid Credentials!" });
        }
    }
    else {
        res.status(400).json({ success: false, message: "Invalid Credentials!" });
    }
})

const registerFace = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findById(id)
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.ACCESS_SECRET,
            region: 'ap-south-1'
        })

        const rekognition = new AWS.Rekognition();
        rekognition.listCollections(async (err, data) => {
            if (err) {
                res.status(500);
                return;
            }
            if (data.CollectionIds.includes(process.env.FACE_COLLECTION)) {
                if (!user.hasUserId) {
                    rekognition.createUser({
                        "CollectionId": process.env.FACE_COLLECTION,
                        "UserId": id
                    }, async (err, data) => {
                        if (err) {
                            res.status(400);
                            return;
                        }
                        rekognition.indexFaces({
                            Image: {
                                "Bytes": req.file.buffer
                            },
                            CollectionId: process.env.FACE_COLLECTION,
                            MaxFaces: 1,
                            QualityFilter: "AUTO",
                        }, async (err, data) => {
                            if (err) {
                                res.status(400);
                                return;
                            }
                            rekognition.associateFaces({
                                "CollectionId": process.env.FACE_COLLECTION,
                                "UserId": id,
                                "FaceIds": [data.FaceRecords[0].Face.FaceId]
                            }, async (err, data) => {
                                if (err) {
                                    res.status(400);
                                    return;
                                }
                                if (data.AssociatedFaces.length > 0) {
                                    const newuser = await User.findByIdAndUpdate(id, {
                                        hasUserId: true,
                                        associatedFaces: data.AssociatedFaces.length
                                    }, { new: true }).select("-password")
                                    res.json({ success: true, message: "Uploaded!", user: newuser })
                                    return;
                                }
                                else {
                                    console.log("No Associated Faces")
                                    res.status(400).json({ success: false })
                                    return;
                                }
                            })
                        })
                    })
                }
                else {
                    res.json({ success: false, message: "Already Uploaded!" });
                }
            }
            else {
                rekognition.createCollection({ CollectionId: process.env.FACE_COLLECTION }, async (err, data) => {
                    if (err) {
                        res.status(500);
                        return;
                    }
                    if (!user.hasUserId) {
                        rekognition.createUser({
                            "CollectionId": process.env.FACE_COLLECTION,
                            "UserId": id
                        }, async (err, data) => {
                            if (err) {
                                res.status(400);
                                return;
                            }
                            rekognition.indexFaces({
                                Image: {
                                    "Bytes": req.file.buffer
                                },
                                CollectionId: process.env.FACE_COLLECTION,
                                MaxFaces: 1,
                                QualityFilter: "AUTO",
                            }, async (err, data) => {
                                if (err) {
                                    res.status(400);
                                    return;
                                }
                                rekognition.associateFaces({
                                    "CollectionId": process.env.FACE_COLLECTION,
                                    "UserId": id,
                                    "FaceIds": [data.FaceRecords[0].Face.FaceId]
                                }, async (err, data) => {
                                    if (err) {
                                        res.status(400);
                                        return;
                                    }
                                    if (data.AssociatedFaces.length > 0) {
                                        const newuser = await User.findByIdAndUpdate(id, {
                                            hasUserId: true,
                                            associatedFaces: data.AssociatedFaces.length
                                        }, { new: true }).select("-password")
                                        res.json({ success: true, message: "Uploaded!", user: newuser })
                                        return;
                                    }
                                    else {
                                        console.log("No Associated Faces")
                                        res.status(400).json({ success: false })
                                        return;
                                    }
                                })
                            })
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }
})

const confirmAadharFront = asyncHandler(async (req, res) => {
    const { id: userid, name, fname } = req.body;
    const buffer = req.file.buffer;
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.ACCESS_SECRET,
            region: 'ap-south-1'
        })

        const rekognition = new AWS.Rekognition()

        rekognition.listCollections((err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!data.CollectionIds.includes(process.env.FACE_COLLECTION)) {
                console.log("Coudnt find collection")
                return;
            }

            rekognition.searchUsersByImage({
                "CollectionId": process.env.FACE_COLLECTION,
                "Image": {
                    "Bytes": buffer
                },
                "MaxUsers": 1,
                "UserMatchThreshold": 80
            }, async (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (data.UserMatches.length > 0) {
                    console.log(data.UserMatches[0].User.UserId)
                    const matcheduserid = data.UserMatches[0].User.UserId
                    if (matcheduserid !== userid) {
                        res.status(200).json({ success: false, message: "Different User!" });
                        return;
                    }
                    rekognition.detectText({
                        "Image": {
                            "Bytes": buffer
                        },
                    }, (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const text = data.TextDetections.map((text) => text.DetectedText)
                        if (text.includes(name) || text.includes(fname)) {
                            res.status(200).json({ success: true, message: "User found!" });
                        }
                        else {
                            res.status(200).json({ success: false, message: "Name does not matches!" });
                        }
                    })
                }
                else {
                    res.status(200).json({ success: false, message: "No User found!" });
                    return;
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
})

const confirmAadharBack = asyncHandler(async (req, res) => {
    const { id: userid } = req.body;
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.ACCESS_SECRET,
            region: 'ap-south-1'
        })

        const rekognition = new AWS.Rekognition()

        rekognition.detectText({
            "Image": {
                "Bytes": req.file.buffer
            }
        }, async (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            const text = data.TextDetections.map((text) => text.DetectedText)
            if (text.includes("Address:")) {
                let addindex = text.indexOf("Address:") + 1
                let addarray = []
                for (let i = addindex; i < text.length; i++) {
                    addarray.push(text[i])
                    if (text[i].length === 6 && !isNaN(text[i])) {
                        break;
                    }
                }
                let firstline = addarray.slice(0, Math.ceil(addarray.length / 2)).join(" ")
                let secondline = addarray.slice(Math.ceil(addarray.length / 2), addarray.length).join(" ")
                const user = await User.findByIdAndUpdate(userid, {
                    address: {
                        1: firstline,
                        2: secondline
                    },
                    aadharVerified: true
                }).select("-password")

                res.status(200).json({ success: true, message: "Back Side Verified!", user });
            }
            else {
                res.status(200).json({ success: false, message: "Back Side Not Verified!" });
            }
        })

    } catch (error) {
        console.log(error)
    }
})

function formatDate(inputDate) {
    var parts = inputDate.split('-');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10) + 1;

    // Create a Date object
    var dateObj = new Date(year, month - 1, day);

    // Array of month names
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];

    // Get the month name
    var monthName = monthNames[dateObj.getMonth()];

    // Format the output date
    var formattedDate = day + " " + monthName + " " + year;

    return formattedDate;
}

function halveAddress(address) {
    // Split the address into words
    var words = address.split(" ");

    // Calculate the midpoint index
    var midpointIndex = Math.ceil(words.length / 2);

    // Split the words into two parts
    var firstHalf = words.slice(0, midpointIndex);
    var secondHalf = words.slice(midpointIndex);

    // Join the halves back into strings
    var firstLine = firstHalf.join(" ");
    var secondLine = secondHalf.join(" ");

    return [firstLine, secondLine];
}

const compareinsurance = asyncHandler(async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'No file found' });
    }
    const pdfBuffer = req.file.buffer;
    const filetext = (await pdf(pdfBuffer)).text

    const address = filetext.match(/Address: (.*)/g)[0].split("Address: ")[1]
    var [addressLine1, addressLine2] = halveAddress(address);
    const policy = filetext.match(/Policy: (.*)/g)[0].split("Policy: ")[1]
    const price = Number(filetext.match(/Rs (.*)/g)[0].split("Rs ")[1])
    const dateRegex = /\d{2}-\d{2}-\d{4}/;
    const date = filetext.match(dateRegex)[0]

    const data = {
        terminationdate: formatDate(date),
        premium: price,
        companyName: 'Aditya Birla Capital',
        address: {
            1: addressLine1,
            2: addressLine2
        },
        policyName: policy
    }

    const Benifts = [
        "Coverage for hospitalization expenses",
        "Access to specialist consultations",
        "Prescription drug coverage",
        "Preventive care services, like vaccinations and screenings",
        "Emergency room visits coverage",
        "Surgical procedures coverage",
        "Diagnostic tests and lab work coverage",
        "Mental health services coverage",
        "Maternity and newborn care benefits",
        "Rehabilitation services coverage",
        "Ambulance services coverage",
        "Coverage for home healthcare",
        "Telemedicine services for remote consultations",
        "Coverage for durable medical equipment",
        "Outpatient services coverage",
        "Dental care coverage",
        "Vision care coverage",
        "Coverage for chiropractic care",
        "Coverage for physical therapy",
        "Coverage for occupational therapy",
        "Coverage for hospice care",
        "Coverage for skilled nursing facility care",
        "Access to second opinions",
        "Coverage for clinical trials",
        "Wellness programs and incentives",
        "Chronic disease management programs",
        "Access to a network of healthcare providers",
        "Coverage for medical transportation",
        "Coverage for prosthetic devices",
        "Health savings account contributions",
    ]

    let coveredBenifits = [];
    Benifts.forEach((benifit) => {
        if (filetext.includes(benifit) || filetext.includes(benifit.slice(0,-1))) {
            coveredBenifits.push(benifit)
        }
    })

    let comparedInsurance = await Insurance.find({
        "benifits": { $in: coveredBenifits[coveredBenifits.length - 1] }
    })

    comparedInsurance = comparedInsurance.filter(insurance => insurance.premium < price)
        .sort((a, b) => a.premium - b.premium);

    res.status(200).json({ success: true, message: "File Read!", comparedInsurance, data })
})

const compileTemplate = async (templateName, data) => {
    const filepath = path.join(__dirname, `../template/${templateName}.hbs`);
    const html = fs.readFileSync(filepath, 'utf-8');
    return hbs.compile(html)(data);
}

const getPDF = asyncHandler(async (req, res) => {
    const { userid, opolicyid, cpolicydata } = req.body;
    const user = await User.findById(userid).select("-password").lean()
    const opolicy = await Insurance.findById(opolicyid).lean()

    const cdata = {
        u: user,
        c: cpolicydata,
        terminationdate: cpolicydata.terminationdate
    }
    const odata = {
        u: user,
        c: opolicy,
        terminationdate: cpolicydata.terminationdate
    }
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(await compileTemplate('cancellation', cdata));
        await page.emulateMediaType('screen');
        const pdfBuffer = await page.pdf({
            path: undefined,
            format: 'A4',
            printBackground: true,
            height: '1040',
            width: '745.6',
            landscape: false,
        });

        const form = new FormData();
        form.append("to", user.waNumber)
        form.append("filename", "cancellation.pdf")
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        form.append('file', pdfBlob, "cancellation.pdf");
        await axios.post("http://localhost:8000/api/sendpdf", form)

        await page.setContent(await compileTemplate('onboarding', odata));
        await page.emulateMediaType('screen');
        const pdfBuffer2 = await page.pdf({
            path: undefined,
            format: 'A4',
            printBackground: true,
            height: '1040',
            width: '745.6',
            landscape: false,
        });

        const form2 = new FormData();
        form2.append("to", user.waNumber)
        form2.append("filename", "onboarding.pdf")
        const pdfBlob2 = new Blob([pdfBuffer2], { type: 'application/pdf' });
        form2.append('file', pdfBlob2, "onboarding.pdf");
        await axios.post("http://localhost:8000/api/sendpdf", form2)

        res.json({ success: true })

        await browser.close();
    }
    catch (error) {
        console.log(error)
    }
})


module.exports = { registerUser, loginUser, registerFace, getPDF, confirmAadharFront, confirmAadharBack, compareinsurance }